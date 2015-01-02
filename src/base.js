/**
 * A library for creating an MVC onepage web applications.
 * The library is built for use with jquery and depends on requirejs
 * @namespace bur
 */
var bur = {
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
    _isInitialized: false,
    /**
     * Libaray configurations
     */
    _Config: {
        /**
         * Application directory (ex: js/app/)
         */
        appDir: 'js/app/',
        /**
         * View directory
         */
        viewDir: 'js/app/views/',
        /**
         * Model directory
         */
        modelDir: 'js/app/models/',
        /**
         * Section directory
         */
        sectionDir: 'js/app/sections/',
        /**
         * Template directory
         */
        templateDir: 'js/app/templates/'
    },
    /**
     * _set_config
     * Setups the application paths
     */
    _setAppDir: function(appDir) {
        bur._Config.appDir = appDir;
        for (var i in bur._Config) {
            if (i !== 'appDir') {
                bur._Config[i] = appDir + bur._Config[i];
            }
        }
    },
    
    /**
     * Initializes the module
     * @return {Object}
     */
    _init: function() {
        if(!bur._isInitialized) {
            bur.window = $(window);
            bur.dom = $('html');
            bur.dom.body = $('body');
            bur._isInitialized = true;
        }
        
        return bur;
    },
    
    /**
     * Gives access to the libraries configuration variable
     * @param {type} attr
     * @param {type} value
     * @returns {bur|Object|bur._Config}
     */
    config: function(attr, value) {
        
        if($.isPlainObject(attr)) {
            if(attr.appDir) {
                bur._setAppDir(attr.appDir);
            }
            
            bur._Config = $.extend(true, bur._Config, attr);
            
            return bur;
        } else if(typeof(attr) === 'string'){
            if(!value) {
                return bur._Config[attr];
            } else {
                if(attr === 'appDir') {
                    bur._setAppDir(value);
                } else {
                    bur._Config[attr] = value;
                }
                
                return bur;
            }
        } else if(!attr) {
            return bur._Config;
        } else {
            return null;
        }
    }
};

