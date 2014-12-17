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
kage.util.Http.post = function(url, data) {
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
kage.util.Http.get = function(url, data) {
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

