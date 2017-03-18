var Backbone = require('backbone'),
    TableList = require('./TableList'),
    QueryBox = require('./QueryBox'),
    QueryBuilder = require('../models/QueryBuilder'),
    ResultCard = require('./ResultCard'),
    $ = require('jquery');

require('jquery.hotkeys');


var Console = Backbone.View.extend({
    className: 'console',
    initialize: function(boardId, opts){
        this.tableList = new TableList();
        this.queryBox = new QueryBox();
        var queryBuilder = new QueryBuilder();

        this.loadTables();



        this.tableList.on('table-select', function(table){
            queryBuilder.reset();
            queryBuilder.addTable(table);
            var query = queryBuilder.buildSelect();
            this.queryBox.setQuery(query);
            this.executeQuery(query);
        }.bind(this));

        this.tableList.on('table-add', function(table){
            queryBuilder.addTable(table);
            var query = queryBuilder.buildSelect();
            this.queryBox.setQuery(query);
        }.bind(this));

        this.on('query-select', function(query){
            queryBuilder.reset();
            this.queryBox.setQuery(query);
            this.queryBox.focus();
        }.bind(this));

        this.queryBox.on('execute-query', function(query){
            queryBuilder.reset();
            this.executeQuery(query);
        }.bind(this));

        this.queryBox.on('focus-search', this.tableList.focusSearch.bind(this.tableList));

        $(document).bind('keydown', 'meta+p', function(e){
            e.preventDefault();
            this.tableList.focusSearch();
        }.bind(this));

    },

    loadTables: function(){
        var self = this;
        $.getJSON('php/index.php?cmd=tables').then(function(resp){
            self.tables = resp.tables;
            self.tableList.setTables(self.tables);
            self.queryBox.setTables(self.tables);
        });
    },

    executeQuery: function(query){
        var card = this.addCard(query);
        $.ajax({
            url: 'php/index.php?cmd=query',
            method: 'post',
            data:{
                query: query
            },
            dataType: 'json'
        }).then(card.setResult.bind(card), card.setServerError.bind(card));
    },

    addCard: function(query){
        var card = new ResultCard({
            query: query
        });
        card.on('query-select', this.trigger.bind(this, 'query-select'));
        this.$('.console__cards').prepend(card.render().el);
        return card;
    },

    render: function(){
        var html = `
        <div class="console__tables"></div>
        <div class="console__main">
            <div class="console__query"></div>
            <div class="console__cards"></div>
        </div>
        `;
        this.$el.html(html);
        this.$('.console__tables').append(this.tableList.render().el);
        this.$('.console__query').append(this.queryBox.render().el);

        return this;
    }
});

module.exports = Console;
