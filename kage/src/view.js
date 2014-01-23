/**
 * Provides functionality for handling mustache templates
 * @class View
 * @param {string} template_id the template filename without the extension
 * @param {object} opt optional option parameter
 `opt: {
 url: '<some_url>',
 view: '<template_id>',
 string: '<template_string>'
 context: <some context object>
 }`
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

    return new kage.Component(html);
};

/**
 * Loads a template and adds it to the view cache
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
    var resource = null;
    var no_cache = false;
    
    var urlArgs = '';
    if (ApplicationConfig && ApplicationConfig.url_args) {
        urlArgs = '?' + ApplicationConfig.url_args;
    }
    
    if (this._opt.view) {
        resource = kage.Config.template_dir + this._opt.view + '.html' + urlArgs;
    } else if (this._opt.url) {
        resource = this._opt.url + urlArgs;
    } else if (this._opt.string) {
        resource = this._opt.string;
        no_cache = true; // do not cache compilation output
    } else {
        throw new Error('Cant create template resource from view options.');
    }

    var template_source = null;
    if (no_cache) {
        template_source = kage.View.Compile(resource);
    } else {
        template_source = this._load_resource(resource);
    }


    return template_source;
};

/**
 * Loads a template from the Cache or from a remote file, compiles it and adds it to the Cache
 * 
 * @return {function} compiled template
 */
kage.View.prototype._load_resource = function(resource) {
    var template = null;
    if (kage.View.Cache.has(resource)) {
        template = kage.View.Cache[resource]
    } else {
        var html = kage.util.Http.Get(resource);
        template = kage.View.Compile(html);
        kage.View.Cache[resource] = template;
    }

    return template;
};

