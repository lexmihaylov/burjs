define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage');
    
    test('kage.Section create instance', function() {
        ok((new kage.Section()) instanceof kage.Section, 'new kage.Section() creates an instance');
        ok((new kage.Section('<ul/>')) instanceof kage.Section, 'new kage.Section("<ul/>") creates an instance');
    });
    
    test('kage.Section on_dom_insert', function() {
        var section = new kage.Section();
        var success = false;
        section.on_dom_insert = function() {
            success = true;
        };
        
        section.appendTo('body').remove();
        ok(success, 'on_dom_insert successfully called on(\'domInsert\')');
    });
    
    test('this.View method test', function() {
        ok(((new kage.Section()).View({'view': 'view'})) instanceof kage.View, 'this.View creates an instace of kage.View');
    });
    
    test('kage.Section style methods', function() {
        var section = new kage.Section('<div style="width: 100px; height: 200px; position: absolute"/>');
        section.appendTo('body');
        equal(section.computed_width(), 100, 'getting computed styles success');
        
        section.center_both();
        
        var position_success = false;
        if(parseInt(section.css('margin-left')) === -50 &&
                parseInt(section.css('margin-top')) === -100 &&
                section.prop('style').left === '50%' &&
                section.prop('style').top === '50%') {
            position_success = true;
        }
        
        ok(position_success, 'centering test successful');
        
        section.attr('style', 'width: 100px; height: 200px; position: absolute');
        
        section.fill_both();
        
        var filling_success = false;
        if(section.width() === kage.dom.body.width() &&
                section.height() === kage.dom.body.height()) {
            filling_success = true;
        }
        
        ok(filling_success, 'filling parent successful');
        
        section.remove();
    });
});