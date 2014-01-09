(function(root) {
    var Applicaton = {
        css_path: 'styles/',
        image_path: 'styles/images',
        resource_path: 'resources/',
        
        config: function () {
            return requirejs.s.contexts._.config;
        }
    };
    
    
    
    root.Application = Applicaton;
})(window);