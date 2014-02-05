/**
 * Provides functionality for handling mustache templates
 * @class View
 * @param {string} template_id the template filename without the extension
 * @param {object} opt optional option parameter
 * `opt: {
 *      url: '<some_url>',
 *      view: '<template_id>',
 *      string: '<template_string>',
 *      context: <some context object>
 * }`
 */
kage.View = kage.Class({
    _construct: function(opt) {
        if (!opt) {
            throw new Error("Available options are: 'context','view', 'url' and 'string'.");
        } else if (!opt.view &&
                !opt.url &&
                !opt.string) {
            throw new Error("No template source. Please set one: ('view', 'url' or 'string').");
        }

        this._opt = opt;
    }
});

/**
 * Holds compiled application templates
 * @var Cache {HashMap}
 * @static
 */
kage.View.Cache = new kage.util.HashMap();

/**
 * Clears the template cache
 * 
 * @static
 */
kage.View.clear_cache = function() {
    kage.View.Cache = new kage.util.HashMap();
};

/**
 * Creates an instance of View
 * 
 * @static
 * @param {string} template_id
 * @param {object} opt optional option parameter
 `opt: {
 url: '<some url>'
 context: <some context object>
 }`
 * @return {View}
 */
kage.View.make = function(opt) {
    return new kage.View(opt);
};

/**
 * Compiles a template to javascript code
 * 
 * @static
 * @param {string} html The template code
 * @return {function} compiled template
 */
kage.View.Compile = function(template_source) {
    // John Resig - http://ejohn.org/ - MIT Licensed
    if (!template_source) {
        template_source = '';
    }

    var template_func = new Function(
            "vars",
            (
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    // Introduce the data as local variables using with(){}
                    "if(!vars){vars={};}" +
                    "with(vars){p.push('" +
                    // Convert the template into pure JavaScript
                    template_source
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'") +
                    "');}return p.join('');"
                    )
            );

    return template_func;
};

/**
 * Renders the compiled template to html
 * 
 * @param {object} variables variables to pass to the template
 * @return {Component}
 */
kage.View.prototype.render = function(variables) {
    var template = this._compile_template_resource();
    var html = null;

    if (this._opt.context && typeof (this._opt.context) === 'object') {
        html = template.call(this._opt.context, variables);
    } else {
        html = template(variables);
    }

    return html;
};

/**
 * Don't render the template, just add it to the view cache
 * @returns {function} compiled template
 */
kage.View.prototype.cache = function() {
    return this._compile_template_resource();
};

/**
 * Compiles a template resource dependant on the view options
 * 
 * @static
 * @return {object}
 */
kage.View.prototype._compile_template_resource = function() {
    var data = this._build_resource_from_options();

    var template_source = null;
    if (!data.cache) {
        template_source = kage.View.Compile(data.resource);
    } else {
        template_source = this._load_resource(data.resource);
    }


    return template_source;
};

/**
 * Builds a resource object
 * @returns {object}
 */
kage.View.prototype._build_resource_from_options = function() {
    var resource = null;
    var cache = true;
    
    var urlArgs = '';
    if (kage.config('url_args')) {
        urlArgs = '?' + kage.config('url_args');
    }
    
    if (this._opt.view) {
        resource = kage.Config.template_dir + this._opt.view + '.ejs' + urlArgs;
    } else if (this._opt.url) {
        resource = this._opt.url + urlArgs;
    } else if (this._opt.string) {
        resource = this._opt.string;
        cache = false; // do not cache compilation output
    } else {
        throw new Error('Can\'t create template resource from view options.');
    }
    
    return {
        resource: resource,
        cache: cache
    };
};

/**
 * Loads a template from the Cache or from a remote file, compiles it and adds it to the Cache
 * 
 * @return {function} compiled template
 */
kage.View.prototype._load_resource = function(resource) {
    var template = null;
    if (kage.View.Cache.has(resource)) {
        template = kage.View.Cache[resource];
    } else {
        var html = kage.util.Http.Get(resource);
        template = kage.View.Compile(html);
        kage.View.Cache[resource] = template;
    }

    return template;
};

/**
 * Preloads a list of templates asynchroniously and adds them to the view cache
 * @param {object} opt 
 * opt = {
 *      views: [...],
 *      urls: [...],
 *      progress: function(percent) { ... },
 *      done: function() { ... } 
 * }
 * @returns {undefined}
 */
kage.View.Prefetch = function(opt) {
    if(typeof(opt) === 'object') {
        var list = [], 
            callbacks = {}, 
            i = 0;
    
        if(opt.views && (opt.views instanceof Array)) {
            for(i = 0; i < opt.views.length; ++i) {
                list.push({
                    view: opt.views[i]
                });
            }
        }
        
        if(opt.urls && (opt.urls instanceof Array)) {
            for(i = 0; i < opt.urls.length; ++i) {
                list.push({
                    url: opt.urls[i]
                });
            }
        }
        
        if(typeof(opt.progress) === 'function') {
            callbacks.progress = opt.progress;
        }
        
        if(typeof(opt.done) === 'function') {
            callbacks.done = opt.done;
        }
        
        kage.View.Prefetch._prefetch_from_array(list, callbacks);
    }
};

/**
 * Preloads a array of urls or views
 * @param {'view'|'url'} type view option
 * @param {type} list list of urls or viewss
 * @param {type} opt object containing the callbacks
 * @returns {undefined}
 */
kage.View.Prefetch._prefetch_from_array = function(list, callbacks) {
    var load_count = 0;
    if(list.length === 0) {
        if(typeof(callbacks.progress) === 'function') {
            callbacks.progress(100);
        }
        
        if(typeof(callbacks.done) === 'function') {
            callbacks.done();
        }
        
        return;
    }
    
    for(var i = 0; i < list.length; ++i) {
        var view = kage.View.make(list[i]);
        var data = view._build_resource_from_options();
        
        if(data.cache) {
            var progress_change = function() {
                load_count++;
                
                if(typeof(callbacks.progress) === 'function') {
                    var percent = (load_count/list.length) * 100;
                    callbacks.progress(percent);
                }
                
                if(load_count === list.length) {
                    if(typeof(callbacks.done) === 'function') {
                        callbacks.done();
                    }
                }
            };
            
            kage.View._fetch_template(data.resource, progress_change);
        }
    }
};

/**
 * Creates an http request that retrieves the template source
 * @param {type} resource
 * @param {type} callback
 * @returns {undefined}
 */
kage.View._fetch_template = function(resource, callback) {
    new kage.util.Http(resource, true).
        on_success(function(template) {
            kage.View.Prefetch._compile_and_cache(resource, template);
            callback();
        }).
        on_fail(function() {
            console.log("Error fetching template: '" + resource + "'.");
            callback();
        }).
        get();
};

/**
 * Compiles a template and adds it to the view cache for future use
 * @param {type} resource
 * @param {type} template
 * @returns {undefined}
 */
kage.View.Prefetch._compile_and_cache = function(resource, template) {
    kage.View.Cache[resource] = kage.View.Compile(template);
};
