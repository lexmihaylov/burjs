define(['kage.loader', 'QUnit'], function(kage, QUnit) {
    module('kage');
    test('kage.Component', function() {
        throws(function() {
            new kage.Component('text');
        }, 'throws an exception on invalid input');
        
        var component = new kage.Component();
        equal(component.constructor, jQuery, 'inheriting jQuery successful');
        
        equal(component.kage_object(), component, 'has a reference of object provided by .data(__KAGAMI__)');
        //equal()
    });
});