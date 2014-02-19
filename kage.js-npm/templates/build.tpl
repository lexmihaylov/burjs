({
    appDir: "public_html/",
    baseUrl: "js/",
    dir: "build",
    logLevel: 0,
    paths: {
        sections: 'app/sections',
        models: 'app/models',
        helpers: 'app/helpers',

        jquery: 'libs/jquery'
    },

    shim: {
        'jquery': {
            exports: 'jQuery'
        }
    },

    modules: [
        {
            name: "main"
        }
    ]
})