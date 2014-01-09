    /**
	* Provides functionality for creating UI sections
	* @class Section
	* @param {string} tag tag type as a string (ex: '<div/>')
	*/
	kage.Section = kage.Class({
        extends: kage.Component,
        constructor: function (tag) {
            this._super(tag);
        }
    });

	/**
	* Loads view in the section object's context
	* @method View
	* @param {string} template_id
	* @param {string} url
	*/
	kage.Section.prototype.View = function(opt) {
		if(!opt) {opt = {};}
		
		if(!opt.context) {opt.context = this;}
		
		return kage.View.make(opt);
	};

