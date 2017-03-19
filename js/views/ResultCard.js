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
        'click .result-card__query': 'queryClicked',
        'click .result-card__close': 'remove'
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
        var html = '<div class="result-card__close">×</div>';
        if(this.loaded){

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
                /*window.jQuery('td').qtip({
                    content: ,
                    position:{
                        //my: 'left center',
                        //at: 'right center',
                        //target: 'event',
                        target: 'mouse',
                        adjust:{mouse: false},
                        //container: this.$('.result-card__table')
                    },
                    show: 'mousedown',
                    events: {
                        show: function(event){
                            if(event.originalEvent.button !== 2) {
                                event.preventDefault();
                            }
                        }
                    }
                }).bind('contextmenu', function(){return false;});*/
            }else{
                this.$('.result-card__table').replaceWith('<div class="result-card__error">'+this.error+'</div>');
            }

        }else{
            html+='<div class="result-card__loader-spacer"></div><div class="loader"></div><div class="result-card__loader-spacer"></div>';
            this.$el.html(html);
        }


        return this;
    }
});


module.exports = QueryBox;
