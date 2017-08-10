import { compose, each, where, inject, remove, optic, chain, view } from '~/src/optics/optics.js'
import { createStore } from 'redux'

// TODO if(module.hot){module.hot.accept();} TODO store state to a global for recovery

// non colliding action types
const __INJECT__ = Symbol('__INJECT__');
const __REMOVE__ = Symbol('__REMOVE__');
const __DELEGATE__ = Symbol('__DELEGATE__');

// non-colliding class properties
const __path__ = Symbol('path');
const __reducers__ = Symbol('reducers');
const __push__ = Symbol('push');
const __store__ = Symbol('store');
const __root__ = Symbol('root');
const __create__ = Symbol('spawn');

function defineSilhouette(){

    class Silhouette {

        [__create__](parent, member){
            let sil = new Silhouette();
            sil[__path__] = parent ? [...parent[__path__], member] : [];
            sil[__reducers__] = [];
            if( parent !== undefined ){ parent[member] = sil; }
            return sil;
        }

        inject(val, ...path){
            this[__store__].dispatch({ 
                type: __INJECT__, 
                val: val,
                path: [ ...this[__path__], ...path ], 
                sil: this[__root__],
            });
        }

        remove(...path){
            this[__store__].dispatch({ 
                type: __REMOVE__,
                path: [ ...this[__path__], ...path ],
                sil: this[__root__],
            });
        }

        dispatch(type, payload, globally = false){
            this[__store__].dispatch({ 
                type: __DELEGATE__,
                path: globally ? [] : this[__path__],
                payload: Object.assign({ type }, payload),
                sil: this[__root__],
            });
        }

        extend(reducer){
            this[__reducers__].push(reducer);
        }

        [__push__]({ value, done }){ /*/ OVERWRITE WITH PLUGINS /*/ }

    }

    return Silhouette;
}



// contort is a knarly optical function which reduces over 
// a state while continuously updating its silhouette and 
// emitting to relevant streams. This function is the main
// motivation for the creation of the entire optics module.
function contort({ state, sil, action }){

    let transitional = sil[__reducers__].reduce((a, r) => {
        return r(a, action);
    }, state);

    if(transitional === undefined || transitional === null){
        throw new Error('Reducers should not return undefined or null. Perhaps there was a missed return statement?');
    }

    if(transitional !== state){
        // TODO will Object keys play nice with arrays?
        Object.keys(sil).forEach(key => {
            if(!transitional.hasOwnProperty(key)){
                sil[key][__push__]({ done: true });
                delete sil[key];
            }
        });

        Object.keys(transitional).forEach(key => {
            if(!sil.hasOwnProperty(key)){
                sil[__create__](sil, key);
            }
        });
    }

    let itr = Object.keys(transitional)[Symbol.iterator]();

    let fun = frag => {return{ state: frag, action: action, sil: sil[itr.next().value] }};

    let final = view(compose(each(), fun, contort), transitional);

    if(final != state){
        sil[__push__]({ done: false, value: final });
    }

    return final;
}

// an optic wrapping the standard pluck optic to
// activate silhouette streams on change detection
function traverse(member){
    return optic(({ state, sil, action }, next) => {
        return view(compose(member, (fragment) => {
            if(!sil[member]){ sil[__create__](sil, member); }
            let ret = next({ state: fragment || {}, sil: sil[member], action });
            if(ret !== state){
                sil[member][__push__]({ done: false, value: ret });
            }
            return ret;
        }), state)
    });
}

function repsert(val){
    return optic(({state, sil}) => {
        Object.keys(val).forEach(key => {
            if(!sil || !sil.hasOwnProperty(key)){
                sil[__create__](sil, key);
                view(repsert(val[key]), { state: undefined, sil: sil[key] });
            }
        });
        if(val !== state){
            sil[__push__]({ done: false, value: val });
        }
        return val;
    });
}

function erase(member){
    return optic(({state, sil}) => {
        let _state = state;
        if(state.hasOwnProperty(member)){
            _state = Object.keys(state).reduce((a, k) => {
                a[k] = state[k];
                return a;
            }, {});
            delete _state[member];
            sil[member][__push__]({ done: true });
            delete sil[member];
        }
        return _state;
    });
}

function globalReducer(state = {}, action){
    let path, payload, val, sil = action.sil;
    switch(action.type){

        case __INJECT__:
            ({ val, path } = action);
            let inject = compose(...path.map(traverse), repsert(val));
            return view(inject, { state, sil });

        case __REMOVE__:
            ({ path } = action);
            let eraser = erase(path.pop());
            let remove = compose(...path.map(traverse), eraser);
            return view(remove, { state, sil });

        case __DELEGATE__:
            ({ path, payload } = action);
            let dispatch = compose(...path.map(traverse), contort);
            return view(dispatch, { state, sil, action });

        case '@@redux/INIT':
            return state;

        default:
            throw new Error('silhouette is meant to abstract all interaction with the data store; do not interact with it directly');
            return undefined;

    }

}

// // global root silhouette
// store = createStore(globalReducer);
// export default sil = new Silhouette(store);

export function create(...plugins){

    let namespace = { 
        Silhouette: defineSilhouette(),
        /*/ beforeDestroy, /*/
        /*/ afterCreate, /*/
        createStore: createStore,
        createSil: (store) => {
            let sil = namespace.Silhouette.prototype[__create__]();
            namespace.Silhouette.prototype[__store__] = store;
            namespace.Silhouette.prototype[__root__] = sil;
            return sil;
        },
        symbols: { __push__, __create__, __reducers__ },
    }

    plugins.forEach(p => p(namespace));

    return namespace.createSil(namespace.createStore(globalReducer));

}
