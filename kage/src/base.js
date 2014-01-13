/**
 * A library for creating an MVC onepage web applications.
 * The library is build on top of jquery and depends on requirejs
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
     * Libaray configurations
     */
    Config: {
        /**
         * Application directory (ex: js/app/)
         */
        app_dir: null,
        /**
         * View directory
         */
        view_dir: 'views/',
        /**
         * Model directory
         */
        model_dir: 'models/',
        /**
         * Section directory
         */
        section_dir: 'sections/',
        /**
         * Template directory
         */
        template_dir: 'templates/'
    },
    /**
     * _set_config
     * Setups the application paths
     */
    _set_config: function() {
        var app_dir = kage.Config.app_dir,
                i;
        for (i in kage.Config) {
            if (i !== 'app_dir') {
                kage.Config[i] = app_dir + kage.Config[i];
            }
        }
    },
    /**
     * init
     * Initializes the module
     * @return {Object}
     */
    init: function() {
        if(!window.ApplicationConfig) {
            throw new Error('ApplicationConfig object is required.');
        }
        
        if (!window.KAGE_GLOBALS) {
            window.KAGE_GLOBALS = {
                window: new jQuery(window),
                dom: new jQuery('html')
            };

            window.KAGE_GLOBALS.dom.body = new jQuery('body');
        }
        // load references to shared objects
        kage.window = window.KAGE_GLOBALS.window;
        kage.dom = window.KAGE_GLOBALS.dom;

        kage.Config.app_dir = ApplicationConfig.base_url + 'app/';
        kage._set_config();

        return this;
    }
};

