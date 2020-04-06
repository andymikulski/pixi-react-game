const path = require('path');
const webpack = require('webpack');

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
    context: ROOT,

    entry: {
        'main': './main.tsx'
    },

    output: {
        filename: '[name].bundle.js',
        path: DESTINATION,
        publicPath: '/',
    },

    resolve: {
        alias: {
            "react": "preact/compat",
            "react-dom/test-utils": "preact/test-utils",
            "react-dom": "preact/compat",
        },
        extensions: ['.ts', '.tsx', '.js'],
        modules: [
            ROOT,
            'node_modules'
        ]
    },

    module: {
        rules: [
            /****************
            * PRE-LOADERS
            *****************/
            {
                enforce: 'pre',
                test: /\.js$/,
                use: 'source-map-loader'
            },
            {
                enforce: 'pre',
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: 'tslint-loader'
            },

            /****************
            * LOADERS
            *****************/
            {
                test: /\.(ts|tsx)$/,
                exclude: [ /node_modules/ ],
                use: 'awesome-typescript-loader'
            },
            {
                test: /\.(png|jpg|gif|mp3|jpeg|wav)$/,
                exclude: [ /node_modules/ ],
                use: 'url-loader'
            }
        ]
    },

    devtool: 'cheap-module-source-map',
    devServer: {}
};

