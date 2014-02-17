define(['libs/kage'], function(kage) {

    /**
     * BaseSection shoud be extended by all application sections
     * @class BaseSection
     */
    var BaseSection = kage.Class({
        extends: kage.Section,
        _construct: function(tag) {
            BaseSection._super(this, [tag]);
        }
    });

    return BaseSection;
});