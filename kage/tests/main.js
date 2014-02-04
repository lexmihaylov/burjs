var ApplicationConfig = {
    
};

requirejs.config({
    //urlArgs: Date.now(),
    paths: {
        'kage': '../kage',
        'QUnit': 'libs/qunit',
        'blanket': 'libs/blanket'
    },
    shim: {
        QUnit: {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        },
        blanket: {
            exports: 'blanket',
            deps: ['QUnit'],
            init: function() {
                //blanket.options('debug', true);
                blanket.options('filter', 'kage');
            }
        }
    }
});

require(['QUnit', 'blanket'], function(QUnit, blanket) {

    require([
        'unit_tests/oo_tests',
        'unit_tests/cookies_tests',
        'unit_tests/async_task_tests',
        'unit_tests/http_tests',
        'unit_tests/collection_tests'
    ], function(
        OOTests,
        Cookies,
        AsyncTask,
        Http,
        Collection
    ) {
        // run tests
        OOTests();
        Cookies();
        AsyncTask();
        Http();
        Collection();
        // load and start qunit
        QUnit.load();
        QUnit.start();
    });
    
});