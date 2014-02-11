
(function($) {
    var EventAssocList = function() {
        this.list = [];
    };
    
    EventAssocList.prototype = {
        add: function(object, type, fn, selector, data) {
            if (this.key(object, type, fn, selector, data) === -1) {
                this.list.push({
                    object: object,
                    type: type,
                    selector: selector,
                    handler: fn
                });  
            }
            
            object.on(type, selector, data, fn);
            
            return this;
        },
        get: function(index) {
            return this.list[index];
        },
        find: function(object, type, fn, selector) {
            var index = this.key(object, type, fn, selector);

            return this.get(index);
        },
        key: function(object, type, fn, selector) {
            var i = 0;
            for (; i < this.length(); i++) {
                var item = this.list[i];
                if (item.object === object &&
                        item.selector === selector &&
                        item.type === type &&
                        item.handler === fn) {
                    return i;
                }
            }

            return -1;
        },
        length: function() {
            return this.list.length;
        },
        removeItem: function(index) {
            if (index !== -1) {
                var event = this.get(index);

                event.object.off(event.type, event.selector, event.handler);

                this.list.splice(index, 1);
            }
            
            return this;
        },
        remove: function(object, type, fn, selector) {
            if(!object) {
                return this.removeAll();
            }
            
            if (!type) {
                var length = this.list.length,
                    i = length - 1;
                for (; i >= 0; i--) {
                    if (this.list[i].object === object) {
                        this.removeItem(i);
                    }

                }
                
                return this;
            }
            
            

            return this.removeItem(this.key(object, type, fn, selector));
        },
        removeAll: function() {
            var i = this.list.length - 1;
            for (; i >= 0; i--) {
                this.removeItem(i);
            }

            return this;
        }
    };

    var EventAssocData = {
        assoc_index: 1,
        data: {},
        property: '__event_assoc_data__',
        accepts: function(object) {
            return object.nodeType ?
                    object.nodeType === 1 || object.nodeType === 9 : true;
        },
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
        has: function(object) {
            var key = object[EventAssocData.property];
            if(key) {
                return key in EventAssocData.data;
            }
            
            return false;
        },
        get: function(object) {
            var key = EventAssocData.key(object),
                    data = EventAssocData.data[key];
            
            return data;
        },
        
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
    
    var EventAssoc = {
        add: function(owner, other, types, fn, selector, data) {
            var list = EventAssocData.get(owner);
            if (list) {
                list.add(other, types, fn, selector, data);
            }
            
        },
        
        remove: function(owner, other, types, fn, selector) {
            if(!EventAssocData.has(owner)) {
                return;
            }
            
            var list = EventAssocData.get(owner);
            if(list) {
                list.remove(other, types, fn, selector);
            }
        }
    };

    var returnFalse = function() {
        return false;
    };
    
    $.fn.listenTo = function(other, types, fn, selector, data) {
        if (!(other instanceof $)) {
            throw new TypeError("jQuery object expected.");
        }
        
        if(fn === false) {
            fn = returnFalse;
        } else if(!fn) {
            return this;
        }

        return this.each(function() {
            EventAssoc.add(this, other, types, fn, selector, data);
        });
    };

    $.fn.listenToOnce = function(other, types, fn, selector, data) {
        var _this = this;
        callback = function() {
            _this.stopListening(other, types, callback, selector);
            return fn.apply(this, arguments);
        };

        return this.listenTo(other, types, callback, selector, data);
    };

    $.fn.stopListening = function(other, types, fn, selector) {

        if (other && !(other instanceof $)) {
            throw new TypeError("jQuery object expected.");
        }
        
        if(fn === false) {
            fn = returnFalse;
        } else if(!fn) {
            return this;
        }

        return this.each(function() {
            EventAssoc.remove(this, other, types, fn, selector);
        });
    };
    
    $.fn.externalListeners = function() {
        var data = [];
        this.each(function() {
            if(EventAssocData.has(this)) {
                data.push(EventAssocData.get(this));
            }
        });
        
        return data;
    };

    // override cleanData method to clear existing event associations
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

