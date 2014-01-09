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

