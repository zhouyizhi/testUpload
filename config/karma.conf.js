const argv = require('yargs').argv;

module.exports = function (config) {
    const options = {
        //logLevel: config.LOG_DEBUG,
        files: [
            './karma-test-shim.js'
        ],
        autoWatch: true,
        singleRun: false,
        frameworks: ['jasmine'],
        //browsers: ['Chrome', 'Firefox', 'PhantomJS'],
        browsers: ['PhantomJS'],
        reporters: ['dots', 'mocha', 'coverage', 'karma-remap-istanbul', 'html'],
        preprocessors: {
            './karma-test-shim.js': ['webpack', 'sourcemap']
        },
        webpack: require('./webpack.test.config'),
        webpackMiddleware: {
            stats: 'errors-only'
        },
        coverageReporter: {
            dir: '../test-results/coverage',
            file: 'coverage.json',
            subdir: 'json',
            type: 'json'
        },
        remapIstanbulReporter: {
            src: './test-results/coverage/json/coverage.json',
            reports: {
                html: './test-results/coverage/html',
                lcovonly: './test-results/coverage/lcov/coverage.lcov',
                text: null
            }
        },
        htmlReporter: {
            outputDir: './test-results/',
            namedFiles: true,
            reportName: 'report'
        }
    };

    // if (argv.coverage) {
    //     options.reporters = [
    //         'coverage',
    //         'karma-remap-istanbul',
    //         'html'
    //     ];

    //     options.coverageReporter = {
    //         dir: '../coverage',
    //         file: 'coverage.json',
    //         subdir: 'json',
    //         type: 'json'
    //     };

    //     options.remapIstanbulReporter = {
    //         reports: {
    //             html: 'coverage'
    //         }
    //         // src: 'coverage/json/coverage.json',
    //         // reports: {
    //         //     html: 'coverage/html',
    //         //     lcovonly: 'coverage/lcov/coverage.lcov',
    //         //     text: null
    //         // },
    //         // timeoutNotCreated: 5000, // default value
    //         // timeoutNoMoreFiles: 5000 // default value
    //     };
    // }

    config.set(options);
};