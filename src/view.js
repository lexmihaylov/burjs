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
 * Creates an instance of View
 * 
 * @static
 * @param {String} template
 * @param {Object} context(optional)
 * @return {Component}
 */
kage.View.make = function(template, context) {
    return new kage.View(template, context);
};

/**
 * Compiles and renders the compiled template to html
 * 
 * @param {object} variables variables to pass to the template
 * @return {String}
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
 * Tmplate regular expression settings
 * @var {Object}
 */
kage.View.settings = {
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g
};

/**
 * Template special chars escape map
 * @var {Object}
 */
kage.View.escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
};

/**
 * Template special char regualt expression
 * @var {RegExp}
 */
kage.View.escaper = /\\|'|\r|\n|\u2028|\i2028/g;


/**
 * Html entities map used for escaping html
 * @var {Object}
 */
kage.View.htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
}

/**
 * Escapes an html string using the html entity map
 * @param {String}
 * @return {String}
 * @static
 */
kage.View.escapeHtml = function(html) {
    return String(html).replace(/[&<>"'\/]/g, function (entity) {
        return kage.View.htmlEntities[entity];
    });
};

/**
 * Compiles a template to javascript code
 * 
 * @static
 * @param {string} html The template code
 * @return {function} compiled template
 */
kage.View.Compile = function(template) {

    var matcher = new RegExp([
            (kage.View.settings.interpolate).source,
            (kage.View.settings.escape).source,
            (kage.View.settings.evaluate).source
        ].join('|') + '|$', 'g');

    var source = '',
        index = 0;
    template.replace(matcher, function(match, interpolate, escape, evaluate, offset) {
        source += template.slice(index, offset).replace(kage.View.escaper, function(match) {
            return '\\' +kage.View.escapes[match];
        });

        index = offset + match.length;

        if(interpolate) {
            source += "'+((__v=" + interpolate + ")==null?'':__v)+'";
        } else if(escape) {
            source += "'+((__v=" + escape + ")==null?'':kage.View.escapeHtml(__v))+'";
        } else if(evaluate) {
            source += "'; " + evaluate + " __s+='";
        }

        return match;
    });

    var source = "var __v,__s=''; with(obj||{}){ __s+='" + source + "'; }; return __s;";

    try {
        render = new Function('obj, kage', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    return function(vars) {
        return render.call(this, vars, kage);
    };
};

