define(['kage.loader','QUnit'], function(kage, QUnit) {
    module('kage.util');
    test('kage.util.HashMap', function() {
        throws(function() {
            new kage.util.HashMap([]);
        }, Error, 'throws an exception if constructor input is not a plain object');
        
        var map = new kage.util.HashMap({one: 1, two: 2, three: 3});
        
        equal(map.size(), 3, 'create a hasmap with 3 elements. size() should be 3.');
        
        ok(map.has('one'), 'has(\'one\') should be true');
        ok(!map.has('undef'), 'has(\'undef\') should be false');
        
        ok(map.contains(1), 'contains(1) should be true');
        ok(!map.contains('undef'), 'contains(\'undef\') should be false');
        
        equal(map.add('four', 4).size(), 4, 'adding an item successful');
        
        equal(map.get('four'), 4, 'get("four") should return 4');
        
        map.remove('four');
        ok(map.size() === 3 && map.get('four') === undefined, 'remove item successful');
        
        throws(function() {
            map.extend([]);
        }, Error, 'extend should throw an exception if input data is invalid');
        
        map.extend({four: 4, five: 5});
        equal(map.size(), 5, 'extend({four: 4, five: 5}) successful');
        
        equal(typeof($.parseJSON(map.to_json())), 'object', 'to_json successful');
    });
});