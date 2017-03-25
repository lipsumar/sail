var FilteredListBase = require('./FilteredListBase');


var TableList = FilteredListBase.extend({
    className: 'table-list',

    selectItem: function(table, meta){
        this.trigger(meta ? 'table-add' : 'table-select', table);
    },

    setTables: function(tables){
        this.tables = tables;
        this.listLength = Object.keys(tables).length;
        var html = Object.keys(this.tables).map(function(tableName){
            return '<div class="table-list__table list-item" title="'+tableName+'">'+tableName+'</div>';
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
        FilteredListBase.prototype.afterRender.call(this);
        return this;
    }
});

module.exports = TableList;







