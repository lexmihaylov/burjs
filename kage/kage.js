/**
* Project kage
* @version 0.1.0
* @author Alexander Mihaylov (a.mihaylov@dynamicfunction.eu)
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

define(['libs/jquery'], function () { 


	/**
	* A library for creating an MVC onepage web applications.
	* The library is build on top of jquery and depends on requirejs
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
		* Libaray configurations
		*/
        Config: {
			
			/**
			* Application directory (ex: js/app/)
			*/
            app_dir: null,
			
			/**
			* View directory
			*/
            view_dir: 'views/',
			
			/**
			* Model directory
			*/
            model_dir: 'models/',
			
			/**
			* Section directory
			*/
            section_dir: 'sections/',
			
			/**
			* Template directory
			*/
            template_dir: 'templates/'
        },
        
		/**
		* _set_config
		* Setups the application paths
		*/
        _set_config: function () {
            var app_dir = kage.Config.app_dir,
                i;
            for (i in kage.Config) {
                if (i !== 'app_dir') {
                    kage.Config[i] = app_dir + kage.Config[i];
                }
            }
        },
        
        /**
		* init
		* Initializes the module
		* @return {Object}
		*/
        init: function (config) {
            kage.window = new jQuery(window);
            kage.dom = new jQuery('html');
			
			/**
			* @var {object} body The javasript <BODY> object
			* with extended functionality
			*/
            kage.dom.body = new jQuery('body');
            
            if (config && typeof config === 'object') {
                var setting;
                for(setting in config) {
                    kage.Config[setting] = config[setting];
                    
                    if(setting === 'app_dir') {
                        kage._set_config();
                    }
                }
            }
            
            return this;
        }
    };

	/**
	* If the object already has an instance of a class it will retun it
	* @method kage_object
	* @return {object}
	*/
	jQuery.fn.kage_object = function() {
		return $(this).data('__KAGAMI__');
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
        var class_definition = function() {};
        
        if(definition) {
			
			// set construnctor if it exists in definition
            if(definition.constructor) {
                class_definition = definition.constructor;
            }
            
			// extend a class if it's set in the definition
            if(definition.extends) {
                kage.Class._inherits(class_definition, definition.extends);
                
            }
            
			// implement a object of method and properties
            if(definition.implements) {
                if(definition.implements instanceof Array) {
                    var i;
                    for(i = 0; i < definition.implements.length; i++) {
                        kage.Class._extend_prototype_of(class_definition, definition.implements[i]);
                    }
                } else if (typeof definition.imlements === 'object') {
                    kage.Class._extend_prototype_of(class_definition, definition.implements);
                } else {
                    throw new Error("error implementing object methods");
                }
            }
            
			// set the prototype object of the class
            if (definition.prototype) {
                kage.Class._extend_prototype_of(class_definition, definition.prototype);
            }
            
            if (definition.static) {
                for (i in definition.static) {
                    class_definition[i] = definition.static[i];
                }
            }
        }
        
		/**
		* Provides easy access to the current class' static methods
		* @method _self
		* @return {function} the class' constructor
		*/
        class_definition.prototype._self = function() {
            return class_definition;
        };
        
		/**
		* Provides easy access to the parent class' prototype
		* @method _super
		* @return {mixed} result of the execution if there is any
		*/
        class_definition.prototype._super = function() {
            var result;
            var argv = Array.prototype.splice.call(arguments, 0);
            var _this = this;
            
			// check if there is a superclass set to the object's prototype
            if(!_this.__SUPER_CLASS__) {
                throw new Error('No base class found.');
            }
            
            var super_class = _this.__SUPER_CLASS__;
            
			// change the current super class to the parent's super class to escape from an infinite recursion
            _this.__SUPER_CLASS__ = super_class.prototype.__SUPER_CLASS__;
            
            if(super_class.prototype[argv[0]] && typeof super_class.prototype[argv[0]] === 'function') {
				// execte a method from the parent prototype
                var method = argv[0];
                argv.splice(0,1);
                result = super_class.prototype[method].apply(_this, argv);
            } else {
				// if no method is set, then we execute the parent constructor
                result = super_class.apply(_this, argv);
            }
            
			// reset __SUPER_CLASS__ var to it's original value
            _this.__SUPER_CLASS__ = super_class;
            
            return result;
        };
        
        // return the new class
        return class_definition;
    };
        
    /**
     * <p>Creates a new class and inherits a parent class</p>
     * <p><b>Note: when calling a super function use: [ParentClass].prototype.[method].call(this, arguments)</b></p>
     * @method _inherits
     * @param {object} child_class the class that will inherit the parent class
     * @param {object} base_class the class that this class will inherit
     * @private
     * @static
     */
    kage.Class._inherits = function(child_class, base_class) {
        // inherit parent's methods
        var std_class = function() {};
        std_class.prototype = base_class.prototype;
        child_class.prototype = new std_class();
		// add the super class to the child class' prototype for use with _super method
        child_class.prototype.__SUPER_CLASS__ = base_class;
        // set the constructor
        child_class.prototype.constructor = child_class;
        // return the new class
        return child_class;
    };
    
    /**
     * Copies methods form an object to the class prototype
     * @method _extendPrototypeOf
     * @param {object} child_class the class that will inherit the methods
     * @param {object} methods the object that contains the methods
     * @private
     * @static
     */
    kage.Class._extend_prototype_of = function(child_class, methods) {
        for(var i in methods) {
            child_class.prototype[i] = methods[i];
        }
        
        return child_class;
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
     * @method set
     * @param {String} name
     * @param {String} value
     * @param {Object} opt
     * @param {int} opt.expires Expiration time in seconds
     * @param {path} opt.path Default value is /
     * @param {domain} opt.domain If domain is not set then the current domain
     * will be set to cookie
     */
    kage.util.cookie.set = function(name, value, opt) {
        value = escape(value);
        if(!opt) opt = {};
        
        if(opt.expires) {
            var date = new Date();
            date.setTime(date.getTime() + parseInt(opt.expires*1000));
            value = value + ';expires=' + date.toGMTString();
        }
        
        if(opt.path) {
            value = value + ';path=' + opt.path;
        } else {
            value = value + ';path=/';
        }
        
        if(opt.domain) {
            value = value + ';domain=' + opt.domain;
        }
        
        document.cookie = name + "=" + value + ";";
    };
    
    /**
     * Retrieve a cookie's value
     * @method get
     * @param {string} name
     */
    kage.util.cookie.get = function(name) {
        var expr = new RegExp(name+'=(.*?)(;|$)','g');
        var matches = expr.exec(document.cookie);
        if(!matches || !matches[1]) {
            return null;
        }
        return matches[1];
    };
    
    /**
     * Deletes cookie
     * @method destroy
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
		constructor: function(task) {
			if(task && typeof task === 'function') {
				this._task = task;
				this._on_start = null;
				this._on_finish = null;
			} else {
				throw "Task has to be a function, but '" + typeof(task) + "' given.";
			}
		}
	});

	/**
	* Adds a callback that will be executed before the task starts
	* @method on_start
	* @param {function} fn callback
	*/
	kage.util.AsyncTask.prototype.on_start = function (fn) {
		this._on_start = fn;
		return this;
	};
	
	/**
	* Adds a callback that will be executed when the task finishes
	* @method on_finish
	* @param {function} fn callback
	*/
	kage.util.AsyncTask.prototype.on_finish = function (fn) {
		this._on_finish = fn;
		return this;
	};

	/**
	* starts the task execution
	* @method start
	*/
	kage.util.AsyncTask.prototype.start = function () {
		var _this = this;
		window.setTimeout(function() {
			if(typeof _this._on_start === 'function') {
				_this._on_start();
			}
			
			var data = _this._task();
			
			if(typeof _this._on_finish === 'function') {
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
		constructor: function(url, async) {
			// by default the http requests are synchronious
			if(async) {
				this._async = async;
			} else {
				this._async = false;
			}
			
			// jquery.ajax settings object
			this._ajax_opt = {
				url: url,
				async: async
			};
		}
	});

	/**
	* executes a GET http request
	* @static
	* @method Get
	* @param {string} url
	* @param {object} data http params
	*/
	kage.util.Http.Get = function (url, data) {
		var response = null;
		
		new kage.util.Http(url, false)
				.on_success(function(result) { response = result; })
				.get(data);
		
		return response;
	};

	/**
	* executes a POST http request
	* @static
	* @method Post
	* @param {string} url
	* @param {object} data http params
	*/
	kage.util.Http.Post = function (url, data) {
		var response = null;
		new kage.util.Http(url, false)
				.on_success(function(result) { response = result; })
				.post(data);
		
		return response;
	};
	
	/**
	* Adds a callback for successful execution of the http reguest
	* @method on_success
	* @param {function} fn
	*/
	kage.util.Http.prototype.on_success = function (fn) {
		this._ajax_opt.success = fn;
		return this;
	};

	/**
	* Adds a callback for failed http execution
	* @method on_fail
	* @param {function} fn
	*/
	kage.util.Http.prototype.on_fail = function (fn) {
		this._ajax_opt.error = fn;
		return this;
	};

	/**
	* executes the http request
	* @method exec
	* @param {string} type type of the http request (GET or POST)
	* @param {object} data http parameters
	*/
	kage.util.Http.prototype.exec = function (type, data) {
		this._ajax_opt.type = type;
		this._ajax_opt.data = data;
		
		jQuery.ajax(this._ajax_opt);
		return this;
	};

	/**
	* Executes a GET http request
	* @method get
	* @param {object} data http parameters
	*/
	kage.util.Http.prototype.get = function (data) {
		return this.exec('GET', data);
	};

	/**
	* Executes a POST http request
	* @method post
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
		constructor: function() {
			this._super();
			var argv = this.splice.call(arguments, 0);
			for(var i = 0; i < argv.length; i++) {
				this.push(argv[i]);
			}
		}
	});

	/**
	* Iterates through the collection. To break from the loop, use 'this._break();'
	* @method each
	* @param {function} fn callback
	*/
	kage.util.Collection.prototype.each = function(fn) {
		
		// helper construction for manging the for loop
		var fn_construction = {
			_status: true,
			_break: function() {
				this._status = false;
			}
		}
		
		for(var i = 0; i < this.length; i++) {
			fn.call(fn_construction, this[i], i);
			
			if(!fn_construction._status) {
				break;
			}
		}
	};
	
	/**
	* Removes an item from the collection
	* @method remove
	* @param {int} index item index
	*/
	kage.util.Collection.prototype.remove = function(index) {
		this.splice(index, 1);
	};
	
	/**
	* Extends the collection with elements from another array
	* @method extend
	* @param {Array|Collection} array secondary array
	*/
	kage.util.Collection.prototype.extend = function(array) {
		if(array instanceof Array) {
			for(var i = 0; i < array.length; i++) {
				this.push(array[i]);
			}
		} else {
			throw "extend requires an array, but " + typeof(object) + "was given.";
		}
		
		return this;
	};

	/**
	* converts the collection to a json string
	* @method to_json
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
		constructor: function(map) {
			if(map) {
				for(var i in map) {
					if (map.hasOwnProperty(i)){
						this[i] = map[i];
					}
				}
			}
		}
	});

	/**
	* checks if the hash map contains an element with a given key
	* @class HashMap
	* @return {boolean} 
	*/
	kage.util.HashMap.prototype.has = function (key) {
		return key in this;
	};

	/**
	* Iterates through the hash map. To break from the look use this._break() inside the callback.
	* @method each
	* @param {function} fn callback
	*/
	kage.util.HashMap.prototype.each = function(fn) {
		var fn_construction = {
			_status: true,
			_break: function() {
				this._status = false;
			}
		}
		
		for(var i in this) {
			if(this.hasOwnProperty(i)) {
				fn.call(fn_construction, this[i], i);
				
				if(!fn_construction._status) {
					break;
				}
			}
		}
		
		return this;
	};

	/**
	* Adds an element to the hash map
	* @method add
	* @param {string} key
	* @param {string} value 
	*/
	kage.util.HashMap.prototype.add = function(key, value) {
		this[key] = value;
		return this;
	};

	/**
	* finds the key of a value
	* @method key_of
	* @param {mixed} val
	* @return {string}
	*/
	kage.util.HashMap.prototype.key_of = function(val) {
		var ret_key = null;
		this.each(function(value, key) {
			if(value === val) {
				ret_key = key;
				this._break();
			}
		});
		
		return ret_key;
	};

	/**
	* Removes an element from the hash map
	* @method remove
	* @paramm {string} key
	*/
	kage.util.HashMap.prototype.remove = function(key) {
		delete(this[key]);
		
		return this;
	};

	/**
	* Extends the hashmap
	* @method extend
	* @param {object|HashMap} object
	*/
	kage.util.HashMap.prototype.extend = function(object) {
		if(typeof object === 'object') {
			for(var i in object) {
				if(object.hasOwnProperty(i)) {
					this[i] = object[i];
				}
			}
		} else {
			throw "extend requires an object, but " + typeof(object) + "was given.";
		}
		
		return this;
	};

	/**
	* Converts the hash map to a json string
	* @method to_json
	* @return {string} 
	*/
	kage.util.HashMap.prototype.to_json = function() {
		return JSON.stringify(this);
	};

    /**
	* Provides an extendable class with full jquery functionality
	* @class Component
	*/
    kage.Component = kage.Class({
        extends: jQuery,
        constructor: function(object) {
			// set a default object
            if(!object) {
                object = '<div/>';
            }
            
            this.init(object); // init the object
            this.constructor = jQuery; // jquery uses it's constructor internaly in some methods
			
			this.data('__KAGAMI__', this); // adds the class instance to the dom's data object
        }
    });

    /**
	* Provides functionality for creating application models
	* @class Model
	*/
	kage.Model = kage.Class({
        constructor: function() {
			/**
			* @var {HashMap<String, Array>} _events holds the event callbacks
			*/
            this._events = new kage.util.HashMap();
        }
    });

	/**
	* Used to define static methods for initializing models
	* @static
	* @method Define
	* @param {function} child_class the child model class
	*/
	kage.Model.Define = function(child_class) {
		
		/**
		* Creates a new model an initializes it's properties
		* @static
		* @method create
		* @param {object} parameters object attributes
		* @return {Model} the newly created model
		*/
		child_class.create = function(parameters) {
			var model = new child_class();
		
			for(var i in parameters) {
				if(parameters.hasOwnProperty(i)) {
					model[i] = parameters[i];
				}
			}
			
			return model;
		};
		
		/**
		* Creates a collection of models with initialized properties
		* @static
		* @method create_from_array
		* @param {Array} array array of parameteres
		* @return {Collection} a collection of models
		*/
		child_class.create_from_array = function(array) {
			var model_collection = new kage.util.Collection();
			
			for(var i = 0; i < array.length; i++) {
				model_collection.push(child_class.create(array[i]));
			}
			
			return model_collection;
		};
	};

	/**
	* adds an event to the event map of the object
	* @method on
	* @param {String} type the event name
	* @param {function} callback the callback function
	* @return {Model}
	*/
	kage.Model.prototype.on = function(type, callback) {
		if(!this._events.has(type)) {
			this._events.add(type, new kage.util.Collection);
		}
		this._events[type].push(callback);
		
		return this;
	};
	
	/**
	* triggers an event from the object's event map
	* @method on
	* @param {string} type the event name
	* @return {Model}
	*/
	kage.Model.prototype.trigger = function(type) {
		if(this._events.has(type)) {
			var _this = this;
			this._events[type].each(function(item) {
				if(typeof item === 'function') {
					item.call(_this);
				}
			});
		}
		
		return this;
	};

	/**
	* converts the object to json string
	* @method to_json
	* @return {string}
	*/
	kage.Model.prototype.to_json = function () {
		JSON.stringify(this);
	};
	
	

    /**
	* Provides functionality for handling mustache templates
	* @class View
	* @param {string} template_id the template filename without the extension
	* @param {object} opt optional option parameter
			`opt: {
				url: '<some_url>',
				view: '<template_id>',
				string: '<template_string>'
				context: <some context object>
			}`
	*/
	kage.View = kage.Class({
		constructor: function(opt) {
			if(!opt) {
				throw new Error("Available options are: 'context','view', 'url' and 'string'.");
			} else if(!opt.view && 
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
	* @method clear_cache
	* @static
	*/
	kage.View.clear_cache = function() {
		kage.View.Cache = new kage.util.HashMap();
	};

	/**
	* Creates an instance of View
	* @method make
	* @static
	* @param {string} template_id
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
	* @method Compile
	* @static
	* @param {string} html The template code
	* @return {function} compiled template
	*/
	kage.View.Compile = function(template_source) {
		// John Resig - http://ejohn.org/ - MIT Licensed
		if(!template_source) {
			template_source = '';
		}
		
		var template_func = new Function(
			"vars",
			(
				"var p=[],print=function(){p.push.apply(p,arguments);};" +
				// Introduce the data as local variables using with(){}
				"if(!vars){vars={};}" + 
				"with(vars){p.push('" +
				// Convert the template into pure JavaScript
				template_source
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
		
		return template_func;
	};

	/**
	* Renders the compiled template to html
	* @method render
	* @param {object} variables variables to pass to the template
	* @return {Component}
	*/
	kage.View.prototype.render = function(variables) {
		var template = this._compile_template_resource();
		var html = null;
		
		if(this._opt.context && typeof(this._opt.context) === 'object') {
			html = template.call(this._opt.context, variables);
		} else {
			html = template(variables);
		}
		
		return new kage.Component(html);
	};

	/**
	* Compiles a template resource dependant on the view options
	* @method _create_template_resource
	* @static
	* @return {object}
	*/
	kage.View.prototype._compile_template_resource = function() {
		var resource = null;
		var no_cache = false;
		
		if(this._opt.view) {
			resource = kage.Config.template_dir + this._opt.view + '.html';
		} else if(this._opt.url) {
			resource = this._opt.url;
		} else if(this._opt.string) {
			resource = this._opt.string;
			no_cache = true; // do not cache compilation output
		} else {
			throw new Error('Cant create template resource from view options.');
		}
		
		var template_source = null;
		if(no_cache) {
			template_source = kage.View.Compile(resource);
		} else {
			template_source = this._load_resource(resource)
		}
		
		
		return template_source;
	};
	
	/**
	* Loads a template from the Cache or from a remote file, compiles it and adds it to the Cache
	* @method _load_resource
	* @return {function} compiled template
	*/
	kage.View.prototype._load_resource = function(resource) {
		var template = null;
		if(kage.View.Cache.has(resource)){
			template = kage.View.Cache[resource]
		} else {
			var html = kage.util.Http.Get(resource);
			template = kage.View.Compile(html);
			kage.View.Cache[resource] = template;
		}
		
		return template;
	};

    /**
	* Provides functionality for creating UI sections
	* @class Section
	* @param {string} tag tag type as a string (ex: '<div/>')
	*/
	kage.Section = kage.Class({
        extends: kage.Component,
        constructor: function (tag) {
            this._super(tag);
        }
    });

	/**
	* Loads view in the section object's context
	* @method View
	* @param {string} template_id
	* @param {string} url
	*/
	kage.Section.prototype.View = function(opt) {
		if(!opt) {opt = {};}
		
		if(!opt.context) {opt.context = this;}
		
		return kage.View.make(opt);
	};

    // Initialize and return module
    return kage.init({
        app_dir: Application.config().baseUrl + 'app/'
    });

});

