var Backbone = require('backbone'),
    TableView = require('./Table.js'),
    formatNumber = require('format-number'),
    countFormatter = formatNumber({
        integerSeparator: '&nbsp;'
    });

var QueryBox = Backbone.View.extend({
    className: 'card result-card',
    initialize: function(opts){
        this.query = opts.query;

    },

    events:{
        'click .result-card__query': 'queryClicked'
    },

    queryClicked: function(){
        this.trigger('query-select', this.query);
    },

    setResult: function(result){
        this.loaded = true;
        this.rows = result.rows;
        this.countTotal = result.countTotal;
        this.error = result.error;
        this.render();
    },

    setServerError: function(){
        this.loaded = true;
        this.error = 'Server error';
        this.render();
    },

    render: function(){

        if(this.loaded){
            var html = '';
            if(!this.error){
                html+= `<div class="result-card__count"><span>${countFormatter(this.countTotal)}</span> rows</div>`;
            }
            html += `
            <div class="result-card__query">${this.query}</div>
            <div class="result-card__table"></div>
            `;
            this.$el.html(html);
            if(!this.error){
                var table = new TableView({
                    rows: this.rows,
                    fields: this.rows[0] ? Object.keys(this.rows[0]) : [],
                    noResultMessage: ''
                });
                this.$('.result-card__table').append(table.render().el);
            }else{
                this.$('.result-card__table').replaceWith('<div class="result-card__error">'+this.error+'</div>');
            }

        }else{
            this.$el.html('<div class="result-card__loader-spacer"></div><div class="loader"></div><div class="result-card__loader-spacer"></div>');
        }


        return this;
    }
});


module.exports = QueryBox;
