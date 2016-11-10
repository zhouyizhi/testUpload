'use strict'

const webpack = require("webpack");
const env = process.env.ENV;

const config = {
    entry: {
        app: './src/main.ts'
    },
    output: {
        filename: './js/app.bundle.js',
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules|test/,
                loader: "tslint"
            }
        ],
        loaders: [
            {
                test: /\.ts$/,
                exclude: /node_modules|test/,
                loader: 'ts-loader'
            },
            {
                test: /\.html$/,
             
                loader: 'raw'
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../manifest.json'),
        }),
    ]
}

if (env === 'production') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
    config.devtool = 'source-map';
} else {
    config.devtool = 'eval-cheap-module-source-map';
}

module.exports = config;