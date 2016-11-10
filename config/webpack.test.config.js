'use strict'

const webpack = require("webpack");
const argv = require('yargs').argv;
const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
const ENV_DEVELOPMENT = (NODE_ENV === 'dev');
const ENV_PRODUCTION = (NODE_ENV === 'prod');
const ENV_TEST = (NODE_ENV === 'test');

const config = {
    resolve: {
        extensions: ['', '.js', '.ts'],
        modulesDirectories: ['node_modules'],
        //root: path.resolve('.')
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.html$/,
                loader: 'raw'
            }
        ],
        postLoaders: [
            {
                test: /\.ts$/,
                loader: 'istanbul-instrumenter-loader',
                include: path.resolve('src'),
                exclude: [
                    /-spec\.ts$/,
                    /node_modules/
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),

        // new webpack.optimize.CommonsChunkPlugin({
        //     name: ['vendor', 'polyfills'],
        //     minChunks: Infinity
        // }),
    ],
    devtool: 'inline-source-map',
    ts: {
        compilerOptions: {
            inlineSourceMap: true,
            sourceMap: false
        }
    }
}

module.exports = config;