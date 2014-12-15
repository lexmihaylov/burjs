/**
 * Provides functionality for handling templates
 * @class View
 * @param {string} template the template filename without the extension
 * @param {object} context optional context parameter
 * 
 */
kage.View = kage.Class({
    _construct: function(template, context) {
        this._template = template;
        
        if(context) {
            this._context = context;
        } else {
            this._context = this;
        }
    }
});

/**
 * Holds compiled application templates
 * @var Templates {HashMap}
 * @static
 */
kage.View.Templates = new kage.util.HashMap();

/**
 * Creates an instance of View
 * 
 * @static
 * @param {object} opt optional option parameter
 `opt: {
 url: '<some url>'
 context: <some context object>
 }`
 * @return {View}
 */
kage.View.make = function(template, context) {
    return new kage.View(template, context);
};

/**
 * Compiles and renders the compiled template to html
 * 
 * @param {object} variables variables to pass to the template
 * @return {Component}
 */
kage.View.prototype.render = function(variables) {
    var template = null;
    
    if(typeof(this._template) === 'function') {
        template = this._template;
    } else {
        template = kage.View.Compile(this._template);
    }
    
    return template.call(this._context, variables);
};

/**
 * Compiles a template to javascript code
 * 
 * @static
 * @param {string} html The template code
 * @return {function} compiled template
 */
kage.View.Compile = function(templateSource) {
    // John Resig - http://ejohn.org/ - MIT Licensed
    if (!templateSource) {
        templateSource = '';
    }

    var templateFunc = new Function(
            "vars",
            (
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    // Introduce the data as local variables using with(){}
                    "if(!vars){vars={};}" +
                    "with(vars){p.push('" +
                    // Convert the template into pure JavaScript
                    templateSource
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

    return templateFunc;
};

/**
 * Clears the template cache
 * 
 * @static
 */
kage.View.clearCache = function() {
    kage.View.Templates = new kage.util.HashMap();
};

/**
 * Compiles and adds the template to the template map or gets a compiled template
 * by its ID
 * @param {string} id identification of the compiled template. The compiled
 * template can be accessed by `kage.Cache('<key>')`
 * @param {string} template the teplates string
 * @returns {function} compiled template
 */
kage.View.Cache = function(id, template) {
    if(!template) {
        return kage.View.Templates.get(id);
    }
    
    var compiledTemplate = kage.Compile(template);
    kage.View.Templates.add(id, compiledTemplate);
    
    return compiledTemplate;
};

