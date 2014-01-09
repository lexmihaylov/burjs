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
	
	

