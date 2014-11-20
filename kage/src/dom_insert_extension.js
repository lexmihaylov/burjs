/** 
 * Adds a domInsert event to dom insertion methods 
 */

(function($) {
    
    var parentMethods = {
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
    var onAfterInsert = function(item) {
        if (item.triggerHandler) {
            if(item.closest('body').length > 0) {
                item.triggerHandler('dom:insert');
                item.find('*').each(function() {
                    $(this).triggerHandler('dom:insert');
                });
            }
        }
    };
    
    /**
     * modifys a dom insertion method
     * @param {type} method
     * @return {unresolved}
     */
    var domEventsModifyer = function(method) {
        return function() {
            var args = Array.prototype.splice.call(arguments,0),
                result = undefined,
                i = 0;
            
            result = parentMethods[method].apply(this, args);
            
            for(i = 0; i < args.length; i++) {
                onAfterInsert(args[i]);
            }

            return result;
        };
    };
    
    $.fn.append = domEventsModifyer('append');
    $.fn.prepend = domEventsModifyer('prepend');
    $.fn.after = domEventsModifyer('after');
    $.fn.before = domEventsModifyer('before');
    
})($);

