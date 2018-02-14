// karma.conf.ts
module.exports = (config) => {
    config.set({
        autoWatch: true,
        basePath: "",
        browsers: ["Chrome"],
        client:{
            clearContext: false, // leave Jasmine Spec Runner output visible in browser
        },
        colors: true,
        coverageIstanbulReporter: {
            fixWebpackSourcePaths: true,
            reports: [ "html", "lcovonly" ],
        },
        files: [
            {pattern: "src/typescript/**/*.ts", watched: true, included: true, served: true, nocache: false},
        ],
        frameworks: ["jasmine", "karma-typescript"],
        karmaTypescriptConfig: {
            bundlerOptions: {
                transforms: [
                    require("karma-typescript-es6-transform")(),
                ],
            },
            compilerOptions: {
                module: "commonjs",
            },
            tsconfig: "./tsconfig.json",
        },
        logLevel: config.LOG_INFO, // LOG_INFO or LOG_DEBUG
        plugins: [
            require("karma-typescript"),
            require("karma-jasmine"),
            require("karma-chrome-launcher"),
            require("karma-jasmine-html-reporter"),
            require("karma-coverage-istanbul-reporter"),
        ],
        port: 9876,
        preprocessors: {
            "**/*.ts": ["karma-typescript"], // *.tsx for React Jsx
        },
        reporters: ["progress", "karma-typescript", "kjhtml"],
        singleRun: false,
    });
};
