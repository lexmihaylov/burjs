define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage.util');
    test('kage.util.Collection', function() {
        var collection = new kage.util.Collection(1, 2, 3);
        equal(collection.length, 3, 'collection init successfull');
        var iterator = 0;

        collection.each(function() {
            iterator++;
        });

        equal(iterator, 3, 'interation with .each successfull');

        collection.push(4);

        equal(iterator + 1, collection.length, 'push executed successfully');

        collection.remove(iterator);

        equal(iterator, collection.length, 'remove(index) successfull');

        iterator = 0;
        collection.each(function(item, index) {
            iterator++;
            if (index === 1) {
                return false;
            }
        });

        equal(iterator, 2, 'breakout of .each successfull');

        var ext = [4, 5, 6];

        collection.extend(ext);

        equal(collection.length, 6, '<collection>.extend successfull');

        throws(function() {
            collection.extend(null);
        }, 'if we pass something different than an array to .extend it should throw an exception');

        equal(typeof ($.parseJSON(collection.to_json())), 'object', 'JSON conversion successfull');

    });
});