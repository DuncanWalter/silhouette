(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory(require("silhouette-core"), require("silhouette-plugin-rxjs"), require("silhouette-plugin-redux"), require("redux-devtools-extension"), require("redux-logger")); else if (typeof define === "function" && define.amd) define([ "silhouette-core", "silhouette-plugin-rxjs", "silhouette-plugin-redux", "redux-devtools-extension", "redux-logger" ], factory); else if (typeof exports === "object") exports["silhouette"] = factory(require("silhouette-core"), require("silhouette-plugin-rxjs"), require("silhouette-plugin-redux"), require("redux-devtools-extension"), require("redux-logger")); else root["silhouette"] = factory(root["silhouette-core"], root["silhouette-plugin-rxjs"], root["silhouette-plugin-redux"], root["redux-devtools-extension"], root["redux-logger"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__) {
    return function(modules) {
        var installedModules = {};
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports;
            }
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = true;
            return module.exports;
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function(exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    configurable: false,
                    enumerable: true,
                    get: getter
                });
            }
        };
        __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function getDefault() {
                return module["default"];
            } : function getModuleExports() {
                return module;
            };
            __webpack_require__.d(getter, "a", getter);
            return getter;
        };
        __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.create = undefined;
        var _silhouetteCore = __webpack_require__(1);
        var _silhouettePluginRxjs = __webpack_require__(2);
        var _silhouettePluginRxjs2 = _interopRequireDefault(_silhouettePluginRxjs);
        var _silhouettePluginRedux = __webpack_require__(3);
        var _silhouettePluginRedux2 = _interopRequireDefault(_silhouettePluginRedux);
        var _reduxDevtoolsExtension = __webpack_require__(4);
        var _reduxLogger = __webpack_require__(5);
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        let reduxConfig = {
            middleware: [ (0, _reduxLogger.createLogger)() ],
            compose: _reduxDevtoolsExtension.composeWithDevTools
        };
        let create = exports.create = ((...plugins) => (0, _silhouetteCore.create)(...plugins, (0, 
        _silhouettePluginRxjs2.default)(), (0, _silhouettePluginRedux2.default)(reduxConfig)));
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_1__;
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_2__;
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_3__;
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_4__;
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_5__;
    } ]);
});