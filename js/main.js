var $ = require('jquery');
var App = require('./views/App');
var Backbone = require('backbone');
require('./jquery-plugins/auto-resize-input');

window.ace.require("ace/ext/language_tools");

Backbone.emulateHTTP = true;

window.app = new App({
    el: $('#app')
}).render();

// start history _after_ app.render
Backbone.history.start({
    pushState: false // more democratic, don't need htaccess setup
});
