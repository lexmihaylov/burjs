/**
 * Provides an extendable class with full jquery functionality
 * @class Component
 */
kage.Component = kage.Class({
    extends: jQuery,
    _construct: function(object) {
        // set a default object
        if (!object) {
            object = '<div/>';
        }
        this.constructor = jQuery; // jquery uses it's constructor internaly in some methods
        
        this.init(object); // init the object
        
        this.data('__KAGAMI__', this); // adds the class instance to the dom's data object
    }
});

