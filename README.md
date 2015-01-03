Burjs
=======
The Burjs probject is ment to be used a mediator that can bind all your favorite libraries in a single object oriented
MV* application. Burjs is build on top of jQuery, which enables developers to use a wide variaty of plugins. This library implements a Component, Model and View classes that developers can use to build their MV* application structure.

##Installation
You can install it either by downloading it from GitHub as a zip or by using one of the methods listed bellow:
####Using git

    git clone https://github.com/lexmihaylov/burjs.git
    
####Using wget

    wget https://raw.githubusercontent.com/lexmihaylov/burjs/master/bur.js

####Using bower

    bower install https://github.com/lexmihaylov/burjs.git
    
##Usage
You just need to add `bur.js` and `jquery.js` in your index.html file's head section
```html
...
<head>
    ...
    <script type="text/javascript" src="/<path-to-jslibs>/bur.js"></script>
    <script type="text/javascript" src="/<path-to-jslibs>/jquery.js"></script>
    ...
</head>
...
```
##Examples
__Creating a Component Class__
```javascript
var MyComponent = bur.Class({
    extends: bur.Component,
    _construct: function() {
        MyComponent._super(this, '<input type="text" />');
        
        this.addClass('custom-input');
    }
});

MyComponent.prototype.bindEvents = function() {
    this.on('change', $.proxy(function() {
        console.info('value changed to' + this.val());
    }, this));
};

// create an instace
var myComponent = new MyComponent();
// append component to page's dom
myComponent.appendTo('body');
```
__Rendering Views__

_my-template.ejs_:
```ejs
<p>
    Hello, <%= name %>
</p>
```
_MyComponent.js_:
```javascript
var MyComponent = bur.Class({
    extends: bur.Component,
    _construct: function() {
        MyComponent._super(this, '<input type="text" />');
        
        bur.Http.get('templates/my-template.ejs').success($.proxy(function(template) {
            var view = bur.View.make('templates/my-template.ejs').render({
                name: 'World'
            });
            
            this.html(view);
        }, this));
    }
});
```
