var Backbone = require('backbone'),
    $ = require('jquery');

var BrowseNode = Backbone.View.extend({
    className: 'browse-node',
    initialize: function(opts){
        this.position = opts.position;
        $(document.body).on('mousemove', this.onMouseMove.bind(this));
    },

    events: {
        'mousedown .browse-node-handle': 'startDrag',
        'mouseup .browse-node-handle': 'endDrag',
        'click .browse-node-outlet': 'onOutletClicked'
    },

    onOutletClicked(){
        this.trigger('outlet-clicked', this);
    },

    startDrag(){
        this.dragging = true;
        this.trigger('start-drag');
    },

    endDrag(){
        this.dragging = false;
        this.trigger('end-drag');
    },

    onMouseMove(e){
        if(this.dragging){
            var xOffset=$('.browse-canvas')[0].scrollLeft;
            var yOffset=$('.browse-canvas')[0].scrollTop;

            this.setPosition(e.clientX + xOffset - 125, e.clientY + yOffset  -15);
        }
    },

    setPosition(x, y){
        this.position = {x, y};
        this.$el.css({
            left: x,
            top: y
        });
        this.trigger('move', this.position);
    },

    getPosition(){
        return this.position;
    },

    getOutletPosition(){
        const width = parseInt(this.$el.outerWidth(), 10);
        const height = parseInt(this.$el.outerHeight(), 10);
        return {
            x: this.position.x + width/2,
            y: this.position.y + height
        };
    }

});


module.exports = BrowseNode;
