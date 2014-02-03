var ApplicationConfig = {
    
};

requirejs.config({
    urlArgs: Date.now(),
    paths: {
        'kage': '../kage',
        'QUnit': 'libs/qunit'
    },
    shim: {
        QUnit: {
            exports: 'QUnit',
            init: function() {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});

require(['QUnit',
    'unit_tests/oo_tests',
    'unit_tests/cookies_tests',
    'unit_tests/async_task_tests',
    'unit_tests/http_tests',
    'unit_tests/collection_tests'
], function(QUnit, 
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