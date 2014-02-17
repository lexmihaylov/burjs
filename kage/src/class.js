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
 * Copies methods form an object to the class prototype
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

