requirejs.config({
    baseUrl: ApplicationConfig.base_url,
    urlArgs: ApplicationConfig.url_args, // no cache
    paths: {
        sections: 'app/sections',
        models: 'app/models',
        helpers: 'app/helpers'
    }
});

require(
[
    'libs/kage'
],
// main application function (starter)
function(
    kage
) {
	
    // TODO: your starter code here
	
});


