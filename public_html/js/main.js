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
    'libs/kage',
    'config/application'
],
// main application function (starter)
function(kage) {
    kage.startApp().progress(function() {
                
    }).done(function() {

    });
});


