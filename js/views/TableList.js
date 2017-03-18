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
        var event = 'table-select';
        if(e.metaKey){// cmd
            event = 'table-add';
        }
        this.trigger(event, table);
    },

    updateSearch: function(){
        var q = this.$input.val();
        this.$('.table-list__table').each(function(){
            var $el = $(this);
            if($el.text().includes(q)){
                $el.show();
            }else{
                $el.hide();
            }
        });
    },

    focusSearch: function(){
        this.$input.focus();
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
        return this;
    }
});

module.exports = TableList;







