var BrowseNodeBase = require('./BrowseNode'),
    $ = require('jquery'),
    TableView = require('./Table');

var BrowseNodeMacro = BrowseNodeBase.extend({

    initialize(opts){
        BrowseNodeBase.prototype.initialize.call(this, opts);
        this.macro = opts.macro;
        this.inlets = this.macro.inlets.map(inlet => typeof inlet === 'string' ? inlet : inlet.name);
        this.loaded = false;
        this.error = null;
        this.rows = null;

        this.update();
    },

    /*    events: Object.assign({

    }, BrowseNodeBase.prototype.events),*/


    addColumn(field){
        this.selectFields.push(field);
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
            if(resp.rows instanceof Array){
                self.value = resp.rows.map(r => r.id);
            } else {
                self.value = null;
            }
            self.trigger('value-updated', self.value);
        });
    },

    getQuery(){
        let query = this.macro.query;

        if(query.includes('{inlets}')){
            const inletsWhere = [];
            for(let field in this.edges){
                let inlet = this.macro.inlets.find(i => i===field || i.name === field);
                if(typeof inlet === 'string'){
                    inlet = {name: inlet, field};
                }
                let value = this.edges[field].getValue();
                if(value instanceof Array){
                    inletsWhere.push(`${inlet.field} IN ('${value.join('\',\'')}')`);
                }else if(inlet.like){
                    inletsWhere.push(`${inlet.field} LIKE '%${value}%'`);
                }else{
                    inletsWhere.push(`${inlet.field} = '${value}'`);
                }
            }
            if(inletsWhere.length === 0){
                inletsWhere.push('1');
            }
            query = query.replace('{inlets}', inletsWhere.join(' AND '));
        }

        return query;
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
            </div>
            <div class="browse-node__title">${this.macro.name}</div>
            <div class="browse-node__body"></div>
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
    }
});

module.exports = BrowseNodeMacro;