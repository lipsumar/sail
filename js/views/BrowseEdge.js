var Backbone = require('backbone'),
    $ = require('jquery');

var BrowseEdge = Backbone.View.extend({
    className: 'browse-edge',
    initialize: function({fromNode, toNode, toNodeInlet}){
        this.fromNode = fromNode;


        this.fromNode.on('move', this.render.bind(this));
        this.fromNode.on('value-updated', (e) => {
            this.trigger('value-updated', e);
        });
        this.boundRender = this.render.bind(this);
        this.setToNode(toNode, toNodeInlet);

    },

    events: {
        'click .browse-edge__handle': 'onClick'
    },

    onClick(){
        this.trigger('clicked', this);
    },

    remove(){
        this.$el.remove();
        this.toNode.removeEdge(this.toNodeInlet);
    },

    getValue(){
        return this.fromNode.value;
    },

    setToNode(node, field){
        if(this.toNode){
            this.toNode.off('move', this.boundRender);
        }
        this.toNode = node;
        this.toNode.on('move', this.boundRender);
        this.toNodeInlet = field;
    },

    render(){
        var fromPos = this.fromNode.getOutletPosition();
        var toPos = this.toNode.getInletPosition(this.toNodeInlet);
        var mostLeft = fromPos.x < toPos.x ? fromPos : toPos;
        var mostTop = fromPos.y < toPos.y ? fromPos : toPos;


        var width = Math.abs(fromPos.x - toPos.x);
        var height = Math.abs(fromPos.y - toPos.y);

        var html = `
        <div class="browse-edge__inner">
          <svg width="${width}" height="${height}" class="browse-edge__line-svg">
            <line x1="${fromPos.x > toPos.x ? width : 0}" y1="${fromPos.y<toPos.y ? 0 : height}" x2="${fromPos.x > toPos.x ? 0 : width}" y2="${fromPos.y<toPos.y ? height : 0}" stroke="steelblue" stroke-width="2" />
          </svg>
          <svg width="10" height="10" class="browse-edge__handle-svg" style="top:${height/2-5}px;left:${width/2-5}px">
            <circle cx="5" cy="5" r="5" stroke="none" fill="steelblue" class="browse-edge__handle" />
          </svg>
        </div>`;


        this.$el.html(html);
        this.$el.css({
            left: mostLeft.x + 'px',
            top: mostTop.y + 'px'
        });
        return this;
    }
});

module.exports = BrowseEdge;