var BrowseNodeBase = require('./BrowseNode'),
    BrowseEdge = require('./BrowseEdge');

var BrowseNodeInput = BrowseNodeBase.extend({
    initialize(opts){
        BrowseNodeBase.prototype.initialize.call(this, opts);
        this.$el.addClass('browse-node--input');
        this.on('start-drag', this.onDragStart.bind(this));
        this.on('end-drag', this.onDragEnd.bind(this));
    },

    events: Object.assign({
        'keyup input': 'onInputKeyUp'
    }, BrowseNodeBase.prototype.events),

    onInputKeyUp(e){
        if(e.keyCode===13){
            this.value = e.currentTarget.value;
            this.trigger('value-updated', this.value);
        }
    },

    focus(){
        this.$('input').focus();
    },

    onDragStart(){
        this.$el.find('input').prop('disabled', true);
    },
    onDragEnd(){
        this.$el.find('input').prop('disabled', false);
    },

    render: function(){
        this.setPosition(this.position.x, this.position.y);

        var html = `
        <div class="browse-node__inner">
          <div class="browse-node__top">
            <div class="browse-node-handle">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <input />
          </div>

          <div class="browse-node__bottom">
            <div class="browse-node-outlet"></div>
          </div>
        </div>`;
        this.$el.html(html);

        return this;
    }
});

module.exports = BrowseNodeInput;