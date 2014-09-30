/**
 * Provides functionality for creating application models
 * @class Model
 */
kage.Model = kage.Class({
    extends: kage.EventBus, 
    _construct: function() {
        kage.Model._super(this);
        
        /**
         * @property {Object} _data model data
         */
        this._data = {};
    }
});

/**
 * Creates a new model an initializes it's properties
 * @static
 *
 * @param {object} parameters object attributes
 * @return {Model} the newly created model
 */
kage.Model.create = function(parameters, model_class) {
    if(!model_class) {
        model_class = kage.Model;
    }

    if(typeof(model_class) !== 'function') {
        throw new Error('model_class has to be a class constructor');
    }

    var model = new model_class();
    if(!$.isPlainObject(parameters)) {
        throw new Error('Input should be a javascript object');
    }

    model.loadObject(parameters);

    return model;
};

/**
 * Creates a collection of models with initialized properties
 * @static
 *
 * @param {Array} array array of parameteres
 * @return {Collection} a collection of models
 */
kage.Model.createFromArray = function(array, model_class) {
    if(!$.isArray(array)) {
        throw new Error('Input should be an array');
    }

    var model_collection = new kage.util.Collection();

    for (var i = 0; i < array.length; i++) {
        model_collection.push(kage.Model.create(array[i], model_class));
    }

    return model_collection;
};

/**
 * Fetches a json object from a url and create a collection of models
 * @param {type} model_class
 * @param {type} opt
 */
kage.Model.fetch = function(model_class, opt) {
    if(typeof(model_class) === 'object') {
        opt = model_class;
        model_class = undefined;
    }

    var success = opt.success;

    var load = function(response) {
        var models = kage.Model.createFromArray(response, model_class);

        if(typeof(success) === 'function') {
            success(models, response);
        }
    };

    opt.success = load;
    $.ajax(opt);
};

/**
 * Feches a json object from a url and creates a model object
 * @param {type} model_class
 * @param {type} opt
 * @returns {undefined}
 */
kage.Model.fetchOne = function(model_class, opt) {
    if(typeof(model_class) === 'object') {
        opt = model_class;
        model_class = undefined;
    }

    var success = opt.success;

    var load = function(response) {
        var model = skage.Model.create(response, model_class);

        if(typeof(success) === 'function') {
            success(model, response);
        }
    };

    opt.success = load;
    $.ajax(opt);
};

/**
 * Set a model data property
 * @param {string} property property name
 * @param {mixed} value property value
 * @returns {kage.Model}
 */
kage.Model.prototype.set = function(property, value) {
    if(typeof(property) === 'object') {
        return this.loadObject(property);
    }

    this._data[property] = value;

    this.trigger('change:' + property, value);
    this.trigger('change', {property: property, value: value});

    return this;
};

/**
 * Get a model data property
 * @param {string} property
 * @returns {mixed}
 */
kage.Model.prototype.get = function(property) {
    return this._data[property];
};

/**
 * Get all data attributes
 * @returns {object}
 */
kage.Model.prototype.getAll = function() {
    return this._data;
};

/**
 * Loads the moddel attributes from an object.
 * @param {object} object
 * @returns {kage.Model}
 */
kage.Model.prototype.loadObject = function(object) {
    if(!$.isPlainObject(object)) {
        throw new TypeError("Javascript object is required");
    }

    for(var i in object) {
        if(object.hasOwnProperty(i)) {
            this._data[i] = object[i];
            this.trigger('change:' + i);
        }
    }

    this.trigger('change');

    return this;
};

