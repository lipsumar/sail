var Backbone = require('backbone'),
    TableView = require('./Table.js');

var QueryBox = Backbone.View.extend({
    className: 'card result-card',
    initialize: function(opts){
        this.query = opts.query;
        this.rows = opts.rows;
        this.countTotal = opts.countTotal;
        this.error = opts.error;
    },

    render: function(){
        var html = `
        <div class="result-card__count">${this.countTotal}</div>
        <div class="result-card__query">${this.query}</div>
        <div class="result-card__table"></div>
        `;
        this.$el.html(html);
        var table = new TableView({
            rows: this.rows,
            fields: this.rows[0] ? Object.keys(this.rows[0]) : []
        });
        this.$('.result-card__table').append(table.render().el);
        return this;
    }
});


module.exports = QueryBox;
