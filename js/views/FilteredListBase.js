var Backbone = require('backbone'),
    $ = require('jquery');

var FilteredListBase = Backbone.View.extend({
    initialize: function(){
        this.keyboardFocusIndex = null;
    },

    events: {
        'keydown input': 'inputKeydown',
        'click .list-item': 'itemClicked',
        'mouseover .list-item': 'resetKeyboardIndex'
    },

    itemClicked: function(e){
        var item = $(e.currentTarget).attr('title');
        this.selectItem(item);
    },

    inputKeydown: function(e){
        if(e.which === 40 || e.which === 38) return; // up down
        if((e.which === 91 || e.which === 93) && e.metaKey) return; // only pressing metaKey
        if(e.which === 13){ // return
            this.returnKey(e);
            return;
        }

        // onkeydown, give input time to change value
        setTimeout(this.updateSearch.bind(this), 0);
    },

    resetKeyboardIndex: function(){
        this.keyboardFocusIndex = null;
        this.focusIndex(null);
    },

    updateSearch: function(){
        var q = this.$input.val();
        var shown = 0; var t;
        this.resetKeyboardIndex();
        this.$('.list-item').each(function(){
            var $el = $(this);
            var text = $el.text();
            if(text.includes(q)){
                $el.show().attr('data-index', shown);
                shown++;
                t = text;
            }else{
                $el.hide().attr('data-index', null);
            }
        });
        if(shown===1){
            this.searchIsOne = t;
        }
    },

    focusSearch: function(){
        this.$input.focus();
    },

    returnKey: function(e){
        var item;
        if(this.searchIsOne){
            item = this.searchIsOne;
        }else if(this.keyboardFocusIndex !== null){
            item = this.getKeyboardFocusedTable();
        }

        if(item){
            this.selectItem(item, e.metaKey);
        }
    },

    getKeyboardFocusedTable: function(){
        return this.$('.list-item[data-index="'+this.keyboardFocusIndex+'"]').attr('title');
    },


    moveUp: function(){
        if(this.keyboardFocusIndex === null){
            this.keyboardFocusIndex = this.listLength-1;
        }else{
            this.keyboardFocusIndex--;
            if(this.keyboardFocusIndex < 0){
                this.keyboardFocusIndex = this.listLength-1;
            }
        }
        this.focusIndex(this.keyboardFocusIndex);
    },
    moveDown: function(){
        console.log('down', this.keyboardFocusIndex );
        if(this.keyboardFocusIndex === null){
            this.keyboardFocusIndex = 0;
        }else{
            this.keyboardFocusIndex++;
            if(this.keyboardFocusIndex > this.listLength-1){
                this.keyboardFocusIndex = 0;
            }
        }
        this.focusIndex(this.keyboardFocusIndex);
    },

    focusIndex: function(index){
        this.$('.list-item').removeClass('focus');
        if(index !== null){
            $(this.$('.list-item[data-index="'+index+'"]')).addClass('focus');
        }
    },

    afterRender: function(){
        this.$input = this.$('input');
        //this.$input.bind('keydown', 'return', this.returnKey.bind(this));
        this.$input.bind('keydown', 'down', this.moveDown.bind(this));
        this.$input.bind('keydown', 'up', this.moveUp.bind(this));
    }

});

module.exports = FilteredListBase;
