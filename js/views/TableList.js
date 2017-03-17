var Backbone = require('backbone'),
    $ = require('jquery');


var TableList = Backbone.View.extend({
    className: 'table-list',
    initialize: function(boardId, opts){
        this.loadTables();
    },

    events: {
        'keyup input': 'updateSearch',
        'click .table-list__table': 'tableClicked'
    },

    tableClicked: function(e){
        var table = $(e.currentTarget).attr('title');
        this.trigger('table-selected', table);
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

    loadTables: function(){
        var self = this;
        $.getJSON('php/index.php?cmd=tables').then(function(resp){
            self.tables = resp.tables;
            self.addTables();
            self.updateSearch();
        });
    },

    addTables: function(){
        var html = Object.keys(this.tables).map(function(tableName){
            return '<div class="table-list__table" title="'+tableName+'">'+tableName+'</div>';
        }).join('');
        this.$('.table-list__scroll').html(html);
        this.$('.table-list__tables').addClass('table-list__tables--loaded');
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







