var Backbone = require('backbone');

var QueryBox = Backbone.View.extend({
    className: 'query-box',
    initialize: function(){
        //window.app.on('QueryBox:setQuery', this.setQuery);
    },

    events: {
        'click .query-box__submit': 'triggerExecuteQuery'
    },

    focus: function(){
        this.editor.focus();
    },

    triggerExecuteQuery: function(){
        this.trigger('execute-query', this.editor.getValue());
    },

    setQuery: function(query){
        this.editor.setValue(query, 1);
    },

    setTables: function(tables){
        this.tables = tables;
        if(this.editor){
            this.addTableCompleter();
        }
    },

    addTableCompleter: function(){
        var wordList = Object.keys(this.tables).map(function(word) {
            return {
                caption: word,
                value: word,
                meta: "table"
            };
        });
        var staticWordCompleter = {
            getCompletions: function(editor, session, pos, prefix, callback) {
                callback(null, wordList);
            }
        };
        this.editor.completers.push(staticWordCompleter);
    },

    render: function(){
        if(!this.rendered){
            this.$el.html('<div class="textarea"></div><button class="query-box__submit" title="[alt + enter]">Execute</button>');
            this.editor = window.ace.edit(this.$('.textarea')[0]);
            this.editor.setOptions({
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                fontFamily: "Fira Mono, Monaco, monospace"
            });
            this.editor.renderer.setShowGutter(false);
            this.editor.getSession().setMode("ace/mode/mysql");
            this.editor.$blockScrolling = Infinity;//prevent a warning message
            this.editor.commands.addCommand({
                name: "search",
                bindKey: {win: "Ctrl-p", mac: "Command-p"},
                exec: this.trigger.bind(this, 'focus-search')
            });
            this.editor.commands.addCommand({
                name: "execute",
                bindKey: {win: "Alt-Enter", mac: "Alt-Enter"},
                exec: this.triggerExecuteQuery.bind(this)
            });


            this.rendered = true;
        }

        return this;
    }
});


module.exports = QueryBox;
