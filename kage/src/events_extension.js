
(function($) {
    /**
     * A list of event associations
     * @class EventAssocList
     * @returns {EventAssocList}
     */
    var EventAssocList = function() {
        this.list = [];
    };
    EventAssocList.prototype = {
        /**
         * Add an event association to the list and bind the event
         * @param {type} object
         * @param {type} type
         * @param {type} fn
         * @returns {EventAssocList}
         */
        add: function(object, type, fn) {
            if (this.key(object, type, fn) === -1) {
                this.list.push({
                    object: object,
                    type: type,
                    handler: fn
                });  
            }
            
            object.on(type, fn);
            
            return this;
        },
        
        /**
         * Get an item by index
         * @param {number} index
         * @returns {Array}
         */
        get: function(index) {
            return this.list[index];
        },
        
        /**
         * Find a element from the list
         * @param {type} object
         * @param {type} type
         * @param {type} fn
         * @param {type} selector
         * @returns {object}
         */
        find: function(object, type, fn) {
            var index = this.key(object, type, fn);

            return this.get(index);
        },
        
        /**
         * Get the index of an object in the list
         * @param {type} object
         * @param {type} type
         * @param {type} fn
         * @param {type} selector
         * @returns {Number}
         */
        key: function(object, type, fn) {
            var i = 0;
            for (; i < this.length(); i++) {
                var item = this.list[i];
                if (item.object === object &&
                        item.type === type &&
                        item.handler === fn) {
                    return i;
                }
            }

            return -1;
        },
        
        /**
         * Get the number of items in the list
         * @returns {number}
         */
        length: function() {
            return this.list.length;
        },
        
        /**
         * Deletes an item associated with an index, and unbinds the 
         * corresponding event
         * @param {type} index
         * @returns {EventAssocList}
         */
        removeItem: function(index) {
            if (index !== -1) {
                var event = this.get(index);

                event.object.off(event.type, event.handler);

                this.list.splice(index, 1);
            }
            
            return this;
        },
        
        /**
         * Remove all the items that match the input parameters
         * @param {type} [object]
         * @param {type} [type]
         * @param {type} [fn]
         * @param {type} [selector]
         * @returns {EventAssocList}
         */
        remove: function(object, type, fn) {
            var i, length = this.list.length;
            // .remove() - removes all items
            if(!object) {
                return this.removeAll();
            }
            
            // .remove(object) - removes all items that match the object
            if (object && !type) {
                for (i = length - 1; i >= 0; i--) {
                    if (this.list[i].object === object) {
                        this.removeItem(i);
                    }
                }
                
                return this;
            }
            
            // .remove(object, type) - removes all items that match the 
            // object and event type
            if(object && type && !fn) {
                for (i = length - 1; i >= 0; i--) {
                    if (this.list[i].object === object &&
                        this.list[i].type === type) {
                    
                        this.removeItem(i);
                    }
                }
                
                return this;
            }
            
            
            // .remove(object, type, fn,[selector]) - removes the item that 
            // matches the input
            return this.removeItem(this.key(object, type, fn));
        },
        
        /**
         * Removes all the intems in the list and unbinds all of the 
         * corresponing events
         * @returns {EventAssocList}
         */
        removeAll: function() {
            var i = this.list.length - 1;
            for (; i >= 0; i--) {
                this.removeItem(i);
            }

            return this;
        }
    };

    /**
     * Data structure that holds element ids and a list of external events
     * @static
     * @class EventAssocData
     * @type {Object}
     */
    var EventAssocData = {
        /**
         * @property {number} assoc_index autoincrementing value used as index for element
         */
        assoc_index: 1,
        
        /**
         * @property {object} data data structure
         */
        data: {},
        
        /**
         * @property {string} property element property name in wich the element index will be saved
         */
        property: '__event_assoc_data__',
        
        /**
         * Checks if object is a valid
         * @param {type} object
         * @returns {Boolean}
         */
        accepts: function(object) {
            return object.nodeType ?
                    object.nodeType === 1 || object.nodeType === 9 : true;
        },
        
        /**
         * Gets or creates a key and returns it
         * @param {object} object
         * @returns {Number}
         */
        key: function(object) {
            if (!EventAssocData.accepts(object)) {
                return 0;
            }
            
            var key = object[EventAssocData.property];
            if (!key) {
                var descriptior = {};
                key = EventAssocData.assoc_index;

                try {
                    descriptior[EventAssocData.property] = {
                        value: key
                    };

                    Object.defineProperties(object, descriptior);
                } catch (e) {
                    descriptior[EventAssocData.property] = key;

                    $.extend(object, descriptior);
                }

                EventAssocData.assoc_index++;
            }

            if (!EventAssocData.data[key]) {
                EventAssocData.data[key] = new EventAssocList();
            }

            return key;
        },
        
        /**
         * checks if an element exists in the data structure
         * @param {object} object
         * @returns {Boolean}
         */
        has: function(object) {
            var key = object[EventAssocData.property];
            if(key) {
                return key in EventAssocData.data;
            }
            
            return false;
        },
        
        /**
         * Get event associations corresponding to a given object
         * @param {object} object
         * @returns {object}
         */
        get: function(object) {
            var key = EventAssocData.key(object),
                    data = EventAssocData.data[key];
            
            return data;
        },
        
        /**
         * Removes an item from the data struct
         * @param {object} object
         * @returns {undefined}
         */
        remove: function(object) {
            if(!EventAssocData.has(object)) {
                return;
            }
            
            var key = EventAssocData.key(object),
                data = EventAssocData.data[key];
        
            if(data) {
                data.removeAll();
            }
            
            delete(EventAssocData.data[key]);
        }
    };
    
    /**
     * Class that gives fast access to the event association data structure
     * @class EventAssoc
     * @static
     * @type {Object}
     */
    var EventAssoc = {
        /**
         * Adds an item
         * @param {type} owner
         * @param {type} other
         * @param {type} types
         * @param {type} fn
         * @param {type} selector
         * @param {type} data
         * @returns {undefined}
         */
        add: function(owner, other, types, fn) {
            var list = EventAssocData.get(owner);
            if (list) {
                list.add(other, types, fn);
            }
        },
        
        /**
         * Removes an item
         * @param {type} owner
         * @param {type} other
         * @param {type} types
         * @param {type} fn
         * @param {type} selector
         * @returns {undefined}
         */
        remove: function(owner, other, types, fn) {
            if(!EventAssocData.has(owner)) {
                return;
            }
            
            var list = EventAssocData.get(owner);
            if(list) {
                list.remove(other, types, fn);
            }
        }
    };

    var returnFalse = function() {
        return false;
    };
    
    /**
     * Start listening to an external jquery object
     * @param {jQuery} other
     * @param {string|object} types
     * @param {funcion} fn
     * @returns {jQuery}
     */
    $.fn.listenTo = function(other, types, fn) {
        if (
            !other.on ||
            !other.one ||
            !other.off
        ) {
            throw new TypeError("jQuery object expected.");
        }
        
        if(fn === false) {
            fn = returnFalse;
        } else if(!fn) {
            return this;
        }

        return this.each(function() {
            EventAssoc.add(this, other, types, fn);
        });
    };
    
    /**
     * Start listening to an external jquery object (ONCE)
     * @param {jQuery} other
     * @param {string|object} types
     * @param {function} fn
     * @returns {jQuery}
     */
    $.fn.listenToOnce = function(other, types, fn) {
        var _this = this;
        callback = function() {
            _this.stopListening(other, types, callback);
            return fn.apply(this, arguments);
        };

        return this.listenTo(other, types, callback);
    };
    
    /**
     * Stop listening to an external jquery object
     * @param {jQuery} [other]
     * @param {string|object} [types]
     * @param {function} [fn]
     * @returns {jQuery}
     */
    $.fn.stopListening = function(other, types, fn) {

        if (other && (
            !other.on ||
            !other.one ||
            !other.off
        )) {
            throw new TypeError("jQuery object expected.");
        }
        
        if(fn === false) {
            fn = returnFalse;
        }

        return this.each(function() {
            EventAssoc.remove(this, other, types, fn);
        });
    };
    
    /**
     * Get all the event associations connected to the current jQuery object
     * @returns {null|Array}
     */
    $.fn.externalListeners = function() {
        var data = [];
        this.each(function() {
            if(EventAssocData.has(this)) {
                data.push(EventAssocData.get(this));
            }
        });
        
        if(data.length > 0) {
            return data;
        }
        
        return null;
    };

    // override cleanData method to clear existing event associations
    // cleans all event associations
    // unbinds all the external events
    // this will be executed when you use remove() or empty()
    var cleanData = $.cleanData;

    $.cleanData = function(elems) {
        var i = 0;
        for (; i < elems.length; i++) {
            if (elems[i] !== undefined &&
                EventAssocData.has(elems[i])) {
                EventAssocData.remove(elems[i]);
            }
        }
        return cleanData(elems);
    };
})($);

