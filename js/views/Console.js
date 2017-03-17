var Backbone = require('backbone'),
    TableList = require('./TableList'),
    QueryBox = require('./QueryBox'),
    QueryBuilder = require('../models/QueryBuilder'),
    ResultCard = require('./ResultCard'),
    $ = require('jquery');


var Console = Backbone.View.extend({
    className: 'console',
    initialize: function(boardId, opts){
        this.tableList = new TableList();
        this.queryBox = new QueryBox();
        var queryBuilder = new QueryBuilder();

        this.tableList.on('table-selected', function(table){
            queryBuilder.reset();
            var query = queryBuilder.buildSelectFromTable(table);
            this.queryBox.setQuery(query);
            this.executeQuery(query);
        }.bind(this));
    },

    executeQuery: function(query){
        $.ajax({
            url: 'php/index.php?cmd=query',
            method: 'post',
            data:{
                query: query
            },
            dataType: 'json'
        }).then(function(resp){
            this.addCard(query, resp);
        }.bind(this));
    },

    addCard: function(query, result){
        var card = new ResultCard({
            query: query,
            countTotal: result.countTotal,
            rows: result.rows,
            error: result.error
        });
        this.$('.console__cards').append(card.render().el);
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
