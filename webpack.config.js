'use strict';

module.exports = {   
    // webpack configuration
    entry: './app.js',
    output: {
        filename: __dirname + '/bundle.js'
    },
    devServer: {
        inline: true,
        // contentBase: './app',
        port: 8100
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: [ /webpack.config.js/, /node_modules/ ],
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015'],
                }
            }
        ]
    }
}

// webpack devserver is installed globally in the Node cache
// contentBase is the default top level folder in this app
// test: /\.(js|jsx)$/,   // does the above take care of the js/jsx issue?
// With webpack devserver served to localhost:8100 and waits for the bundle to // be compiled.  Hence takes forever for the first launch.
// Need to try to get HotModuleReplacement (Livereload) working
