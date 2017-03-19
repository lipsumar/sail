var Backbone = require('backbone'),
    $ = require('jquery');

var WIDTH = 220;

var TableContextMenu = Backbone.View.extend({
    className: 'table-context-menu',

    initialize: function(){
        $(document.body).on('click', this.hide.bind(this));
        $(document).bind('keydown', 'esc', this.hide.bind(this));
    },

    events: {
        'click': 'stopEvent',
        'keyup input': 'updateSearch',
        'click .table-context-menu__table': 'tableClicked',
        'click .table-context-menu__primary-key': 'primaryKeyClicked',
        'click .table-context-menu__field': 'fieldClicked'
    },

    tableClicked: function(e){
        var table = $(e.currentTarget).attr('title');
        this.selectTable(table);
    },

    selectTable: function(table){
        this.selectedTable = table;
        this.showFields(table);
    },

    fieldClicked: function(e){
        var field = $(e.currentTarget).attr('title');
        this.selectField(field);
    },

    selectField: function(field){
        this.trigger('field-select', {
            table: this.selectedTable,
            field: field,
            value: this.value
        });
        this.hide();
    },

    primaryKeyClicked: function(e){
        e.stopPropagation();
        var table = $(e.currentTarget).parent().attr('title'),
            field = $(e.currentTarget).attr('title');

        this.trigger('field-select', {
            table: table,
            field: field,
            value: this.value
        });
        this.hide();
    },

    stopEvent: function(e){
        e.stopPropagation();
    },

    setTables: function(tables){
        this.tables = tables;
        var html = Object.keys(this.tables).map(function(tableName){
            return '<div class="table-context-menu__table" title="'+tableName+'">'+ tableName
            + '<span class="table-context-menu__primary-key" title="'+tables[tableName].__PRI+'"></span></div>';
        }).join('');
        this.$('.table-context-menu__tables .table-context-menu__scroll').html(html);
        return this;
    },

    showFields: function(table){
        this.showingFields = true;
        this.$input.val('').focus();
        this.$('.table-context-menu__tables').hide();
        this.$('.table-context-menu__fields').show();
        this.$('.table-context-menu__selected-table').text(table+'.').show();
        var fields = this.tables[table].__fields;
        var html = fields.map(function(f){
            return '<div class="table-context-menu__field" title="'+f+'">'+f+'</div>';
        }).join('');
        this.$('.table-context-menu__fields .table-context-menu__scroll').html(html);
    },

    updateSearch: function(){
        var q = this.$input.val();
        var itemClass = '.table-context-menu__table';
        if(this.showingFields){
            itemClass = '.table-context-menu__field';
        }
        this.searchIsOne = false;
        var showed = 0; var t;
        this.$(itemClass).each(function(){
            var $el = $(this);
            var text = $el.text();
            if(text.includes(q)){
                $el.show();
                showed++;
                t = text;
            }else{
                $el.hide();
            }
        });
        if(showed===1){
            this.searchIsOne = t;
        }
    },

    selectIfOne: function(){
        if(this.searchIsOne){
            if(!this.showingFields){
                this.selectTable(this.searchIsOne);
            }else{
                this.selectField(this.searchIsOne);
            }
        }
    },

    setPosition: function(x, y){
        var bodyHeight = $(document.body).height();
        var bodyWidth = $(document.body).width();

        var height = bodyHeight - y - 10;
        while(height < 120){
            y-= 10;
            height = bodyHeight - y - 10;
        }

        var right = x + WIDTH - 10;
        while(right > bodyWidth){
            x-= 10;
            right = x + WIDTH - 10;
        }

        this.$el.css({
            left: x,
            top: y,
            height: height
        });

        return this;
    },

    setValue: function(value){
        this.value = value;
        this.render();
        return this;
    },

    show: function(){
        this.$el.show();
        this.$input.focus();
    },
    hide: function(){
        this.$el.hide();
        this.$input.val('');
        this.$('.table-context-menu__tables').show();
        this.$('.table-context-menu__fields').hide();
        this.$('.table-context-menu__selected-table').hide();
        this.$('.table-context-menu__table').show();
    },

    render: function(){
        if(!this.rendered){
            var html = `
            <div class="table-context-menu__search">
                <input type="search" />
            </div>
            <div class="table-context-menu__tables">
                <div class="table-context-menu__scroll"></div>
            </div>
            <div class="table-context-menu__selected-table" style="display:none"></div>
            <div class="table-context-menu__fields" style="display:none">
                <div class="table-context-menu__scroll"></div>
            </div>
            `;
            this.$el.html(html);
            this.$input = this.$('input');
            this.$input.bind('keydown', 'esc', this.hide.bind(this)); //explicitely bind esc to search field, otherwise it's ignored
            this.$input.bind('keydown', 'return', this.selectIfOne.bind(this));
            this.rendered = true;
        }

        return this;
    }
});

module.exports = TableContextMenu;
