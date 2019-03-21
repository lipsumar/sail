var Backbone = require('backbone'),
    $ = require('jquery'),
    TableContextMenu = require('../TableContextMenu'),
    BrowseNodeTable = require('./BrowseNodeTable'),
    BrowseNodeInput = require('./BrowseNodeInput'),
    BrowseEdge = require('./BrowseEdge'),
    MouseNode = require('./BrowserMouseNode'),
    BrowseNodeMacro = require('./BrowseNodeMacro');

var Browse = Backbone.View.extend({
    className: 'browse',

    initialize: function(){
        this.loaded = false;
        this.fetch();
        this.contextMenu = new TableContextMenu();
        this.contextMenu.on('table-select', this.tableSelected.bind(this));
        this.mouseNode = new MouseNode();
        this.currentEdge = null;
        $(document).bind('keydown', 'esc', this.onEsc.bind(this));
    },

    events: {
        'contextmenu .browse-canvas': 'canvasContextMenu',
        'dblclick .browse-canvas': 'canvasDblClick'
    },

    onEsc(){
        if(this.currentEdge){
            this.currentEdge.remove();
            this.currentEdge = null;
        }
    },

    canvasContextMenu(e){
        e.preventDefault();
        this.contextMenu
            .setPosition(e.clientX, e.clientY)
            .show();
    },

    canvasDblClick(e){
        e.preventDefault();
        this.addMacroNode({
            name: 'the macro',
            inlets: [
                {
                    name: 'product_id',
                    field: 'translatable_id'
                },
                'company_id',
                'locale'
            ],
            query: 'select pt.name, pt.locale from product_translation pt join product p on p.id=pt.translatable_id WHERE {inlets}'
        }, {
            x: e.clientX - 110,
            y: e.clientY
        });
    },

    tableSelected(e){
        this.contextMenu.hide();
        this.addTableNode(e.table);
    },

    addTableNode(table){
        var pos = this.contextMenu.getPosition();
        var node = new BrowseNodeTable({
            tableName: table,
            table: this.tables[table],
            tables: this.tables,
            position: {
                x: pos.x - 110,
                y: pos.y
            },
            contextMenu: this.contextMenu
        });
        this.addNode(node);
    },

    addMacroNode(macro, position){
        var node = new BrowseNodeMacro({
            macro,
            position
        });
        this.addNode(node);
    },

    addNode(node){
        node.on('inlet-clicked', (e) => {
            if(this.currentEdge){
                this.setEdgeToInlet(node, e.field);
            }else{
                this.addInputNode(node, e.field);
            }
        });
        node.on('outlet-clicked', ({node, alias}) => {
            this.addEdgeFromOutlet(node, alias);
        });
        node.on('remove', () => {
            node.off('outlet-clicked');
            node.off('inlet-clicked');
            node.$el.remove();
        });
        this.$('.browse__nodes').append(node.render().el);
    },

    addEdgeFromOutlet(node, alias){
        var edge = new BrowseEdge({fromNode: node, fromNodeAlias: alias, toNode: this.mouseNode});
        edge.on('clicked', this.edgeClicked.bind(this));
        this.$('.browse__nodes').append(edge.render().el);
        this.currentEdge = edge;
    },

    setEdgeToInlet(node, field){
        node.addEdge(this.currentEdge, field);
        this.currentEdge.setToNode(node, field);
        this.currentEdge = null;
    },

    addInputNode(toNode, field){
        var pos = toNode.getPosition();
        var node = new BrowseNodeInput({
            position: {
                x: pos.x,
                y: pos.y - 60
            }
        });
        this.$('.browse__nodes').append(node.render().el);
        node.on('outlet-clicked', ({node, alias}) => {
            this.addEdgeFromOutlet(node, alias);
        });

        var edge = new BrowseEdge({fromNode: node, fromNodeAlias:'_main', toNode, toNodeInlet: field});
        edge.on('clicked', this.edgeClicked.bind(this));
        this.$('.browse__nodes').append(edge.render().el);

        toNode.addEdge(edge, field);

        node.focus();
    },

    edgeClicked(edge){
        if(this.currentEdge){
            return;
        }
        edge.remove();
    },

    fetch: function(){
        var self = this;
        $.getJSON('php/index.php?cmd=tables').then(function(resp){
            self.tables = resp.tables;
            self.contextMenu.setTables(resp.tables);
            self.loaded = true;
            self.render();
        });
    },

    render: function(){
        var html = '';
        if(this.loaded){
            html+=`<div class="browse-canvas">
                <div class="browse__nodes"></div>
            </div>`;
        }else{
            html+='<br><div class="loader" style="margin:100px auto"></div>';
        }
        this.$el.html(html);
        $(document.body).append(this.contextMenu.render().el);

        return this;
    }
});


module.exports = Browse;
