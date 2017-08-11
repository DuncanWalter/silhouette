import { applyMiddleware, createStore, compose } from 'redux'

export let reduxEnhancePlugin = ({ enhancements, middleware, initialState }) => namespace => {
    namespace.createStore = (reducer) => createStore(reducer, initialState, compose(applyMiddleware(...middleware), ...enhancements));
}

export default reduxEnhancePlugin;
