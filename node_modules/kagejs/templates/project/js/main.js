requirejs.config({
    urlArgs: Date.now(), // no cache
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
    }
});

require([
    'sections/Main',
    'config/application'
],
// main application function (starter)
function(Main) {
    Main.init();
});


