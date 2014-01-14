define(['libs/kage'], function(kage) {

    /**
     * The application's base model the is extended by every application model
     * @class BaseModel
     */
    var BaseModel = kage.Class({
        extends: kage.Model,
        constructor: function() {
            BaseModel._super(this);
        }
    });

    kage.Model.Define(BaseModel);

    return BaseModel;
});