requirejs.config({
    urlArgs: Date.now(),
    paths: {
        'kage': '../kage',
        'QUnit': 'libs/qunit',
        'blanket': 'libs/blanket',
        'jquery': 'libs/jquery'
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
                blanket.options('filter', '../kage');
            }
        }
    }
});

require(['QUnit','blanket'], function(QUnit) {
    
    require(['kage'], function(kage) {
        kage.config({
            viewArgs: Date.now()
        });
        
        require([
            'unit_tests/oo_tests',
            'unit_tests/cookies_tests',
            'unit_tests/async_task_tests',
            'unit_tests/http_tests',
            'unit_tests/collection_tests',
            'unit_tests/hash_map_tests',
            'unit_tests/component_tests',
            'unit_tests/model_tests',
            'unit_tests/view_tests',
            'unit_tests/section_tests'
        ], function() {
            // load and start qunit
            QUnit.load();
            QUnit.start();
        });
    });
    
});