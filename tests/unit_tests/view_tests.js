define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage');
    
    test('kage.View construction', function() {
        throws(function() {
            new kage.View();
        }, Error, 'new kage.View() should throw an exception');
        
        throws(function() {
            new kage.View({'udef': true});
        }, Error, 'new kage.View({udef: true}) should throw an exception');
    });
    
    test('kage.View create instance', function() {
        equal(typeof(new kage.View({view: 'something'})), 'object', "new kage.View({view: 'something'}) creates an instance");
        equal(typeof(new kage.View({string: 'something'})), 'object', "new kage.View({string: 'something'}) creates an instance");
        equal(typeof(new kage.View({url: 'something'})), 'object', "new kage.View({url: 'something'}) creates an instance");
        equal(typeof(new kage.View({context: this, view: 'something'})), 'object', "new kage.View({context: this, view: 'something'}) creates an instance");
    });
    
    test('kage.View.render', function() {
        kage.config({
            templateDir: 'resources/templates/'
        });
        
        equal(
            kage.View.make({view: 'view'}).render({v: 'test'}),
            '<view>test</view>',
            "({view: '<view>'}).render() success"
        );

        equal(
            kage.View.make({url: 'resources/templates/view.ejs'}).render({v: 'test'}),
            '<view>test</view>',
            "({url: '<path>/<view>'}).render() success"
        );

        equal(
            kage.View.make({string: '<view><%= v %></view>'}).render({v: 'test'}),
            '<view>test</view>',
            "({string: '<some-string>'}).render() success"
        );

        equal(
            kage.View.make({view: 'context', context: {test: 'test'}}).render(),
            '<view>test</view>',
            "render() with custom context success"
        );
    });
    
    test('kage.View.Cache', function() {
        kage.config({
            templateDir: 'resources/templates/'
        });
        
        kage.View.make({view: 'view'}).render({v: 'test'});
        
        equal(
            typeof(kage.View.Cache.get(kage.config('templateDir') + 'view.ejs?'+kage.config('viewArgs'))),
            'function', 
            'View cache works'
        );

        kage.View.clearCache();
        
        equal(kage.View.Cache.size(), 0, 'kage.View.clearCache() success');
    });
    
    asyncTest('kage.View.Prefetch', function() {
        kage.config({
            templateDir: 'resources/templates/'
        });
        
        kage.View.clearCache();
        
        var progress = [];
        kage.View.Prefetch({
            views: ['view'],
            urls: ['resources/templates/context.ejs'],
            progress: function(percent) {
                progress.push(percent);
            }, 
            done: function() {
                equal(progress, '50,100', 'Progress updates success (50,100)');
                equal(kage.View.Cache.size(), 2, 'Prefetching successful');
                start();
            }
        });
    });
});