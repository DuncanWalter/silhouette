import { compose, each, where, inject, remove, optic, chain, view } from '~/src/optics/optics.js'
import { createStore } from 'redux'

// TODO if(module.hot){module.hot.accept();} TODO store state to a global for recovery

let store, sil;

// effective private class properties
const __path__ = Symbol('path');
const __reducers__ = Symbol('reducers');
const __stream__ = Symbol('stream');

class Silhouette {

    constructor(...path){
        this[__path__] = path;
        this[__reducers__] = [];
        this[__stream__] = {};
    }

    inject(val, ...path){
        store.dispatch({ 
            type: '__INJECT__', 
            val: val,
            path: this[__path__].concat(path), 
        });
    }

    remove(...path){
        store.dispatch({ 
            type: '__REMOVE__',
            path: this[__path__].concat(path),
        });
    }

    dispatch(type, payload, globally = false){
        if(globally){
            store.dispatch(Object.assign({ type: type }, payload));
        } else {
            store.dispatch({ 
                type: '__DELEGATE__',
                path: this[__path__].concat(path),
                payload: Object.assign({ type: type }, payload),
            });
        }
    }

    extend(reducer){
        this[__reducers__].push(reducer);
    }

    listen(){

    }

}

// contort is a knarly optical function which reduces over 
// a state while continuously updating its silhouette and 
// emitting to relevant streams. This function is the main
// motivation for the creation of the entire optics module.
function contort({ state, sil, action }){

    let transitional = sil[__reducers__].reduce((a, r) => {
        return r(a, action);
    }, state);

    if(transitional !== state){
        // TODO will Object keys play nice with arrays?
        Object.keys(sil).forEach(key => {
            if(!key in transitional){
                delete sil[key]; // TODO terminate streams
            }
        });

        Object.keys(transitional).forEach(key => {
            if(!key in sil){
                sil[key] = new Silhouette(...sil[__path__], key);
            } else if(key in Silhouette.prototype){
                throw new Error('Property names inject, remove, dispatch, and extend are reserved and may not be used.');
            }
        });
    }

    let itr = Object.keys(transitional)[Symbol.iterator]();

    let fun = frag => {return{ state: frag, action: action, sil: itr.next().value }};

    let final = view(compose(each(), fun, contort), transitional);

    if(final != state){
        // TODO trigger observable
    }

    return final;
}

// an optic wrapping the standard pluck optic to
// activate silhouette streams on change detection
function traverse(member){
    return optic(({ state, sil, action }, next) => {
        return view(compose(member, (fragment) => {
            if(!sil[member]){ sil[member] = new Silhouette(...sil[__path__], member); }
            let ret = next({ state: fragment || {}, sil: sil[member], action });
            if(ret !== state){
                // TODO activate the sil stream
            }
            return ret;
        }), state)
    });
}

function repsert(val){
    return optic(({state, sil}) => {
        if(val !== state){
            // TODO trip streams
        }
        Object.keys(val).forEach(key => {
            if(!sil || !sil.hasOwnProperty(key)){
                sil[key] = new Silhouette(...sil[__path__], key);
                view(repsert(val[key]), { state: val[key], sil: sil[key] });
            }
        });
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

            // TODO end streams

            delete sil[member];
        }
        return _state;
    });
}

function globalReducer(state = {}, action){
    let path, payload, val;
    switch(action.type){
        case '__INJECT__': // TODO make non-colliding symbols
            ({ val, path } = action);
            let inject = compose(...path.map(traverse), repsert(val));
            return view(inject, { state, sil });

        case '__REMOVE__':
            ({ path } = action);
            let eraser = erase(path.pop()); // TODO custom optic TODO kill streams
            let remove = compose(...path.map(traverse), eraser);
            return view(remove, { state, sil });

        case '__DELEGATE__':
            ({ path, payload } = action);
            // TODO 
            compose(...path.map(traverse), contort);
            throw new Error('NYI');
            return 'TODO' // remove.exec(state); 

        default:

            break;
    }

}

// global root silhouette
export default sil = new Silhouette();
store = createStore(globalReducer);