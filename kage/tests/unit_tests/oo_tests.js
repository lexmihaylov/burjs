define(['kage', 'QUnit'], function(kage, QUnit) {
    module('kage');
    test('kage.Class', function() {
        var Parent = kage.Class({
            _construct: function(name) {
                this.name = name;
                this.children = [];
            }
        });

        Parent.prototype.get_children = function() {
            return this.chidren;
        };

        Parent.prototype.get_name = function() {
            return this.name;
        };

        Parent.prototype.set_name = function(name) {
            this.name = name;
            return this;
        };

        equal(typeof (Parent), 'function', 'class definition successfull');
        equal(typeof (Parent.prototype.get_name), 'function', 'method definition successfull');

        var parent = new Parent('MyName');
        equal(parent.name, 'MyName', 'instance variable definition successfull');

        equal(parent.get_name(), 'MyName', 'getter call successfull');
        equal(parent.set_name('NewName').name, 'NewName', 'setter call successfull');

        var Child = kage.Class({
            extends: Parent,
            _construct: function(name) {
                Child._super(this, [name]);
            }
        });

        Child.prototype.set_name = function(name) {
            Child._super(this, 'set_name', [name]);

            this.name += '_ChildClass';

            return this;
        };

        equal(typeof (Child), 'function', 'child class definition successfull');

        var child = new Child('ChildName');

        equal(typeof (child), 'object', 'creating instance of child class successfull');
        ok(child instanceof Parent, 'child instance is also an instace of parent class');
        equal(child.name, 'ChildName', 'super constructor call success full');

        equal(typeof (child.get_name), 'function', 'parent prototype extending successfull');
        equal(child.set_name('My').name, 'My_ChildClass', 'method overriding with parent method call successfull');
        
        
        
        equal(child._self(), Child, '<object>._self() retuns the object\'s constructor');
        
        throws(function() {
            Child._super(null);
        }, Error, 'Call _super method with null instead of this.');
        
        throws(function() {
            Child._super(child, {});
        }, Error, 'called _super() method width object instead of string for method name');
        
        throws(function() {
            Child._super(child, '_undef_method');
        }, Error, 'called _super() with undefined method');
    });
});