import { compose, each, where, inject, remove, optic, chain, view } from '~/optics/optics.js'
import { createStore } from 'redux'

// TODO if(module.hot){module.hot.accept();} TODO store state to a global for recovery


let store;

// effective private class properties
const __path__ = Symbol('path');
const __reducers__ = Symbol('reducers');

class Silhouette {

    constructor(...path){
        this[__path__] = path;
        this[__reducers__] = [];
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
// emitting to relevant streams. 
function contort({state, sil, action}){

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









// global root silhouette
const sil = new Silhouette();




function globalReducer(state = {}, action){
    switch(action.type){
        case '__INJECT__':
            let { val, path } = action;
            let injector = inject(path.pop(), val);
            return view(compose(...path, injector), state);

        case '__REMOVE__':
            let { path } = action;
            let remover = remove(path.pop());
            let remove = compose(...path, remover);
            // view(remove.exec(sil); // TODO mutable though TODO kill streams
            return view(remove, state);

        case '__DELEGATE__':
            let { path, payload } = action;
            // TODO 
            throw new Error('NYI');
            return 'TODO' // remove.exec(state); 

        default:

            break;
    }

}

store = createStore(globalReducer, );