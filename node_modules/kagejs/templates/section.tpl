define([
    'libs/kage',
    'sections/BaseSection'
],
function(
        kage,
        BaseSection
) {
    var $(name) = kage.Class({
        extends: BaseSection,
        _construct: function () {
            $(name)._super(this);
        }
    });
    
    $(name).prototype.on_dom_insert = function() {
        // TODO: do something on dom insert
    };
    
    return $(name);
});

