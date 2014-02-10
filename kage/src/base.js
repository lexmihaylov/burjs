/**
 * A library for creating an MVC onepage web applications.
 * The library is built for use with jquery and depends on requirejs
 * @namespace kage
 */
var kage = {
    /**
     * @var {string} VERSION library version
     */
    VERSION: '0.1.0',
    /**
     * @var {object} window The javasript window object
     * with extended functionality
     */
    window: null,
    /**
     * @var {object} dom The javasript <HTML> object
     * with extended functionality
     */
    dom: null,
    
    /**
     * Checks if the library needs to initialize
     * @type Boolean
     */
    _is_initialized: false,
    /**
     * Libaray configurations
     */
    _Config: {
        /**
         * Application directory (ex: js/app/)
         */
        app_dir: 'js/app/',
        /**
         * View directory
         */
        view_dir: 'js/app/views/',
        /**
         * Model directory
         */
        model_dir: 'js/app/models/',
        /**
         * Section directory
         */
        section_dir: 'js/app/sections/',
        /**
         * Template directory
         */
        template_dir: 'js/app/templates/'
    },
    /**
     * _set_config
     * Setups the application paths
     */
    _set_app_dir: function(app_dir) {
        kage._Config.app_dir = app_dir;
        for (var i in kage._Config) {
            if (i !== 'app_dir') {
                kage._Config[i] = app_dir + kage._Config[i];
            }
        }
    },
    
    /**
     * Initializes the module
     * @return {Object}
     */
    _init: function() {
        if(!kage._is_initialized) {
            kage.window = $(window);
            kage.dom = $('html');
            kage.dom.body = $('body');
            kage._is_initialized = true;
        }
        
        return kage;
    },
    
    /**
     * Gives access to the libraries configuration variable
     * @param {type} attr
     * @param {type} value
     * @returns {kage|Object|kage._Config}
     */
    config: function(attr, value) {
        
        if($.isPlainObject(attr)) {
            if(attr.app_dir) {
                kage._set_app_dir(attr.app_dir);
            }
            
            kage._Config = $.extend(true, kage._Config, attr);
            
            return kage;
        } else if(typeof(attr) === 'string'){
            if(!value) {
                return kage._Config[attr];
            } else {
                if(attr === 'app_dir') {
                    kage._set_app_dir(value);
                } else {
                    kage._Config[attr] = value;
                }
                
                return kage;
            }
        } else if(!attr) {
            return kage._Config;
        } else {
            return null;
        }
    }
};

