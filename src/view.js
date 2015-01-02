/**
 * Provides functionality for handling templates
 * @class View
 * @param {string} template the template filename without the extension
 * @param {object} context optional context parameter
 * 
 */
bur.View = bur.Class({
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
 * @param {String|Function} template template string or a compiled template function
 * @param {Object} context(optional)
 * @return {Component}
 */
bur.View.make = function(template, context) {
    return new bur.View(template, context);
};

/**
 * Compiles and renders the compiled template to html
 * 
 * @param {object} variables variables to pass to the template
 * @return {String}
 */
bur.View.prototype.render = function(variables) {
    var template = null;
    
    if(typeof(this._template) === 'function') {
        template = this._template;
    } else {
        template = bur.View.Compile(this._template);
    }
    
    return template.call(this._context, variables);
};

/**
 * Returns compiled template for caching
 * 
 * @param {object} variables variables to pass to the template
 * @return {String}
 */
bur.View.prototype.compile = function(variables) {
    var template = null;
    
    if(typeof(this._template) === 'function') {
        template = this._template;
    } else {
        template = bur.View.Compile(this._template);
    }
    
    return template;
};

/**
 * Tmplate regular expression settings
 * @var {Object}
 */
bur.View.settings = {
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g,
    evaluate: /<%([\s\S]+?)%>/g
};

/**
 * Template special chars escape map
 * @var {Object}
 */
bur.View.escapes = {
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
bur.View.escaper = /\\|'|\r|\n|\u2028|\i2028/g;


/**
 * Html entities map used for escaping html
 * @var {Object}
 */
bur.View.htmlEntities = {
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
bur.View.escapeHtml = function(html) {
    return String(html).replace(/[&<>"'\/]/g, function (entity) {
        return bur.View.htmlEntities[entity];
    });
};

/**
 * Compiles a template to javascript code
 * Note: this is an adaptation of underscore's template system
 * 
 * @static
 * @param {string} html The template code
 * @return {function} compiled template
 */
bur.View.Compile = function(template) {

    var matcher = new RegExp([
            (bur.View.settings.interpolate).source,
            (bur.View.settings.escape).source,
            (bur.View.settings.evaluate).source
        ].join('|') + '|$', 'g');

    var source = '',
        index = 0;
    template.replace(matcher, function(match, interpolate, escape, evaluate, offset) {
        source += template.slice(index, offset).replace(bur.View.escaper, function(match) {
            return '\\' +bur.View.escapes[match];
        });

        index = offset + match.length;

        if(interpolate) {
            source += "'+((__v=" + interpolate + ")==null?'':__v)+'";
        } else if(escape) {
            source += "'+((__v=" + escape + ")==null?'':bur.View.escapeHtml(__v))+'";
        } else if(evaluate) {
            source += "'; " + evaluate + " __s+='";
        }

        return match;
    });

    var source = "var __v,__s=''; with(obj||{}){ __s+='" + source + "'; }; return __s;";

    try {
        render = new Function('obj, bur', source);
    } catch (e) {
        e.source = source;
        throw e;
    }

    return function(vars) {
        return render.call(this, vars, bur);
    };
};

