var Backbone = require('backbone'),
    TableView = require('./Table.js'),
    $ = require('jquery');

var Card = Backbone.View.extend({
    className: 'card',
    initialize: function(opts){
        this.board = opts.board;
        this.title = opts.title;


        this.updateQuery(opts.query);
        this.tryFetch();

        this.board.on('varsChanged', this.tryFetch.bind(this));
    },

    events:{
        'click .edit-query': 'toggleEditQuery'
    },

    toggleEditQuery: function(){
        this.$('.card__query').toggleClass('card__query--open');
    },

    updateQuery: function(q){
        this.query = q;
        this.vars = this.extractVars(this.query);
    },

    getUserQuery: function(){
        return this.editor ? this.editor.getValue() : this.query;
    },

    tryFetch: function(){
        this.updateQuery(this.getUserQuery());
        if(this.canFetch()){
            this.fetch().then(this.render.bind(this));
        }
    },

    canFetch: function(){
        if(this.vars.length === 0) return true;
        var can = true,
            self = this;
        this.vars.forEach(function(key){
            if(!self.board.vars[key]){
                can = false;
            }
        });
        return can;
    },

    extractVars: function(str){
        var regex = /\$([a-zA-Z0-0_-]+)/gm,
            m, vars = [];
        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            vars.push(m[1]);
        }
        return vars;
    },

    fetch: function(){
        var self = this;
        return $.ajax({
            url: 'php/index.php?cmd=query',
            method: 'post',
            dataType: 'json',
            data: {
                query: this.replaceVars(this.query)
            }
        }).then(function(resp){
            self.loaded = true;
            self.error = resp.error;
            self.rows = resp.rows;
        });
    },

    replaceVars: function(q){
        var board = this.board;
        this.vars.forEach(function(key){
            q = q.split('$'+key).join(board.vars[key]);
        });

        return q;
    },

    getBaseHtml: function(){
        var html = '<div class="card__tools"><button class="edit-query">📝</button></div>';
        html+='<h2>'+this.title+'</h2>';
        html+='<div class="card__query"><div class="textarea">'+this.query+'</div></div>';
        html+='<div class="card__body"><div class="loader"></div></div>';
        return html;
    },

    applyEditor: function(){
        this.editor = window.ace.edit(this.$('.textarea')[0]);
        this.editor.setOptions({
            maxLines: Infinity,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
        this.editor.renderer.setShowGutter(false);
        this.editor.getSession().setMode("ace/mode/mysql");

        // @TODO implement this correctly to add table name completion !
        /*var staticWordCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                var wordList = ["foo", "bar", "baz", "foofoo"];
                callback(null, wordList.map(function(word) {
                    return {
                        caption: word,
                        value: word,
                        meta: "omg"
                    };
                }));

            }
        };
        this.editor.completers.push(staticWordCompleter);*/
    },

    render: function(){

        var html = this.getBaseHtml();

        if(this.loaded){
            this.$el.html(html);
            if(this.error){
                this.$el.addClass('card--error').find('.card__body').html('Error: '+this.error);
                return;
            }

            var table = new TableView({
                rows: this.rows,
                fields: this.rows[0] ? Object.keys(this.rows[0]) : []
            });
            this.$('.card__body').empty().append(table.render().el);
        }else{

            this.$el.html(html);
        }

        this.applyEditor();


        return this;
    }
});


module.exports = Card;




