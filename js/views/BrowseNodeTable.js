var BrowseNodeBase = require('./BrowseNode'),
    $ = require('jquery'),
    TableView = require('./Table');

var BrowseNodeTable = BrowseNodeBase.extend({

    initialize(opts){
        BrowseNodeBase.prototype.initialize.call(this, opts);
        this.tableName = opts.tableName;
        this.table = opts.table;
        console.log(this.table);
        this.loaded = false;
        this.error = null;
        this.rows = null;
        this.edges = [];
        this.inlets = [];
        this.selectFields = ['id'];
        if(this.table.__fields.includes('name')){
            this.inlets.push('name');
            this.selectFields.push('name');
        }
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
        this.update();
    },

    events: Object.assign({
        'click .browse-node-inlet__target': 'inletClicked',
        'click .browse-node-inlet-add': 'inletAddClicked',
        'click .browse-node-table-add-column': 'addColumnClicked'
    }, BrowseNodeBase.prototype.events),

    addEdge(edge, field){
        this.edges[field] = edge;
        edge.on('value-updated', this.update.bind(this));
        this.update();
    },

    addInlet(field){
        this.inlets.push(field);
        this.render();
    },

    addColumn(field){
        this.selectFields.push(field);
        this.fetch().then(this.render.bind(this));
    },

    removeEdge(field){
        this.edges[field].off('value-updated');
        delete this.edges[field];

        this.update();
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
            self.value = resp.rows.map(r => r.id);
            self.trigger('value-updated', self.value);
        });
    },

    getQuery(){
        let query = `SELECT ${this.selectFields.join(', ')} from ${this.tableName}`;

        const where = [];
        for(let field in this.edges){
            let value = this.edges[field].getValue();
            if(value instanceof Array){
                where.push(`${field} IN ('${value.join('\',\'')}')`);
            }else if(this.table[field].Type.includes('varchar')){
                where.push(`${field} LIKE '%${value}%'`);
            }else{
                where.push(`${field} = '${value}'`);
            }

        }

        if(where.length>0){
            query += ' WHERE '+where.join(' AND ');
        }

        return query;
    },

    inletClicked(e){
        e.preventDefault();
        this.trigger('inlet-clicked', {
            field: e.currentTarget.parentNode.getAttribute('data-field'),
            node: this
        });
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

    getInletPosition(field){
        const $el = this.$el.find('.browse-node-inlet[data-field="'+field+'"]');
        var pos = this.getPosition();
        var elPos = $el.position();
        var elWidth = parseInt($el.outerWidth(), 10);
        return {
            x: pos.x + elPos.left + elWidth/2 + 10,
            y: pos.y + elPos.top
        };
    },

    update(){
        console.log('update()');
        this.fetch().then(this.render.bind(this));
    },

    render: function(){
        this.setPosition(this.position.x, this.position.y);

        var inletsHtml = this.inlets.map(field => `<div class="browse-node-inlet" data-field="${field}">
            <div class="browse-node-inlet__target"></div>
            <div class="browse-node-inlet__name">${field}</div>
          </div>`).join('');

        var html = `
          <div class="browse-node__top">
            <div class="browse-node-handle">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div class="browse-node-inlet" data-field="id">
              <div class="browse-node-inlet__target"></div>
              <div class="browse-node-inlet__name">id</div>
            </div>
            ${inletsHtml}
            <div class="browse-node-inlet-add">
              <svg width="8" height="8" >
                <line x1="4" y1="0" x2="4" y2="8"/>
                <line x1="0" y1="4" x2="8" y2="4"/>
              </svg>
            </div>
          </div>
          <div class="browse-node__title">${this.tableName}</div>
          <div class="browse-node__body"></div>
          <div class="browse-node__bottom">
            <div class="browse-node-outlet"></div>
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

        var fields = this.rows[0] ? Object.keys(this.rows[0]) : [];
        var table = new TableView({
            rows: this.rows,
            fields
        });
        this.$('.browse-node__body').empty().append(table.render().el);
        this.$('.browse-node__body').append('<div class="browse-node-table-add-column">+</div>');
    }
});

module.exports = BrowseNodeTable;