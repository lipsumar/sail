var BrowseNodeBase = require('./BrowseNode'),
    $ = require('jquery'),
    JoinTable = require('./JoinTable'),
    TableContextMenu = require('../TableContextMenu'),
    TableJoinModel = require('./TableJoinModel');

var BrowseNodeTable = BrowseNodeBase.extend({

    initialize(opts){
        BrowseNodeBase.prototype.initialize.call(this, opts);
        this.tableName = opts.tableName;
        this.table = opts.table;
        this.tables = opts.tables;
        this.loaded = false;
        this.error = null;
        this.rows = null;

        this.tableJoinModel = new TableJoinModel({allTables: this.tables});
        this.tableJoinModel.setTable(this.tableName);
        if(this.table.__fields.includes('id')){
            this.inlets.push('id');
        }
        if(this.table.__fields.includes('name')){
            this.inlets.push('name');
        }
        this.selectFields = this.tableJoinModel.getDefaultSelectFields(this.tableName);
        this.contextMenu = opts.contextMenu;
        this.contextMenu.on('field-select', e => {
            if(this.contextMenuHandler){
                this.contextMenuHandler(e);
                this.contextMenuHandler = null;
            }
        });
        this.contextMenu.on('hidden', () => {
            if(this.contextMenuOpen){
                this.contextMenuOpen = false;
            }
        });
        this.joinTable = new JoinTable({
            tables: window.Sail_tables
        });
        this.update();
    },

    events: Object.assign({
        'click .browse-node-inlet-add': 'inletAddClicked',
        'click .browse-node-table-add-column': 'addColumnClicked',
        'click .join-table__add-join': 'addJoinClicked'
    }, BrowseNodeBase.prototype.events),



    addColumn(field){
        this.selectFields.push(field);
        this.tableJoinModel.addField(this.tableName, field);
        this.fetch().then(this.render.bind(this));
    },

    fetch(){
        const self = this;
        return $.ajax({
            url: 'php/index.php?cmd=query',
            method: 'post',
            dataType: 'json',
            data: {
                query: this.getQuery()
            }
        }).then(function(resp){
            self.loaded = true;
            self.error = resp.error;
            self.rows = resp.rows;
            self.trigger('value-updated');
        });
    },

    getQuery(){
        let query = this.tableJoinModel.getQuery();

        const where = [];
        for(let field in this.edges){
            let value = this.edges[field].getValue();
            if(value instanceof Array){
                where.push(`_t.${field} IN ('${value.join('\',\'')}')`);
            }else if(this.table[field].Type.includes('varchar')){
                where.push(`_t.${field} LIKE '%${value}%'`);
            }else{
                where.push(`_t.${field} = '${value}'`);
            }
        }

        if(where.length>0){
            query += ' WHERE '+where.join(' AND ');
        }

        return query;
    },

    getValue(alias){
        return this.rows.map(r => r[alias]);
    },

    inletAddClicked(e){
        e.preventDefault();
        e.stopPropagation();
        this.contextMenuHandler = e => {
            this.addInlet(e.field);
            this.contextMenuOpen = false;
        };
        this.contextMenu
            .setPosition(e.clientX, e.clientY)
            .showFields(this.tableName)
            .show();
        this.contextMenuOpen = true;

    },

    addColumnClicked(e){
        e.preventDefault();
        e.stopPropagation();
        this.contextMenuHandler = e => {
            this.addColumn(e.field);
            this.contextMenuOpen = false;
        };
        this.contextMenu
            .setPosition(e.clientX, e.clientY)
            .showFields(this.tableName)
            .show();
        this.contextMenuOpen = true;

    },

    addJoinClicked(e){
        e.preventDefault();
        e.stopPropagation();
        this.contextMenuHandler = e => {
            this.setupJoinTableSelection(e.field);
        };
        this.contextMenu
            .setPosition(e.clientX, e.clientY)
            .showFields(this.tableName)
            .show();
        this.contextMenuOpen = true;

    },

    setupJoinTableSelection(field){
        const tableMenu = new TableContextMenu({
            displayRelative: true
        });

        this.$('td.join-table__add-join').append(tableMenu.render().el);
        tableMenu.setTables(this.tables);
        tableMenu.show();
        tableMenu.on('field-select', e => {
            tableMenu.$el.remove();
            this.tableJoinModel.addTable(field, e.table, e.field);
            this.update();
        });
    },

    update(){
        this.fetch().then(this.render.bind(this));
    },

    render: function(){
        this.setPosition(this.position.x, this.position.y);

        var inletsHtml = this.inlets.map(field => `<div class="browse-node-inlet" data-field="${field}">
            <div class="browse-node-inlet__target"></div>
            <div class="browse-node-inlet__name">${field}</div>
          </div>`).join('');
        var outletsHtml = this.tableJoinModel.getAllFields().map(field => `
            <div class="browse-node-outlet"
                data-alias="${field.alias}"
            ></div>
        `).join('');

        var html = `
        <div class="browse-node__inner">
          <div class="browse-node__close"></div>
          <div class="browse-node__top">
            <div class="browse-node-handle">
              <div></div>
              <div></div>
              <div></div>
            </div>
            ${inletsHtml || '<div class="browse-node-inlet-none"></div>'}
            <div class="browse-node-inlet-add">
              <svg width="8" height="8" >
                <line x1="4" y1="0" x2="4" y2="8"/>
                <line x1="0" y1="4" x2="8" y2="4"/>
              </svg>
            </div>
          </div>

          <div class="browse-node__body"></div>
          <div class="browse-node__bottom">
            ${outletsHtml}
          </div>
        </div>
        `;
        this.$el.html(html);

        this.renderBody();

        return this;
    },

    renderBody(){
        const body = this.$('.browse-node__body');
        body.empty();

        if(!this.loaded){
            body.html(`<div class="loader"></div>`);
            return;
        }

        if(this.error){
            body.html(`<div class="error">Error: ${this.error}</div>`);
            return;
        }

        this.joinTable.setModel(this.tableJoinModel);
        this.joinTable.setRows(this.rows);
        this.$('.browse-node__body').empty().append(this.joinTable.render().el);
        this.$('.browse-node__body').append('<div class="browse-node-table-add-column">+</div>');

        // re-align outlets
        if(this.rows && this.rows.length>0){
            this.tableJoinModel.getAllFields().forEach(field => {
                this.$(`.browse-node-outlet[data-alias="${field.alias}"]`).css({
                    left: this.joinTable.getColumnX(field.alias)+'px'
                });
            });
        }

    }
});

module.exports = BrowseNodeTable;