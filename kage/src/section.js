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

        this._createDomEvents();

        this.on('dom:insert', function(event) {
            if (typeof(_this.onDomInsert) === 'function') {
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

