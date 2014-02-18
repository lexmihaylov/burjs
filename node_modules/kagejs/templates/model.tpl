define(
[
    'libs/kage',
    'models/BaseModel'
],
function(kage, BaseModel) {
    var $(name) = kage.Class({
        extends: BaseModel,
        _construct: function() {
            $(name)._super();
        }
    });
    
    return $(name);
});
