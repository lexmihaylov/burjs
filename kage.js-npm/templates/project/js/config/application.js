define(['libs/kage'], function(kage) {
    kage.config({
        baseDir: 'js/',
        urlArgs: Date.now(),
        cssPath: 'css/',
        imagePath: 'css/images',
        resourcePath: 'resources/',
        
        // list of application templates
        // templates will be automatically loaded asyncroniously
        templates: []
    });
    
    return kage;
});