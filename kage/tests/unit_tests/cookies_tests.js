define(['kage.loader', 'QUnit'], function(kage, QUnit) {
    module('kage.util');
    test('kage.util.cookie', function() {
        kage.util.cookie.set('TestCookie', 'Test', {expires: 100});
        var cookie = kage.util.cookie.get('TestCookie');

        equal(cookie, 'Test', 'read/write cookies successful');

        kage.util.cookie.destroy('TestCookie');


        equal(kage.util.cookie.get('TestCookie'), null, 'cookie deletion successful');
    });
});