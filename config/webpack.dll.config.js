'use strict'

const webpack = require("webpack");
const env = process.env.ENV;

const vendors = [
    "@angular/common",
    "@angular/compiler",
    "@angular/compiler-cli",
    "@angular/core",
    "@angular/forms",
    "@angular/http",
    "@angular/platform-browser",
    "@angular/platform-browser-dynamic",
    "@angular/router"
];

const config = {
    output: {
        path: './www/lib',
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": vendors,
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        })
    ],
    node: {
        fs: "empty"
    }
};

module.exports = config;