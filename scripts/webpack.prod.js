const webpack = require('webpack');
const extend = require('./webpack.base');

const config = extend({
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        }),
    ],
});

console.log("> Starting production build...");

webpack(config, ()=>{
    console.log("> Completed production build!");
});

