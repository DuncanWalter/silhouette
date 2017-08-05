import { compose, each, where, inject, remove, lens } from '~/optics/optics.js'
import { createStore } from 'redux'

// TODO if(module.hot){module.hot.accept();}


let store;

// effective private class properties
const __path__ = new Symbol('path');
const __reducers__ = new Symbol('reducers');

class Silhouette {

    constructor(...path){
        this[__path__] = path;
        this[__reducers__] = [];
    }

    inject(val, ...path){
        store.dispatch({ 
            type: '__INJECT__', 
            val: val,
            path: this[__path__].concat(path) 
        });
    }

    remove(...path){
        store.dispatch({ 
            type: '__REMOVE__',
            path: this[__path__].concat(path) 
        });
    }

    dispatch(type, payload){
        if(payload === undefined){
            store.dispatch(type);
        } else {
            payload.type = type;
            store.dispatch(payload);
        }
    }

    extend(reducer){
        this[__reducers__].push(reducer);
    }

}

// global root silhouette
const sil = new Silhouette();



var reduceState = [
    each(), // select each member
    lens(), // 
    where(o => (o instanceof Object || o instanceof Array)), 
    reduceState,
];
reduceState = compose(...reduceState);





function globalReducer(state = {}, action){
    switch(action.type){
        case '__INJECT__':
            let { val, path } = action;
            let injector = inject(path.pop(), val);
            return compose(...path, injector).exec(state);

        case '__REMOVE__':
            let path = action.path;
            let remover = remove(path.pop());
            return compose(...path, remover).exec(state);

        default:

            break;
    }

}

store = createStore(globalReducer, );