/**
 * Class
 * Creates a class by passing in a class definition as a javascript object
 * @param {Object} definition the class definition object
 * @return {function} the newly created class
 */
kage.Class = function(definition) {
    // load class helper functions
    // define simple constructor
    var class_definition = function() {
    };

    if (definition) {

        // set construnctor if it exists in definition
        if (definition.constructor) {
            class_definition = definition.constructor;
        }

        // extend a class if it's set in the definition
        if (definition.extends) {
            kage.Class._inherits(class_definition, definition.extends);

        }

        // implement a object of method and properties
        if (definition.implements) {
            if (definition.implements instanceof Array) {
                var i;
                for (i = 0; i < definition.implements.length; i++) {
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
        if (!_this.__SUPER_CLASS__) {
            throw new Error('No base class found.');
        }

        var super_class = _this.__SUPER_CLASS__;

        // change the current super class to the parent's super class to escape from an infinite recursion
        _this.__SUPER_CLASS__ = super_class.prototype.__SUPER_CLASS__;

        if (super_class.prototype[argv[0]] && typeof super_class.prototype[argv[0]] === 'function') {
            // execte a method from the parent prototype
            var method = argv[0];
            argv.splice(0, 1);
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
    var std_class = function() {
    };
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
    for (var i in methods) {
        child_class.prototype[i] = methods[i];
    }

    return child_class;
};

