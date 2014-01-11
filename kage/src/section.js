/**
 * Provides functionality for creating UI sections
 * @class Section
 * @param {string} tag tag type as a string (ex: '<div/>')
 */
kage.Section = kage.Class({
    extends: kage.Component,
    constructor: function(tag) {
        this._super(tag);
        
        var _this = this;
        this.on('domInserted', function(event) {
            event.stopPropagation();
            if(typeof(_this.on_init) === 'function') {
                _this.on_init(event);
            }
        });
    }
});

/**
 * This method is executed when the element has been inserted in the dom
 * @type {function}
 */
kage.Section.prototype.on_init;

/**
 * Loads view in the section object's context
 * @method View
 * @param {string} template_id
 * @param {string} url
 */
kage.Section.prototype.View = function(opt) {
    if (!opt) {
        opt = {};
    }

    if (!opt.context) {
        opt.context = this;
    }

    return kage.View.make(opt);
};

/**
 * Get the computed value of a css property
 * @param {string} property a css property
 * @return {mixed} the computed value of the property
 */
kage.Section.prototype.computed_style = function(property) {
    return window
            .getComputedStyle(this.get(0)).getPropertyValue(property);
};

/**
 * Get the computed width
 * @return {string} computed width
 */
kage.Section.prototype.computed_width = function() {
    return parseFloat(this.computedStyle('width'));
};

/**
 * Get the computed height
 * @return {string}
 */
kage.Section.prototype.computed_height = function() {
    return parseFloat(this.computedStyle('height'));
};

/**
 * Sets the sections width to its parents dimensions
 * @param {boolean} include_margins
 */
kage.Section.prototype.fill_vertical = function(include_margins) {
    if (!include_margins) {
        include_margins = true;
    }
    var parent = this.parent();
    var parentHeight = parent.height();
    var paddingAndBorders = this.outerHeight(include_margins) - this.height();

    this.height(parentHeight - paddingAndBorders);

    return this;
};

/**
 * Sets the sections height to its parents dimensions
 * @param {boolean} include_margins
 */
kage.Section.prototype.fill_horizontal = function(include_margins) {
    if (!include_margins) {
        include_margins = true;
    }

    var parent = this.parent();
    var parentWidth = parent.width();
    var paddingAndBorders = this.outerWidth(include_margins) - this.width();

    this.width(parentWidth - paddingAndBorders);

    return this;
};

/**
 * Sets the sections width and height to its parents dimensions
 */
kage.Section.prototype.fill_both = function() {
    this.fill_horizontal().
            fill_vertical();

    return this;
};

/**
 * Centers the section verticaly
 */
kage.Section.prototype.center_vertical = function() {
    this.css('top', '50%');
    this.css('margin-top', -(this.outerHeight() / 2));

    if ((this.position().top - (this.outerHeight() / 2)) < 0) {
        this.css('top', 0);
        this.css('margin-top', 0);
    }

    return this;
};

/**
 * Centers the section horizontaly
 */
kage.Section.prototype.center_hotizontal = function() {
    this.css('left', '50%');
    this.css('margin-left', -(this.outerWidth() / 2));

    if ((this.position().left - (this.outerWidth() / 2)) < 0) {
        this.css('left', 0);
        this.css('margin-left', 0);
    }

    return this;
};

/**
 * Centers the section horizontaly an verticaly
 */
kage.Section.prototype.center_both = function() {
    this.center_hotizontal().
            center_vertical();

    return this;
};

