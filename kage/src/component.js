/**
 * Provides an extendable class with full $.fn functionality
 * @class Component
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

