define(['kage.loader', 'QUnit'], function(kage, QUnit) {
    module('kage');
    
    test('kage.Model', function() {
        var model = new kage.Model();
        ok(model instanceof kage.Model, 'create model instance successful');
        
        throws(function() {
            kage.Model.create(null);
        }, Error, 'kage.Model.create(null) should throw an exception.');
        
        throws(function() {
            kage.Model.create({model_var: 1}, {});
        }, Error, 'kage.Model.create({model_var: 1}, {}) should throw an exception');
        
        throws(function() {
            kage.Model.create_from_array(null);
        }, Error, 'kage.Model.create_from_array(null) should throw an exception');
        
        var model1 = kage.Model.create({model_var: 1}, kage.Model);
        var is_valid_model = false;
        
        if((model1 instanceof kage.Model) && model1.model_var === 1) {
            is_valid_model = true;
        }
        ok(is_valid_model, 'kage.Model.create({model_var: 1}) creates a valid model');
        
        is_valid_model = false;
        var model_collection = kage.Model.create_from_array([{model_var: 1}], kage.Model);
        
        if(model_collection instanceof kage.util.Collection &&
                model_collection[0].model_var === 1) {
            is_valid_model = true;
        }
        
        ok(is_valid_model, 'kage.Model.create_from_array([{model_var: 1}]) creates a valid model collection');
        
        var callback = function() {};
        model.on('update', callback);
        
        ok(model._events.has('update'), ".on('update', callback) successful");
        
        model.off('update', callback);
        ok(!model._events.get('update').contains(callback), ".off('update', callback) successful");
        
        var on_counter = 0;
        callback = function() {
            on_counter ++;
        };
        
        var one_counter = 0;
        var one_callback = function() {
            one_counter ++;
        };
        
        model.on('event', callback);
        model.one('event', one_callback);
        model.trigger('event').triggerHandler('event');
        
        ok(on_counter > 0, "model.trigger('event') successfull");
        
        equal(on_counter, 2, "model.triggerHandler('event') successfull");
        
        equal(on_counter, 2, 'on() handelers executions equals the number of triggers');
        
        equal(one_counter, 1, 'one() handlers should be executed only once');
        
        var types = model._normalize_types('event1, event2');
        var types_ok = false;
        
        if($.isArray(types) && types[0] === 'event1' && types[1] === 'event2') {
            types_ok = true;
        }
        
        ok(types_ok, "_normalize_types('event1, event2') => ['event1', 'event2']");
        
        types = model._normalize_types(['event1', 'event2']);
        types_ok = false;
        
        if($.isArray(types) && types[0] === 'event1' && types[1] === 'event2') {
            types_ok = true;
        }
        
        ok(types_ok, "_normalize_types(['event1', 'event2']) => ['event1', 'event2']");
        
        throws(function() {
            model._normalize_types(null);
        }, Error, "_normalize_types(null) throws an exception");
    });
});