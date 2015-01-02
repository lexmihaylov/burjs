/**
 * Application Model
 * @class bur.Model
 */
bur.Model = bur.Class({
    extends: bur.EventBus,
    _construct: function() {
        bur.ViewModel._super(this);
        
        /**
         * @property {Object} _data model data
         * @private
         */
        this._data = {};
    }
});

/**
 * Set a model data property
 * @param {string} property property name
 * @param {mixed} value property value
 * @returns {bur.Model}
 */
bur.Model.prototype.set = function(property, value) {
    if(typeof(property) === 'object') {
        this._data = property;
        this.trigger('change:*', property);
        this.trigger('change', {property: null, value: property});
    }

    eval('this._data.' + property + ' = value;');

    this.trigger('change:' + property, value);
    this.trigger('change', {property: property, value: value});

    return this;
};

/**
 * Get property's value
 * @param {string} property
 * @returns {mixed}
 */
bur.Model.prototype.get = function(property) {
    if(!property) {
        // retuns a reference to the data object
        return this._data;
    }
    
    return eval('this._data.' + property);
};