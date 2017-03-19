var Backbone = require('backbone'),
    YAML = require('yamljs');

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
        var yaml = this.editor.getValue();

        var config = this.parseYaml(yaml);
        if(!config){
            alert('YAML error');
            return;
        }

        this.board.set('config', yaml);
        this.board.set('vars', Object.keys(config.vars));
        this.board.set('id', config.id);
        this.board.save().then(function(){
            window.app.navigate('board/'+self.board.id);
        }, this.handleSaveError.bind(this));

    },

    handleSaveError: function(resp){
        if(resp && resp.error === 'BOARD_EXISTS'){
            alert('Board ID "'+resp.id+'" already in use');
        }
    },

    parseYaml: function(yaml){
        var json;
        try{
            json = YAML.parse(yaml);
        }catch(err){
            return false;
        }
        return json;
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




