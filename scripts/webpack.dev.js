var webpack = require('webpack');
var extend = require('./webpack.base');
var shell = require('shelljs');

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

var lcr = 0;

compiler.watch({
    aggregateTimeout: 3000, 
    poll: 3000,
}, (err, stat) =>{
    console.log(err !== null ? err : '> running bundle...');

    now = (new Date()).getUTCMilliseconds();
    cov = now - lcr > 60000 ? '--cov ' : '';
    lcr = now - lcr > 60000 ? now : lcr;

    try {
        shell.exec(__dirname + '/../node_modules/.bin/tap ' + cov + __dirname + '/../dist/index.bundle.js');
    } catch(err){
        console.error(err);
    }
});
