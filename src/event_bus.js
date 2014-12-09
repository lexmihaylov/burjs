kage.EventBus = kage.Class({
    _construct: function () {
        /**
         * @property {HashMap<String, Array>} _events holds the event callbacks
         */
        this._events = new kage.util.HashMap();
    }
});

kage.EventBus.prototype._normalizeTypes = function (types) {
    if (typeof (types) === 'string') {
        if (types.indexOf(',') === -1) {
            types = [types];
        } else {
            types = $.map(types.split(','), $.trim);
        }
    } else if (!(types instanceof Array)) {
        throw new Error("'types' can be a String or Array.");
    }

    return types;
};

/**
 * Adds an event to the event map of the object
 * @param {Array|String} types the event'(s) name(s)
 * @param {function} callback the callback function
 * @param {boolean} one execute the handler once
 * @return {kage.EventBus}
 */
kage.EventBus.prototype.on = function (types, callback, /* INTENAL */ one) {

    types = this._normalizeTypes(types);

    for (var i = 0; i < types.length; ++i) {
        var type = types[i];
        if (!this._events.has(type)) {
            this._events.add(type, new kage.util.Collection);
        }
        if (one === true) {
            var fn = callback;
            var _this = this;
            callback = function () {
                _this.off(type, callback);
                fn.apply(this, arguments);
            };
        }

        if (this._events.get(type).indexOf(callback) === -1) {
            this._events.get(type).push(callback);
        }
    }

    return this;
};

/**
 * Adds an event handler that will be executed once
 * @param {type} types
 * @param {type} callback
 * @return {kage.EventBus}
 */
kage.EventBus.prototype.one = function (types, callback) {
    return this.on(types, callback, true);
};


/**
 * Unbind an event handler
 * @param {type} types handler type(s)
 * @param {type} callback handler callback
 * @return {kage.EventBus}
 */
kage.EventBus.prototype.off = function (types, callback) {
    types = this._normalizeTypes(types);
    for (var i = 0; i < types.length; ++i) {
        var type = types[i];

        if (this._events.has(type)) {
            var index = this._events.get(type).indexOf(callback);
            if (index !== -1) {
                this._events.get(type).remove(index);
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
 * @return {kage.EventBus}
 */
kage.EventBus.prototype.trigger = function (type, data) {
    if (this._events.has(type)) {
        var _this = this;
        var event = {
            type: type,
            timeStamp: Date.now(),
            target: this
        };
        this._events.get(type).each(function (item) {
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
 * @returns {kage.EventBus}
 */
kage.EventBus.prototype.triggerHandler = function (type, data) {
    return this.trigger(type, data);
};