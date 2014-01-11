/** 
 * Adds a domInsert event to jquery dom insertion methods 
 */

(function($) {
    /**
    * If the object already has an instance of a class it will retun it
    * @method kage_object
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
    var dom_events_modifyer = function(item) {
        if (item.trigger) {
            item.trigger('domInserted');
        }
    };
    
    /**
     * modifys a dom insertion jquery method
     * @param {type} method
     * @return {unresolved}
     */
    var on_after_insert = function(method) {
        return function() {
            var result = parent_methods[method].apply(this, arguments);
        
            var args = Array.prototype.splice.call(arguments,0);
            for(var i =0; i < args.length; i++) {
                dom_events_modifyer(args[i]);
            }

            return result;
        };
    };
    
    $.fn.append = on_after_insert('append');
    $.fn.prepend = on_after_insert('prepend');
    $.fn.after = on_after_insert('after');
    $.fn.before = on_after_insert('before');
    
})(jQuery);

