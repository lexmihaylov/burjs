(function(root, factory) {
    if(typeof(define) === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if(typeof(root) === 'object' && typeof(root.document) === 'object') {
        // check if jquery dependency is met
        if (typeof (root.$) !== 'function' ||
                typeof (root.$.fn) !== 'object' ||
                !root.$.fn.jquery) {

            throw new Error("bur.js dependency missing: jQuery");
        }
        
        root.bur = factory(root.$);
    }
})(this, function($) {

