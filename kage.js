
/**
* Project kage
* @version 0.1.0
* @author Alexander Mihaylov (lex.mihaylov@gmail.com)
* @license http://opensource.org/licenses/MIT MIT License (MIT)
*
* @Copyright (C) 2013 by Alexander Mihaylov
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

(function(root, factory) {
    if(typeof(define) === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if(typeof(root) === 'object' && typeof(root.document) === 'object') {
        // check if jquery dependency is met
        if (typeof (root.$) !== 'function' ||
                typeof (root.$.fn) !== 'object' ||
                !root.$.fn.jquery) {

            throw new Error("kage.js dependency missing: jQuery");
        }
        
        root.kage = factory(root.$);
    }
})(this, function($) {

/**
 * A library for creating an MVC onepage web applications.
 * The library is built for use with jquery and depends on requirejs
 * @namespace kage
 */
var kage = {
    /**
     * @var {string} VERSION library version
     */
    VERSION: '0.1.0',
    /**
     * @var {object} window The javasript window object
     * with extended functionality
     */
    window: null,
    /**
     * @var {object} dom The javasript <HTML> object
     * with extended functionality
     */
    dom: null,
    
    /**
     * Checks if the library needs to initialize
     * @type Boolean
     */
    _isInitialized: false,
    /**
     * Libaray configurations
     */
    _Config: {
        /**
         * Application directory (ex: js/app/)
         */
        appDir: 'js/app/',
        /**
         * View directory
         */
        viewDir: 'js/app/views/',
        /**
         * Model directory
         */
        modelDir: 'js/app/models/',
        /**
         * Section directory
         */
        sectionDir: 'js/app/sections/',
        /**
         * Template directory
         */
        templateDir: 'js/app/templates/'
    },
    /**
     * _set_config
     * Setups the application paths
     */
    _setAppDir: function(appDir) {
        kage._Config.appDir = appDir;
        for (var i in kage._Config) {
            if (i !== 'appDir') {
                kage._Config[i] = appDir + kage._Config[i];
            }
        }
    },
    
    /**
     * Initializes the module
     * @return {Object}
     */
    _init: function() {
        if(!kage._isInitialized) {
            kage.window = $(window);
            kage.dom = $('html');
            kage.dom.body = $('body');
            kage._isInitialized = true;
        }
        
        return kage;
    },
    
    /**
     * Gives access to the libraries configuration variable
     * @param {type} attr
     * @param {type} value
     * @returns {kage|Object|kage._Config}
     */
    config: function(attr, value) {
        
        if($.isPlainObject(attr)) {
            if(attr.appDir) {
                kage._setAppDir(attr.appDir);
            }
            
            kage._Config = $.extend(true, kage._Config, attr);
            
            return kage;
        } else if(typeof(attr) === 'string'){
            if(!value) {
                return kage._Config[attr];
            } else {
                if(attr === 'appDir') {
                    kage._setAppDir(value);
                } else {
                    kage._Config[attr] = value;
                }
                
                return kage;
            }
        } else if(!attr) {
            return kage._Config;
        } else {
            return null;
        }
    },
    
    /**
     * Asyncronously loads and compiles all app templates 
     * defined in the application config
     * @returns {promise}
     */
    startApp: function() {
        var deffered = $.Deferred();
        
        kage.View.init({
           progress: deffered.notify,
           done: deffered.resolve,
           views: kage.config('templates').views,
           urls: kage.config('templates').urls
        });
        
        return deffered.promise();
    }
};

/**
 * Class
 * Creates a class by passing in a class definition as a javascript object
 * @param {Object} definition the class definition object
 * @return {function} the newly created class
 */
kage.Class = function(definition) {
    // load class helper functions
    // define simple constructor
    var classDefinition = function() {};
    classDefinition.prototype._construct = classDefinition;

    if (definition) {

        // set construnctor if it exists in definition
        if (definition._construct) {
            classDefinition.prototype._construct = 
                classDefinition = 
                    definition._construct;
        }

        // extend a class if it's set in the definition
        if (definition.extends) {
            kage.Class._inherits(classDefinition, definition.extends);

        }

        // implement a object of method and properties
        if (definition.implements) {
            if (definition.implements instanceof Array) {
                var i;
                for (i = 0; i < definition.implements.length; i++) {
                    kage.Class._extendPrototypeOf(classDefinition, definition.implements[i]);
                }
            } else if (typeof definition.imlements === 'object') {
                kage.Class._extendPrototypeOf(classDefinition, definition.implements);
            } else {
                throw new Error("error implementing object methods");
            }
        }

        // set the prototype object of the class
        if (definition.prototype) {
            kage.Class._extendPrototypeOf(classDefinition, definition.prototype);
        }

        if (definition.static) {
            for (i in definition.static) {
                classDefinition[i] = definition.static[i];
            }
        }
    }

    /**
     * Provides easy access to the current class' static methods
     * 
     * @return {function} the class' constructor
     */
    classDefinition.prototype._self = function() {
        return classDefinition;
    };

    if(definition.extends) {
        // variable to use in the closure
        var superClass = definition.extends;
        
        /**
         * Provides easy access to the parent class' prototype
         * 
         * @static
         * @return {mixed} result of the execution if there is any
         */
        classDefinition._super = function(context, method, argv) {
            var result;
            
            if(!context) {
                throw new Error('Undefined context.');
            }
            
            var _this = context;
            
            if(!argv) {
                argv = [];
            }
            
            if(method) {
                if(method instanceof Array) {
                    argv = method;
                    method = undefined;
                } else if(typeof(method) !== 'string') {
                    throw new Error('Expected string for method value, but ' + typeof(method) + ' given.');
                }
            }
            
            if (method) {
                // execute a method from the parent prototype
                if(superClass.prototype[method] &&
                        typeof(superClass.prototype[method]) === 'function') {
                    result = superClass.prototype[method].apply(_this, argv);
                } else {
                    throw new Error("Parent class does not have a method named '" + method + "'.");
                }
            } else {
                // if no method is set, then we execute the parent constructor
                result = superClass.apply(_this, argv);
            }

            return result;
        };
    }

    // return the new class
    return classDefinition;
};

/**
 * <p>Creates a new class and inherits a parent class</p>
 * <p><b>Note: when calling a super function use: [ParentClass].prototype.[method].call(this, arguments)</b></p>
 * 
 * @param {object} childClass the class that will inherit the parent class
 * @param {object} baseClass the class that this class will inherit
 * @private
 * @static
 */
kage.Class._inherits = function(childClass, baseClass) {
    // inherit parent's methods
    var std_class = function() {
    };
    std_class.prototype = baseClass.prototype;
    childClass.prototype = new std_class();
    // set the constructor
    childClass.prototype._construct = 
        childClass.prototype.constructor = 
            childClass;
    // return the new class
    return childClass;
};

/**
 * Copies methods from an object to the class prototype
 * 
 * @param {object} childClass the class that will inherit the methods
 * @param {object} methods the object that contains the methods
 * @private
 * @static
 */
kage.Class._extendPrototypeOf = function(childClass, methods) {
    for (var i in methods) {
        childClass.prototype[i] = methods[i];
    }

    return childClass;
};

/**
 * Holds utility classes and methods
 * @namespace util
 */
kage.util = {};


/**
 * Holds functions that help you managa cookies
 * @class cookie
 * @static
 */
kage.util.cookie = {};

/**
 * Create a cookie on the clients browser
 * 
 * @param {String} name
 * @param {String} value
 * @param {Object} opt
 * opt.expires Expiration time in seconds
 * opt.path Default value is /
 * opt.domain If domain is not set then the current domain
 * will be set to cookie
 */
kage.util.cookie.set = function(name, value, opt) {
    value = escape(value);
    if (!opt)
        opt = {};

    if (opt.expires) {
        var date = new Date();
        date.setTime(date.getTime() + parseInt(opt.expires * 1000));
        value = value + ';expires=' + date.toGMTString();
    }

    if (opt.path) {
        value = value + ';path=' + opt.path;
    } else {
        value = value + ';path=/';
    }

    if (opt.domain) {
        value = value + ';domain=' + opt.domain;
    }

    document.cookie = name + "=" + value + ";";
};

/**
 * Retrieve a cookie's value
 * 
 * @param {string} name
 */
kage.util.cookie.get = function(name) {
    var expr = new RegExp(name + '=(.*?)(;|$)', 'g');
    var matches = expr.exec(document.cookie);
    if (!matches || !matches[1]) {
        return null;
    }
    return matches[1];
};

/**
 * Deletes cookie
 * 
 * @param {string} name
 * @return {mixed} the value of the cookie or null if the cookie does not exist
 */
kage.util.cookie.destroy = function(name) {
    kage.util.cookie.set(name, null, {expires: -1});
};


/**
 * creates a task that is appended to the event queue
 * @class AsyncTask
 * @param {function} task the task that will be executed async
 * @param {int} timeout delay before task execution
 */
kage.util.AsyncTask = kage.Class({
    _construct: function(task, timeout) {
        if (task && typeof task === 'function') {
            this._task = task;
            this._timeout = timeout || 0;
            this._onStart = null;
            this._onFinish = null;
        } else {
            throw "Task has to be a function, but '" + typeof (task) + "' given.";
        }
    }
});

/**
 * Adds a callback that will be executed before the task starts
 * 
 * @param {function} fn callback
 */
kage.util.AsyncTask.prototype.onStart = function(fn) {
    this._onStart = fn;
    return this;
};

/**
 * Adds a callback that will be executed when the task finishes
 * 
 * @param {function} fn callback
 */
kage.util.AsyncTask.prototype.onFinish = function(fn) {
    this._onFinish = fn;
    return this;
};

/**
 * starts the task execution
 * 
 */
kage.util.AsyncTask.prototype.start = function() {
    var _this = this;
    window.setTimeout(function() {
        if (typeof _this._onStart === 'function') {
            _this._onStart();
        }

        var data = _this._task();

        if (typeof _this._onFinish === 'function') {
            _this._onFinish(data);
        }
    }, this._timeout);

    return this;
};


/**
 * caretes an http request to a given url
 * @class Http
 * @param {Object} options
 * @returns {Object} promise
 */
kage.util.Http = function(options) {
    return $.ajax(options);
};

/**
 * executes a post http request
 * @param {string} url
 * @param {Object} request data
 * @returns {Object} promise
 */
kage.util.Http.post(url, data) {
    return kage.util.Http({
        type: 'POST',
        url: url,
        data: data
    });
};

/**
 * executes a get http request
 * @param {string} url
 * @param {Object} request data
 * @returns {Object} promise
 */
kage.util.Http.get(url, data) {
    return kage.util.Http({
        type: 'GET',
        url: url,
        data: data
    });
};

/**
 * executes a put http request
 * @param {string} url
 * @param {Object} request data
 * @returns {Object} promise
 */
kage.util.Http.put = function(url, data) {
    return kage.util.Http({
        type: 'PUT',
        url: url,
        data: data
    });
};

/**
 * executes a delete http request
 * @param {string} url
 * @param {Object} request data
 * @returns {Object} promise
 */
kage.util.Http.delete = function(url, data) {
    return kage.util.Http({
        type: 'DELETE',
        url: url,
        data: data
    });
};

/**
 * Handles collection of objects
 * @class Collection
 * @param {mixed} args.. elements of the arrays
 */
kage.util.Collection = kage.Class({
    extends: Array,
    _construct: function() {
        kage.util.Collection._super(this);
        var argv = this.splice.call(arguments, 0);
        for (var i = 0; i < argv.length; i++) {
            this.push(argv[i]);
        }
    }
});

/**
 * Iterates through the collection. To break from the loop, use 'return false'
 * 
 * @param {function} fn callback
 */
kage.util.Collection.prototype.each = function(fn) {

    for (var i = 0; i < this.length; i++) {
        var result = fn(this[i], i);

        if (result === false) {
            break;
        }
    }
};

/**
 * Checks if the collection has an element with a given index
 * @param {type} index
 * @returns {Boolean}
 */
kage.util.Collection.prototype.has = function(index) {
    return index in this;
};

/**
 * Checks if the collecion contains a value
 * @param {type} value
 * @returns {Boolean}
 */
kage.util.Collection.prototype.contains = function(value) {
    return (this.indexOf(value) !== -1);
};

/**
 * Removes an item from the collection
 * 
 * @param {int} index item index
 */
kage.util.Collection.prototype.remove = function(index) {
    this.splice(index, 1);
};

/**
 * Extends the collection with elements from another array
 * 
 * @param {Array|Collection} array secondary array
 */
kage.util.Collection.prototype.extend = function(array) {
    if (array instanceof Array) {
        for (var i = 0; i < array.length; i++) {
            this.push(array[i]);
        }
    } else {
        throw "extend requires an array, but " + typeof (object) + "was given.";
    }

    return this;
};

/**
 * converts the collection to a json string
 * 
 * @return {string}
 */
kage.util.Collection.prototype.toJson = function() {
    return JSON.stringify(this);
};

/**
 * Handles a HashMap with strings as keys and objects as values
 * @class HashMap
 * @param {object} map an initial hash map
 */
kage.util.HashMap = kage.Class({
    _construct: function(map) {
        this._map = {};
        if (map) {
            if(!$.isPlainObject(map)) {
                throw new Error('map has to be a javascript object');
            }
            
            for (var i in map) {
                if (map.hasOwnProperty(i)) {
                    this._map[i] = map[i];
                }
            }
        }
    }
});

/**
 * checks if the hash map contains an element with a given key
 * @param {string} key
 * @return {boolean} 
 */
kage.util.HashMap.prototype.has = function(key) {
    return key in this._map;
};

/**
 * Iterates through the hash map. To break from the look use 'return false;' inside the callback.
 * 
 * @param {function} fn callback
 */
kage.util.HashMap.prototype.each = function(fn) {
    for (var i in this._map) {
        if (this._map.hasOwnProperty(i)) {
            var result = fn(this._map[i], i);

            if (result === false) {
                break;
            }
        }
    }

    return this;
};

/**
 * Adds an element to the hash map
 * 
 * @param {string} key
 * @param {string} value 
 */
kage.util.HashMap.prototype.add = function(key, value) {
    this._map[key] = value;
    return this;
};

/**
 * Get an item by key
 * @param {type} key
 * @returns {mixed}
 */
kage.util.HashMap.prototype.get = function(key) {
    return this._map[key];
};

/**
 * finds the key of a value
 * 
 * @param {mixed} val
 * @return {string}
 */
kage.util.HashMap.prototype.keyOf = function(val) {
    var retKey = null;
    this.each(function(value, key) {
        if (value === val) {
            retKey = key;
            
            return false;
        }
    });

    return retKey;
};

/**
 * Checks if the hash map contains a given value
 * @param {type} value
 * @returns {Boolean}
 */
kage.util.HashMap.prototype.contains = function(value) {
    return (this.keyOf(value) !== null);
};

/**
 * Removes an element from the hash map
 * @param {string} key
 */
kage.util.HashMap.prototype.remove = function(key) {
    delete(this._map[key]);

    return this;
};

/**
 * Extends the hashmap
 * 
 * @param {object|HashMap} object
 */
kage.util.HashMap.prototype.extend = function(object) {
    if ($.isPlainObject(object)) {
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                this._map[i] = object[i];
            }
        }
    } else {
        throw new Error("extend requires an object, but " + typeof (object) + "was given.");
    }

    return this;
};

/**
 * Returns the size of the hash map
 * @returns {Number}
 */
kage.util.HashMap.prototype.size = function() {
    var counter = 0;
    for(var i in this._map) {
        if(this._map.hasOwnProperty(i)) {
            counter ++;
        }
    }
    
    return counter;
};

/**
 * Converts the hash map to a json string
 * 
 * @return {string} 
 */
kage.util.HashMap.prototype.toJson = function() {
    return JSON.stringify(this._map);
};

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
};/**
 * Creates a global event bus for communication between different components
 * @var {kage.EventBus}
 * @namespace kage
 */
kage.Antenna = new kage.EventBus();/**
 * Provides functionality for creating UI components
 * @class Component
 * @param {string} tag tag type as a string (ex: '<div/>')
 */
kage.Component = kage.Class({
    extends: $,
    _construct: function(object) {
        // set a default object
        if (!object) {
            object = '<div/>';
        }
        this.constructor = $; // jquery uses it's constructor internaly in some methods

        this.init(object); // init the object
    }
});

/**
 * Get the computed value of a css property
 * @param {string} property a css property
 * @return {mixed} the computed value of the property
 */
kage.Component.prototype.computedStyle = function(property) {
    return window
        .getComputedStyle(this.get(0)).getPropertyValue(property);
};

/**
 * Get the computed width
 * @return {string} computed width
 */
kage.Component.prototype.computedWidth = function() {
    return parseFloat(this.computedStyle('width'));
};

/**
 * Get the computed height
 * @return {string}
 */
kage.Component.prototype.computedHeight = function() {
    return parseFloat(this.computedStyle('height'));
};


/*
 * We need to override some of the default jQuery methods, so we can be able to
 * detect dom incertion
 */
(function() {
    var parentMethods = {
        // inset inside methods
        /*
         * append
         * appendTo
         * html
         */
        append: $.fn.append,
        /*
         * prepend
         * prependTo
         */
        prepend: $.fn.prepend,
        // insert outside methods
        /*
         * after
         * insertAfter
         */
        after: $.fn.after,
        /*
         * before
         * insertBefore
         */
        before: $.fn.before
    };
    
    /**
     * Triggers an event if item is a jquery object
     * @param {type} item
     * @return {undefined}
     */
    var onAfterInsert = function(item) {
        if (item.triggerHandler) {
            if (item.closest('body').length > 0) {
                item.triggerHandler('dom:insert');
                item.find('*').each(function() {
                    $(this).triggerHandler('dom:insert');
                });
            }
        }
    };
    
    /**
     * modifys a dom insertion method
     * @param {type} method
     * @return {unresolved}
     */
    var domEventsModifyer = function(method) {
        return function() {
            var args = Array.prototype.splice.call(arguments, 0),
                result = undefined,
                i = 0;
    
            result = parentMethods[method].apply(this, args);
    
            for (i = 0; i < args.length; i++) {
                onAfterInsert(args[i]);
            }
    
            return result;
        };
    };
    
    $.fn.append = domEventsModifyer('append');
    $.fn.prepend = domEventsModifyer('prepend');
    $.fn.after = domEventsModifyer('after');
    $.fn.before = domEventsModifyer('before');
})();


/*
 * Override $.cleanData method so we can handle external listener map
 * and we can emit a dom:destroy event on the objects being removed form the dom
 */
(function() {
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
            if (object.length !== undefined) {
                for (var i = 0; i < object.length; i++) {
                    this.add(object[i], type, fn);
                }
    
                return this;
            }
    
            if (this.key(object, type, fn) === -1) {
                this.list.push({
                    object: object,
                    type: type,
                    handler: fn
                });
            }
    
            if (!object.on) {
                object = $(object);
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
                var object = event.object;
    
                if (typeof(object.off) !== 'function') {
                    object = $(object);
                }
    
                object.off(event.type, event.handler);
    
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
            var i;
            // .remove() - removes all items
            if (!object) {
                return this.removeAll();
            }
            if (object.length !== undefined) {
                for (i = 0; i < object.length; i++) {
                    this.remove(object[i], type, fn);
                }
            }
    
            var length = this.list.length;
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
            if (object && type && !fn) {
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
         * @property {number} assocIndex autoincrementing value used as index for element
         */
        assocIndex: 1,
    
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
                key = EventAssocData.assocIndex;
    
                try {
                    descriptior[EventAssocData.property] = {
                        value: key
                    };
    
                    Object.defineProperties(object, descriptior);
                }
                catch (e) {
                    descriptior[EventAssocData.property] = key;
    
                    $.extend(object, descriptior);
                }
    
                EventAssocData.assocIndex++;
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
            if (key) {
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
            if (!EventAssocData.has(object)) {
                return;
            }
    
            var key = EventAssocData.key(object),
                data = EventAssocData.data[key];
    
            if (data) {
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
            if (!EventAssocData.has(owner)) {
                return;
            }
    
            var list = EventAssocData.get(owner);
            if (list) {
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
        if (!other.on ||
            !other.one ||
            !other.off
        ) {
            other = $(other);
        }
    
        if (fn === false) {
            fn = returnFalse;
        }
        else if (!fn) {
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
        callback = function(event) {
            _this.stopListening(event);
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
        if (other.target && other.handleObj) {
            return this.each(function() {
                EventAssoc.remove(this, other.target,
                    other.handleObj.type, other.handleObj.handler);
            });
        }
    
        if (other && (!other.on ||
                !other.one ||
                !other.off
            )) {
            other = $(other);
        }
    
        if (fn === false) {
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
            if (EventAssocData.has(this)) {
                data.push(EventAssocData.get(this));
            }
        });
    
        if (data.length > 0) {
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
            if (elems[i] !== undefined) {
    
                // emit a destroy event when an element is beening cleaned
                // this event won't bubble up because we are using triggerHandler
                $(elems[i]).triggerHandler('dom:destroy');
    
                if (EventAssocData.has(elems[i])) {
                    EventAssocData.remove(elems[i]);
                }
            }
        }
        return cleanData(elems);
    };
})();/**
 * Application Model
 * @class kage.Model
 */
kage.Model = kage.Class({
    extends: kage.EventBus,
    _construct: function() {
        kage.ViewModel._super(this);
        
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
 * @returns {kage.Model}
 */
kage.Model.prototype.set = function(property, value) {
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
kage.Model.prototype.get = function(property) {
    if(!property) {
        // retuns a reference to the data object
        return this._data;
    }
    
    return eval('this._data.' + property);
};/**
 * Provides functionality for handling mustache templates
 * @class View
 * @param {string} template_id the template filename without the extension
 * @param {object} opt optional option parameter
 * `opt: {
 *      url: '<some_url>',
 *      view: '<template_id>',
 *      string: '<template_string>',
 *      context: <some context object>
 * }`
 */
kage.View = kage.Class({
    _construct: function(opt) {
        if(!kage.View.init._isReady) {
            throw new Error("Views are not ready. Please call "+
                    "kage.View.init({progress: ..., done: ...}) from your main class/function");
        }
        
        if (!opt) {
            throw new Error("Available options are: 'context','view', 'url' and 'string'.");
        } else if (!opt.view &&
                !opt.url &&
                !opt.string) {
            throw new Error("No template source. Please set one: ('view', 'url' or 'string').");
        }

        this._opt = opt;
    }
});

/**
 * Holds compiled application templates
 * @var Cache {HashMap}
 * @static
 */
kage.View.Cache = new kage.util.HashMap();

/**
 * Clears the template cache
 * 
 * @static
 */
kage.View.clearCache = function() {
    kage.View.Cache = new kage.util.HashMap();
};

/**
 * Creates an instance of View
 * 
 * @static
 * @param {object} opt optional option parameter
 `opt: {
 url: '<some url>'
 context: <some context object>
 }`
 * @return {View}
 */
kage.View.make = function(opt) {
    return new kage.View(opt);
};

/**
 * Compiles a template to javascript code
 * 
 * @static
 * @param {string} html The template code
 * @return {function} compiled template
 */
kage.View.Compile = function(templateSource) {
    // John Resig - http://ejohn.org/ - MIT Licensed
    if (!templateSource) {
        templateSource = '';
    }

    var templateFunc = new Function(
            "vars",
            (
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    // Introduce the data as local variables using with(){}
                    "if(!vars){vars={};}" +
                    "with(vars){p.push('" +
                    // Convert the template into pure JavaScript
                    templateSource
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") +
                    "');}return p.join('');"
                    )
            );

    return templateFunc;
};

/**
 * Renders the compiled template to html
 * 
 * @param {object} variables variables to pass to the template
 * @return {Component}
 */
kage.View.prototype.render = function(variables) {
    var template = this._compileTemplateResource();
    var html = null;

    if (this._opt.context && typeof (this._opt.context) === 'object') {
        html = template.call(this._opt.context, variables);
    } else {
        html = template(variables);
    }

    return html;
};

/**
 * Don't render the template, just add it to the view cache
 * @returns {function} compiled template
 */
kage.View.prototype.cache = function() {
    return this._compileTemplateResource();
};

/**
 * Compiles a template resource dependant on the view options
 * 
 * @static
 * @return {object}
 */
kage.View.prototype._compileTemplateResource = function() {
    var data = this._buildResourceFromOptions();

    var templateSource = null;
    if (!data.cache) {
        templateSource = kage.View.Compile(data.resource);
    } else {
        templateSource = this._loadResource(data.resource);
    }


    return templateSource;
};

/**
 * Builds a resource object
 * @returns {object}
 */
kage.View.prototype._buildResourceFromOptions = function() {
    var resource = null;
    var cache = true;
    
    var urlArgs = '';
    if (kage.config('urlArgs')) {
        urlArgs = '?' + kage.config('urlArgs');
    }
    
    if (this._opt.view) {
        resource = kage.config('templateDir') + this._opt.view + '.ejs' + urlArgs;
    } else if (this._opt.url) {
        resource = this._opt.url + urlArgs;
    } else if (this._opt.string) {
        resource = this._opt.string;
        cache = false; // do not cache compilation output
    } else {
        throw new Error('Can\'t create template resource from view options.');
    }
    
    return {
        resource: resource,
        cache: cache
    };
};

/**
 * Loads a template from the Cache or from a remote file, compiles it and adds it to the Cache
 * 
 * @return {function} compiled template
 */
kage.View.prototype._loadResource = function(resource) {
    var template = null;
    if (kage.View.Cache.has(resource)) {
        template = kage.View.Cache.get(resource);
    } else {
        throw new Error("Unable to find template in cache. "+
                "Please check if this template exists in the application config.");
    }

    return template;
};

/**
 * Preloads a list of templates asynchroniously and adds them to the view cache
 * @param {object} opt 
 * opt = {
 *      views: [...],
 *      urls: [...],
 *      progress: function(percent) { ... },
 *      done: function() { ... } 
 * }
 * @returns {undefined}
 */
kage.View.init = function(opt) {
    if(typeof(opt) === 'object') {
        var list = [], 
            callbacks = {}, 
            i = 0;
    
        if(opt.views && (opt.views instanceof Array)) {
            for(i = 0; i < opt.views.length; ++i) {
                list.push({
                    view: opt.views[i]
                });
            }
        }
        
        if(opt.urls && (opt.urls instanceof Array)) {
            for(i = 0; i < opt.urls.length; ++i) {
                list.push({
                    url: opt.urls[i]
                });
            }
        }
        
        if(typeof(opt.progress) === 'function') {
            callbacks.progress = opt.progress;
        }
        
        if(typeof(opt.done) === 'function') {
            callbacks.done = opt.done;
            
            kage.View.init._isReady = true;
        }
        
        kage.View.init._prefetchFromArray(list, callbacks);
    }
};

/**
 * Preloads a array of urls or views
 * @param {'view'|'url'} type view option
 * @param {type} list list of urls or viewss
 * @param {type} opt object containing the callbacks
 * @returns {undefined}
 */
kage.View.init._prefetchFromArray = function(list, callbacks) {
    var loadCount = 0;
    if(list.length === 0) {
        if(typeof(callbacks.progress) === 'function') {
            callbacks.progress(100);
        }
        
        if(typeof(callbacks.done) === 'function') {
            callbacks.done();
        }
        
        return;
    }
    
    for(var i = 0; i < list.length; ++i) {
        var view = kage.View.make(list[i]);
        var data = view._buildResourceFromOptions();
        
        if(data.cache) {
            var progressChange = function() {
                loadCount++;
                
                if(typeof(callbacks.progress) === 'function') {
                    var percent = (loadCount/list.length) * 100;
                    callbacks.progress(percent);
                }
                
                if(loadCount === list.length) {
                    if(typeof(callbacks.done) === 'function') {
                        callbacks.done();
                    }
                }
            };
            
            kage.View._fetchTemplate(data.resource, progressChange);
        }
    }
};

/**
 * Creates an http request that retrieves the template source
 * @param {type} resource
 * @param {type} callback
 * @returns {undefined}
 */
kage.View._fetchTemplate = function(resource, callback) {
    kage.util.Http({
        type: 'GET',
        url: resource
    }).success(function(template) {
        kage.View.init._compileAndCache(resource, template);
        callback();
    }).fail(function() {
        console.error("Error fetching template: '" + resource + "'.");
        callback();
    });
};

/**
 * Compiles a template and adds it to the view cache for future use
 * @param {type} resource
 * @param {type} template
 * @returns {undefined}
 */
kage.View.init._compileAndCache = function(resource, template) {
    kage.View.Cache.add(resource, kage.View.Compile(template));
};

kage.View.init._isReady = false;
return kage._init();

});
