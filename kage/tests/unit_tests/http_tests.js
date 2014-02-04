define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage.util');
    
    asyncTest('kage.util.Http(simple)', function() {
        var http = new kage.util.Http('resources/http.json', true);

        http.on_success(function(data) {
            equal(typeof (data), 'string', 'http request successful');
            start();
        });

        http.get();
    });

    asyncTest('kage.util.Http(json)', function() {
        var http = new kage.util.Http('resources/http.json', true, 'json');

        http.on_success(function(data) {
            equal(typeof (data), 'object', 'http request successful (retrieved object)');
            start();
        });

        http.get();
    });

    test('kage.util.Http(sync)', function() {
        var http = new kage.util.Http('resources/http.html');
        var response = null;
        http.on_success(function(data) {
            response = data;
        }).get();

        equal(response, 'http_req', 'sync http request successful');
    });

    test('kage.util.Http(fail)', function() {
        var http = new kage.util.Http('resources/missing.html');

        var success = true;
        var fail = false;

        http.on_success(function() {
            success = false;
        });
        http.on_fail(function(data) {
            fail = true;
        });
        http.get();

        ok(success, 'on_success callback was NOT executed');
        ok(fail, 'on_fail callback was executed');
    });
});