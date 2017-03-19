var Backbone = require('backbone'),
    $ = require('jquery');


var TableList = Backbone.View.extend({
    className: 'table-list',
    initialize: function(){

    },

    events: {
        'keyup input': 'updateSearch',
        'click .table-list__table': 'tableClicked'
    },

    tableClicked: function(e){
        var table = $(e.currentTarget).attr('title');
        if(e.metaKey){// cmd
            this.trigger('table-add', table);
        }else{
            this.selectTable(table);
        }
    },

    selectTable: function(table){
        this.trigger('table-select', table);
    },

    updateSearch: function(){
        var q = this.$input.val();
        var shown = 0; var t;
        this.$('.table-list__table').each(function(){
            var $el = $(this);
            var text = $el.text();
            if(text.includes(q)){
                $el.show();
                shown++;
                t = text;
            }else{
                $el.hide();
            }
        });
        if(shown===1){
            this.searchIsOne = t;
        }
    },

    focusSearch: function(){
        this.$input.focus();
    },

    selectIfOne: function(){
        if(this.searchIsOne){
            this.selectTable(this.searchIsOne);
        }
    },


    setTables: function(tables){
        this.tables = tables;
        var html = Object.keys(this.tables).map(function(tableName){
            return '<div class="table-list__table" title="'+tableName+'">'+tableName+'</div>';
        }).join('');
        this.$('.table-list__scroll').html(html);
        this.$('.table-list__tables').addClass('table-list__tables--loaded');
        this.updateSearch();
    },

    render: function(){
        var html = `
        <div class="table-list__search">
            <input type="search" />
        </div>
        <div class="table-list__tables">
            <div class="table-list__scroll"></div>
        </div>`;
        this.$el.html(html);
        this.$input = this.$('input');
        this.$input.bind('keydown', 'return', this.selectIfOne.bind(this));
        return this;
    }
});

module.exports = TableList;







