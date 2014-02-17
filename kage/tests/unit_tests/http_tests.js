define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage.util');
    
    asyncTest('kage.util.Http(simple)', function() {
        var http = new kage.util.Http('resources/http.json', true);

        http.onSuccess(function(data) {
            equal(typeof (data), 'string', 'http request successful');
            start();
        });

        http.get();
    });

    asyncTest('kage.util.Http(json)', function() {
        var http = new kage.util.Http('resources/http.json', true, 'json');

        http.onSuccess(function(data) {
            equal(typeof (data), 'object', 'http request successful (retrieved object)');
            start();
        });

        http.get();
    });

    test('kage.util.Http(sync)', function() {
        var http = new kage.util.Http('resources/http.html');
        var response = null;
        http.onSuccess(function(data) {
            response = data;
        }).get();

        equal(response, 'http_req', 'sync http request successful');
    });

    test('kage.util.Http(fail)', function() {
        var http = new kage.util.Http('resources/missing.html');

        var success = true;
        var fail = false;

        http.onSuccess(function() {
            success = false;
        });
        http.onFail(function(data) {
            fail = true;
        });
        http.get();

        ok(success, 'onSuccess callback was NOT executed');
        ok(fail, 'onFail callback was executed');
    });
});