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
        kage._Config.appDir = appDir;
        for (var i in kage._Config) {
            if (i !== 'appDir') {
                kage._Config[i] = appDir + kage._Config[i];
            }
        }
    },
    
    /**
     * Initializes the module
     * @return {Object}
     */
    _init: function() {
        if(!kage._isInitialized) {
            kage.window = $(window);
            kage.dom = $('html');
            kage.dom.body = $('body');
            kage._isInitialized = true;
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
            if(attr.appDir) {
                kage._setAppDir(attr.appDir);
            }
            
            kage._Config = $.extend(true, kage._Config, attr);
            
            return kage;
        } else if(typeof(attr) === 'string'){
            if(!value) {
                return kage._Config[attr];
            } else {
                if(attr === 'appDir') {
                    kage._setAppDir(value);
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
    },
    
    startApp: function() {
        var deffered = $.Deferred();
        
        kage.View.init({
           progress: deffered.notify,
           done: deffered.resolve,
           views: kage.config('templates').views,
           urls: kage.config('templates').urls
        });
        
        return deffered.promise();
    }
};

