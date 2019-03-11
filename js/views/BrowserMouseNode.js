const Backbone = require('backbone'),
    $ = require('jquery');

var BrowserMouseNode = Backbone.View.extend({
    initialize(){
        $(document.body).on('mousemove', this.onMouseMove.bind(this));
    },

    onMouseMove(e){
        this.position = {
            x: e.clientX - 110,
            y: e.clientY
        };
        this.trigger('move', this.position);
    },

    getInletPosition(){
        return this.position;
    }
});

module.exports = BrowserMouseNode;