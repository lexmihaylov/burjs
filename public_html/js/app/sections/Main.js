/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define([
    'libs/kage',
    'sections/BaseSection'
],
function(
        kage,
        BaseSection
) {
    window.Sections = {};
    
    var Main = kage.Class({
        extends: BaseSection,
        _construct: function () {
            Main._super(this);
            
            this.addClass('main-wrapper');
        }
    });
    
    Main.init = function() {
        kage.View.Prefetch({
            progress: function(percent) {
                // progress updates
            },
            done: function() {
                var main = new Main();
                kage.dom.body.html(main);
            },
            views: kage.config('prefetch_views')
        });

    };
    
    Main.prototype.on_dom_insert = function() {
                
    };
    
    return Main;
});

