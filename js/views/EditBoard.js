var Backbone = require('backbone');

var EditBoard = Backbone.View.extend({
    className: 'edit-board',
    initialize: function(opts){
        this.board = opts.model;
    },

    events:{
        'click .save': 'save'
    },

    save: function(){
        var self = this;
        this.board.set('config', this.editor.getValue());
        this.board.save().then(function(){
            window.app.navigate('board/'+self.board.id);
        });

    },

    render: function(){
        var html = '<div class="textarea">'+this.board.get('config')+'</div>';
        html+='<button class="save">💾</button>';
        this.$el.html(html);

        this.editor = window.ace.edit(this.$('.textarea')[0]);
        this.editor.setOptions({
            maxLines: Infinity,
            enableBasicAutocompletion: true
        });
        this.editor.renderer.setShowGutter(false);
        this.editor.getSession().setMode("ace/mode/yaml");

        return this;
    }
});


module.exports = EditBoard;




