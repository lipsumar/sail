var Backbone = require('backbone');


var Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        'console': 'console',
        'board/:id(?querystring)': 'board',
        'edit/board/:id': 'editBoard'
    }
});

module.exports = Router;
