/**
 * Provides functionality for creating UI sections
 * @class Section
 * @param {string} tag tag type as a string (ex: '<div/>')
 */
kage.Section = kage.Class({
    extends: kage.Component,
    _construct: function(tag) {
        kage.Section._super(this, [tag]);

        var _this = this;

        this.on('domInsert', function(event) {
            if(typeof(_this.onDomInsert) === 'function') {
                _this.onDomInsert(event);
            }
            _this.off(event);
        });
    }
});

/**
 * A method that will be executed when an object is appended to the dom
 * @param {type} event
 * @returns {undefined}
 */
kage.Section.prototype.onDomInsert = function(event) {};

/**
 * Loads view in the section object's context
 *
 * @param {object} opt
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
 * One way data binding between view and model
 * @param model {kage.Model}
 * @param bindAttr {string} (Optional)
 * @returns {undefined}
 */
// TODO: test this method
kage.Section.prototype.dataBindTo = function(model, bindAttr) {
    if(!(model instanceof kage.Model)) {
        throw new Error('Model has to be an instance of `kage.Model`.');
    }

    if(!bindAttr) {
        bindAttr = 'model';
    }

    var modelAttr = model.getAll();
    for(var i in modelAttr) {
        this.on('change', '*[' + bindAttr + '="' + i + '"]', function() {
            var tag = $(this);
            model.getAll()[i] = tag.val();
            model.trigger('save', {property: i, value: tag.val()});
        });
    }
};

/**
 * One way data binding between model and view
 * @param model {kage.Model}
 * @param bindAttr {string} (Optional)
 * @returns {undefined}
 */
// TODO: test this method
kage.Section.prototype.dataBindFrom = function(model, bindAttr) {
    if(!(model instanceof kage.Model)) {
        throw new Error('Model has to be an instance of `kage.Model`.');
    }

    if(!bindAttr) {
        bindAttr = 'model';
    }

    var _this = this;
    this.listenTo(model, 'change', function(data) {
        if(typeof(data) !== 'object') {
            return;
        }

        var tags = _this.find('*[' + bindAttr + '="' + data.property + '"]');

        tags.each(function() {
            var tag = $(this);

            switch(this.tagName.toLowerCase()) {
                case 'textarea':
                case 'input':
                    if(tag.attr('type').toLowerCase() === 'radio') {
                        if(tag.val() === data.value) {
                            tag.attr('checked', true);
                        }
                        break;
                    } else if(tag.attr('type').toLowerCase() === 'checkbox') {
                        tag.attr('checked', Boolean(data.value));
                        break;
                    }
                case 'select':
                    tag.val(data.value);
                    break;
                default:
                    tag.html(data.value);
                    break;
            }
        });
    });
};

/**
 * Get the computed value of a css property
 * @param {string} property a css property
 * @return {mixed} the computed value of the property
 */
kage.Section.prototype.computedStyle = function(property) {
    return window
            .getComputedStyle(this.get(0)).getPropertyValue(property);
};

/**
 * Get the computed width
 * @return {string} computed width
 */
kage.Section.prototype.computedWidth = function() {
    return parseFloat(this.computedStyle('width'));
};

/**
 * Get the computed height
 * @return {string}
 */
kage.Section.prototype.computedHeight = function() {
    return parseFloat(this.computedStyle('height'));
};

/**
 * Sets the sections width to its parents dimensions
 * @param {boolean} includeMargins
 */
kage.Section.prototype.fillVertical = function(includeMargins) {
    if (!includeMargins) {
        includeMargins = true;
    }
    var parent = this.parent();
    var parentHeight = parent.height();
    var paddingAndBorders = this.outerHeight(includeMargins) - this.height();

    this.height(parentHeight - paddingAndBorders);

    return this;
};

/**
 * Sets the sections height to its parents dimensions
 * @param {boolean} includeMargins
 */
kage.Section.prototype.fillHorizontal = function(includeMargins) {
    if (!includeMargins) {
        includeMargins = true;
    }

    var parent = this.parent();
    var parentWidth = parent.width();
    var paddingAndBorders = this.outerWidth(includeMargins) - this.width();

    this.width(parentWidth - paddingAndBorders);

    return this;
};

/**
 * Sets the sections width and height to its parents dimensions
 */
kage.Section.prototype.fillBoth = function() {
    this.fillHorizontal().
            fillVertical();

    return this;
};

/**
 * Centers the section verticaly
 */
kage.Section.prototype.centerVertical = function() {
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
kage.Section.prototype.centerHorizontal = function() {
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
kage.Section.prototype.centerBoth = function() {
    this.centerHorizontal().
            centerVertical();

    return this;
};

