define(['libs/kage'], function(kage) {
	
	/**
	* BaseSection shoud be extended by all application sections
	* @class BaseSection
	*/
	var BaseSection = kage.Class({
		extends: kage.Section,
		constructor: function(tag) {
			this._super(tag);
		}
	});
	
	return BaseSection;
});