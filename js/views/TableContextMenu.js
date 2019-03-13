var FilteredListBase = require('./FilteredListBase'),
    $ = require('jquery');

var WIDTH = 220;

var TableContextMenu = FilteredListBase.extend({
    className: 'table-context-menu',

    initialize: function(opts = {}){
        FilteredListBase.prototype.initialize.call(this);
        $(document.body).on('click', this.hide.bind(this));
        $(document).bind('keydown', 'esc', this.hide.bind(this));
        this.displayRelative = opts.displayRelative || false;
    },

    events: Object.assign({
        'click': 'stopEvent',
        'click .table-context-menu__primary-key': 'primaryKeyClicked',
    }, FilteredListBase.prototype.events),



    selectItem: function(item){
        if(this.showingFields){
            this.trigger('field-select', {
                table: this.selectedTable,
                field: item,
                value: this.value
            });
            this.hide();
        }else{
            this.selectedTable = item;
            this.showFields(item);
            this.trigger('table-select', {
                table: this.selectedTable,
                value: this.value
            });
        }

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
        this.listLength = Object.keys(tables).length;
        var html = Object.keys(this.tables).map(function(tableName){
            return '<div class="table-context-menu__table list-item" title="'+tableName+'">'+ tableName
            + '<span class="table-context-menu__primary-key" title="'+tables[tableName].__PRI+'"></span></div>';
        }).join('');
        this.$('.table-context-menu__tables .table-context-menu__scroll').html(html);
        this.updateSearch();
        return this;
    },

    showFields: function(table){
        this.showingFields = true;
        this.$input.val('').focus();
        this.resetKeyboardIndex();
        this.$('.table-context-menu__tables').hide();
        this.$('.table-context-menu__fields').show();
        this.$('.table-context-menu__selected-table').text(table+'.').show();
        var fields = this.tables[table].__fields;
        var html = fields.map(function(f, i){
            return '<div class="table-context-menu__field list-item" title="'+f+'" data-index="'+i+'">'+f+'</div>';
        }).join('');
        this.$('.table-context-menu__fields .table-context-menu__scroll').html(html);
        return this;
    },

    getKeyboardFocusedTable: function(){
        var className = this.showingFields ? 'table-context-menu__field' : 'table-context-menu__table';
        return this.$('.'+className+'[data-index="'+this.keyboardFocusIndex+'"]').attr('title');
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

        this.position = {x:x, y:y};
        this.$el.css({
            left: x,
            top: y,
            height: height
        });

        return this;
    },

    getPosition: function(){
        return this.position;
    },

    setValue: function(value){
        this.value = value;
        this.render();
        return this;
    },

    show: function(){
        this.$el.show();
        this.focusSearch();
    },
    hide: function(){
        this.$el.hide();
        this.$input.val('');
        this.$('.table-context-menu__tables').show();
        this.$('.table-context-menu__fields').hide();
        this.$('.table-context-menu__selected-table').hide();
        this.$('.table-context-menu__table').show();
        this.showingFields = false;
        this.trigger('hidden');
    },

    render: function(){
        if(!this.rendered){
            if(this.displayRelative){
                this.$el.addClass('table-context-menu--display-relative');
            }
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
            FilteredListBase.prototype.afterRender.call(this);
            this.$input.bind('keydown', 'esc', this.hide.bind(this)); //explicitely bind esc to search field, otherwise it's ignored
            this.rendered = true;
        }

        return this;
    }
});

module.exports = TableContextMenu;
