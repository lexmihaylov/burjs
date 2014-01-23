/**
 * Provides functionality for creating application models
 * @class Model
 */
kage.Model = kage.Class({
    _construct: function() {
        /**
         * @var {HashMap<String, Array>} _events holds the event callbacks
         */
        this._events = new kage.util.HashMap();
    }
});

/**
 * Used to define static methods for initializing models
 * @static
 * 
 * @param {function} child_class the child model class
 */
kage.Model.Define = function(child_class) {

    /**
     * Creates a new model an initializes it's properties
     * @static
     * 
     * @param {object} parameters object attributes
     * @return {Model} the newly created model
     */
    child_class.create = function(parameters) {
        var model = new child_class();

        for (var i in parameters) {
            if (parameters.hasOwnProperty(i)) {
                model[i] = parameters[i];
            }
        }

        return model;
    };

    /**
     * Creates a collection of models with initialized properties
     * @static
     * 
     * @param {Array} array array of parameteres
     * @return {Collection} a collection of models
     */
    child_class.create_from_array = function(array) {
        var model_collection = new kage.util.Collection();

        for (var i = 0; i < array.length; i++) {
            model_collection.push(child_class.create(array[i]));
        }

        return model_collection;
    };
};

kage.Model.prototype._normalize_types = function(types) {
    if(typeof(types) === 'string') {
        if(types.indexOf(',') === -1) {
            types = [types];
        } else {
            types = $.map(types.split(','), $.trim);
        }
    } else if(!types instanceof Array) {
        throw new Error("'types' can be a String or Array.");
    }
    
    return types;
};

/**
 * Adds an event to the event map of the object
 * @param {Array|String} types the event'(s) name(s)
 * @param {function} callback the callback function
 * @param {boolean} one execute the handler once
 * @return {kage.Model.prototype}
 */
kage.Model.prototype.on = function(types, callback, one) {
    
    types = this._normalize_types(types);
    
    for(var i = 0; i < types.length; ++i) {
        var type = types[i];
        if (!this._events.has(type)) {
            this._events.add(type, new kage.util.Collection);
        }
        if(one === true) {
            var fn = callback;
            var _this = this;
            callback = function() {
                _this.off(type, fn);
                fn.apply(this, arguments);
            };
        }
        
        if(this._events[type].indexOf(callback) === -1) {
            this._events[type].push(callback);
        }
    }

    return this;
};

/**
 * Adds an event handler that will be executed once
 * @param {type} types
 * @param {type} callback
 * @return {kage.Model.prototype@call;on}
 */
kage.Model.prototype.one = function(types, callback) {
    return this.on(types, callback, true);
};


/**
 * Unbind an event handler
 * @param {type} types handler type(s)
 * @param {type} callback handler callback
 * @return {kage.Model.prototype}
 */
kage.Model.prototype.off = function(types, callback) {
    types = this._normalize_types(types);
    for(var i = 0; i < types.length; ++i) {
        var type = types[i];
        
        if(this._events.has(type)) {
            var index = this._events[type].indexOf(callback);
            if(index !== -1) {
                this._events[type].remove(index);
            }
        }
    }
    
    return this;
};

/**
 * triggers an event from the object's event map
 * 
 * @param {string} type the event name
 * @patam {data} data object to be passed to the handler
 * @return {Model}
 */
kage.Model.prototype.trigger = function(type, data) {
    if (this._events.has(type)) {
        var _this = this;
        var event = {
            type: type,
            timeStamp: Date.now(),
            target: this
        };
        this._events[type].each(function(item) {
            if (typeof item === 'function') {
                item.call(_this, event, data);
            }
        });
    }

    return this;
};

/**
 * An alias for trigger method
 * @param {type} type
 * @param {type} data
 * @returns {kage.Model}
 */
kage.Model.prototype.triggerHandler = function(type, data) {
    return this.trigger(type, data);
};

/**
 * converts the object to json string
 * 
 * @return {string}
 */
kage.Model.prototype.to_json = function() {
    JSON.stringify(this);
};



