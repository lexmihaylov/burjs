define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage.util');
    test('kage.util.Collection', function() {
        var collection = new kage.util.Collection(1, 2, 3);
        equal(collection.length, 3, 'collection init successful');
        var iterator = 0;

        collection.each(function() {
            iterator++;
        });

        equal(iterator, 3, 'interation with .each successful');

        collection.push(4);

        equal(iterator + 1, collection.length, 'push executed successfully');

        collection.remove(iterator);

        equal(iterator, collection.length, 'remove(index) successful');

        iterator = 0;
        collection.each(function(item, index) {
            iterator++;
            if (index === 1) {
                return false;
            }
        });

        equal(iterator, 2, 'breakout of .each successful');

        var ext = [4, 5, 6];

        collection.extend(ext);

        equal(collection.length, 6, '<collection>.extend successful');

        throws(function() {
            collection.extend(null);
        }, 'if we pass something different than an array to .extend it should throw an exception');

        equal(typeof ($.parseJSON(collection.toJson())), 'object', 'JSON conversion successful');
        
        ok(collection.has(0), 'has(0) shold be true');
        ok(!collection.has(10), 'has(10) should be false');
        
        ok(collection.contains(4), 'contains(4) shold be true');
        ok(!collection.contains(10), 'contains(10) should be false');

    });
});