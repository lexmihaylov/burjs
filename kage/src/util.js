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
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};


/**
 * creates a task that is appended to the event queue
 * @class AsyncTask
 * @param {function} task the task that will be executed async
 */
kage.util.AsyncTask = kage.Class({
    _construct: function(task) {
        if (task && typeof task === 'function') {
            this._task = task;
            this._on_start = null;
            this._on_finish = null;
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
kage.util.AsyncTask.prototype.on_start = function(fn) {
    this._on_start = fn;
    return this;
};

/**
 * Adds a callback that will be executed when the task finishes
 * 
 * @param {function} fn callback
 */
kage.util.AsyncTask.prototype.on_finish = function(fn) {
    this._on_finish = fn;
    return this;
};

/**
 * starts the task execution
 * 
 */
kage.util.AsyncTask.prototype.start = function() {
    var _this = this;
    window.setTimeout(function() {
        if (typeof _this._on_start === 'function') {
            _this._on_start();
        }

        var data = _this._task();

        if (typeof _this._on_finish === 'function') {
            _this._on_finish(data);
        }
    }, 0);

    return this;
};


/**
 * caretes an http request to a given url
 * @class Http
 * @param {string} url
 * @param {bool} async default is false
 */
kage.util.Http = kage.Class({
    _construct: function(url, async) {
        // by default the http requests are synchronious
        if (async) {
            this._async = async;
        } else {
            this._async = false;
        }

        // $.ajax settings object
        this._ajax_opt = {
            url: url,
            async: async
        };
    }
});

/**
 * executes a GET http request
 * @static
 * 
 * @param {string} url
 * @param {object} data http params
 */
kage.util.Http.Get = function(url, data) {
    var response = null;

    new kage.util.Http(url, false)
            .on_success(function(result) {
                response = result;
            })
            .get(data);

    return response;
};

/**
 * executes a POST http request
 * @static
 * 
 * @param {string} url
 * @param {object} data http params
 */
kage.util.Http.Post = function(url, data) {
    var response = null;
    new kage.util.Http(url, false)
            .on_success(function(result) {
                response = result;
            })
            .post(data);

    return response;
};

/**
 * Adds a callback for successful execution of the http reguest
 * 
 * @param {function} fn
 */
kage.util.Http.prototype.on_success = function(fn) {
    this._ajax_opt.success = fn;
    return this;
};

/**
 * Adds a callback for failed http execution
 * 
 * @param {function} fn
 */
kage.util.Http.prototype.on_fail = function(fn) {
    this._ajax_opt.error = fn;
    return this;
};

/**
 * executes the http request
 * 
 * @param {string} type type of the http request (GET or POST)
 * @param {object} data http parameters
 */
kage.util.Http.prototype.exec = function(type, data) {
    this._ajax_opt.type = type;
    this._ajax_opt.data = data;

    $.ajax(this._ajax_opt);
    return this;
};

/**
 * Executes a GET http request
 * 
 * @param {object} data http parameters
 */
kage.util.Http.prototype.get = function(data) {
    return this.exec('GET', data);
};

/**
 * Executes a POST http request
 * 
 * @param {object} data http parameters
 */
kage.util.Http.prototype.post = function(data) {
    return this.exec('POST', data);
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
 * Iterates through the collection. To break from the loop, use 'this._break();'
 * 
 * @param {function} fn callback
 */
kage.util.Collection.prototype.each = function(fn) {

    // helper construction for manging the for loop
    var fn_construction = {
        _status: true,
        _break: function() {
            this._status = false;
        }
    };

    for (var i = 0; i < this.length; i++) {
        fn.call(fn_construction, this[i], i);

        if (!fn_construction._status) {
            break;
        }
    }
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
kage.util.Collection.prototype.to_json = function() {
    return JSON.stringify(this);
};

/**
 * Handles a HashMap with strings as keys and objects as values
 * @class HashMap
 * @param {object} map an initial hash map
 */
kage.util.HashMap = kage.Class({
    _construct: function(map) {
        if (map) {
            for (var i in map) {
                if (map.hasOwnProperty(i)) {
                    this[i] = map[i];
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
    return key in this;
};

/**
 * Iterates through the hash map. To break from the look use this._break() inside the callback.
 * 
 * @param {function} fn callback
 */
kage.util.HashMap.prototype.each = function(fn) {
    var fn_construction = {
        _status: true,
        _break: function() {
            this._status = false;
        }
    };

    for (var i in this) {
        if (this.hasOwnProperty(i)) {
            fn.call(fn_construction, this[i], i);

            if (!fn_construction._status) {
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
    this[key] = value;
    return this;
};

/**
 * finds the key of a value
 * 
 * @param {mixed} val
 * @return {string}
 */
kage.util.HashMap.prototype.key_of = function(val) {
    var ret_key = null;
    this.each(function(value, key) {
        if (value === val) {
            ret_key = key;
            this._break();
        }
    });

    return ret_key;
};

/**
 * Removes an element from the hash map
 * @param {string} key
 */
kage.util.HashMap.prototype.remove = function(key) {
    delete(this[key]);

    return this;
};

/**
 * Extends the hashmap
 * 
 * @param {object|HashMap} object
 */
kage.util.HashMap.prototype.extend = function(object) {
    if (typeof object === 'object') {
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                this[i] = object[i];
            }
        }
    } else {
        throw "extend requires an object, but " + typeof (object) + "was given.";
    }

    return this;
};

/**
 * Converts the hash map to a json string
 * 
 * @return {string} 
 */
kage.util.HashMap.prototype.to_json = function() {
    return JSON.stringify(this);
};

