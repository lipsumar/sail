var Backbone = require('backbone');


var Router = Backbone.Router.extend({
    routes: {
        '': 'index',
        'console': 'console',
        'board/:id(?querystring)': 'board',
        'boards': 'boards',
        'edit/board/:id': 'editBoard',
        'browse': 'browse'
    }
});

module.exports = Router;
