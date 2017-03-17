var Backbone = require('backbone');

var QueryBox = Backbone.View.extend({

    initialize: function(){
        //window.app.on('QueryBox:setQuery', this.setQuery);
    },

    setQuery: function(query){
        this.editor.setValue(query, 1);
    },

    render: function(){
        this.$el.html('<div class="textarea"></div>');
        this.editor = window.ace.edit(this.$('.textarea')[0]);
        this.editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            fontFamily: "Fira Mono, Monaco, monospace"
        });
        this.editor.renderer.setShowGutter(false);
        this.editor.getSession().setMode("ace/mode/mysql");
        return this;
    }
});


module.exports = QueryBox;
