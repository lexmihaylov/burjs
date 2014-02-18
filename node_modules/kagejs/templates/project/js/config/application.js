define(['libs/kage'], function(kage) {
    kage.config({
        base_dir: 'js/',
        view_args: Date.now(),
        css_path: 'css/',
        image_path: 'css/images',
        resource_path: 'resources/',
        backend_url: 'backend/index.php',
        // list of application views
        prefetch_views: []
    });
    
    return kage;
});