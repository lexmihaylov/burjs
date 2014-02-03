define(['kage','QUnit'], function(kage, QUnit) {
    return function() {
        test('kage.util.cookie', function() {
            kage.util.cookie.set('TestCookie', 'Test', {expires: 100});
            var cookie = kage.util.cookie.get('TestCookie');

            equal(cookie, 'Test', 'read/write cookies successfull');
            
            //kage.util.cookie.destroy('TestCookie');
            
            //equal(kage.util.cookie.get('TestCookie'), null, 'cookie deletion successfull');
        });
    };
});