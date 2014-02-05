(function(root, factory) {
    if(typeof(define) === 'function' && define.amd) {
        define('kage', ['jquery'], factory);
    } else if(typeof(root) === 'object' && typeof(root.document) === 'object') {
        // check if jquery dependency is met
        if (typeof (root.$) !== 'function' ||
                typeof (root.$.fn) !== 'object' ||
                !root.$.fn.jquery) {

            throw new Error("kage.js dependency missing: jQuery");
        }
        
        root.kage = factory(root.$);
    }
})(this, function($) {

