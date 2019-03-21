var Backbone = require('backbone'),
    $ = require('jquery');

var BrowseNode = Backbone.View.extend({
    className: 'browse-node',
    initialize: function(opts){
        this.position = opts.position;
        $(document.body).on('mousemove', this.onMouseMove.bind(this));
        this.edges = [];
        this.inlets = [];
    },

    events: {
        'mousedown .browse-node-handle': 'startDrag',
        'mouseup .browse-node-handle': 'endDrag',
        'click .browse-node-outlet': 'onOutletClicked',
        'click .browse-node-inlet__target': 'inletClicked',
        'click .browse-node__close': 'remove'
    },

    onOutletClicked(e){
        const alias = e.currentTarget.getAttribute('data-alias');
        this.trigger('outlet-clicked', {node: this, alias});
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

    inletClicked(e){
        e.preventDefault();
        this.trigger('inlet-clicked', {
            field: e.currentTarget.parentNode.getAttribute('data-field'),
            node: this
        });
    },


    getInletPosition(field){
        const $el = this.$el.find('.browse-node-inlet[data-field="'+field+'"]');
        var pos = this.getPosition();
        var elPos = $el.position();
        var elWidth = parseInt($el.outerWidth(), 10);
        return {
            x: pos.x + elPos.left + elWidth/2 + 9,
            y: pos.y + elPos.top
        };
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

    getOutletPosition(alias){
        const pos = this.$(`.browse-node-outlet[data-alias="${alias}"]`).position();
        const height = parseInt(this.$el.outerHeight(), 10);
        return {
            x: this.position.x + pos.left + 14,
            y: this.position.y + height
        };
    },

    addEdge(edge, field){
        this.edges[field] = edge;
        edge.on('value-updated', this.update.bind(this));
        this.update();
    },


    addInlet(field){
        this.inlets.push(field);
        this.render();
    },

    removeEdge(field){
        this.edges[field].off('value-updated');
        delete this.edges[field];
        this.update();
    },

    remove(){
        for(let field in this.edges){
            this.edges[field].remove();
        }
        this.trigger('remove');
    }

});


module.exports = BrowseNode;
