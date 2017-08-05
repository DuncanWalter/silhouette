var webpack = require('webpack');
var extend = require('./webpack.base');
var shell = require('shelljs');
// const Mem = require('memory-fs');
// var eval = require('eval');
// let mem = new Mem();

////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////

let config = extend({
    entry: './src/test.js',
    externals: {
        tap: 'tap',
    },
    devtool: 'cheap-eval-source-map',
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
    ],
});

////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////
//====================================================================//
////////////////////////////////////////////////////////////////////////

let compiler = webpack(config);

// compiler.outputFileSystem = mem;

compiler.watch({
    aggregateTimeout: 3000, 
    poll: 3000,
}, (err, stat) =>{
    console.log(err !== null ? err : '> running bundle...');
    try {
        shell.exec(__dirname + '/../node_modules/.bin/tap ' + __dirname + '/../dist/index.bundle.js');
    } catch(err){
        console.error(err);
    }
});
