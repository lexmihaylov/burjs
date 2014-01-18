/** 
 * Adds a domInsert event to dom insertion methods 
 */

(function($) {
    /**
    * If the object already has an instance of a class it will retun it
    * 
    * @return {object}
    */
    $.fn.kage_object = function() {
        return $(this).data('__KAGAMI__');
    };
    
    var parent_methods = {
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
    var on_after_insert = function(item) {
        if (item.triggerHandler) {
            if(item.closest('body').length > 0) {
                item.triggerHandler('domInsert');
                item.find('*').each(function() {
                    $(this).triggerHandler('domInsert');
                });
            }
        }
    };
    
    /**
     * Triggers an event before the element has been inserted
     * @param {type} item
     * @returns {undefined}
     */
    var on_before_insert = function(item) {
        if(item.triggerHandler) {
            if(item.closest('body').length === 0) {
                item.triggerHandler('beforeDomInsert');
                item.find('*').each(function() {
                    $(this).triggerHandler('beforeDomInsert');
                });
            }
        }
    };
    
    /**
     * modifys a dom insertion method
     * @param {type} method
     * @return {unresolved}
     */
    var dom_events_modifyer = function(method) {
        return function() {
            var args = Array.prototype.splice.call(arguments,0),
                result = undefined,
                i = 0;
        
            for(i = 0; i < args.length; i++) {
                on_before_insert(args[i]);
            }
            
            result = parent_methods[method].apply(this, args);
            
            for(i = 0; i < args.length; i++) {
                on_after_insert(args[i]);
            }

            return result;
        };
    };
    
    $.fn.append = dom_events_modifyer('append');
    $.fn.prepend = dom_events_modifyer('prepend');
    $.fn.after = dom_events_modifyer('after');
    $.fn.before = dom_events_modifyer('before');
    
})(jQuery);

