import { create as __create__ } from 'silhouette-core'
import rxjsPlugin               from 'silhouette-plugin-rxjs'
import reduxPlugin              from 'silhouette-plugin-redux'

import { composeWithDevTools }  from 'redux-devtools-extension';
import { createLogger }         from 'redux-logger'

let reduxConfig = {
    middleware: [ createLogger() ],
    compose: composeWithDevTools,
}
export let create = (...plugins) => __create__(rxjsPlugin(), reduxPlugin(reduxConfig), ...plugins);