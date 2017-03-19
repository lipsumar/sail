var Backbone = require('backbone'),
    $ = require('jquery');

var Boards = Backbone.View.extend({
    className: 'boards',

    initialize: function(){
        this.fetch();
    },

    fetch: function(){
        var self = this;
        $.getJSON('php/index.php?cmd=boards').then(function(resp){
            self.boards = resp.boards;
            self.loaded = true;
            self.render();
        });
    },

    render: function(){
        var html = '<h1 class="body-title">Boards</h1>';
        if(this.loaded){
            html+='<table cellpadding="0" cellspacing="0" border="0">';
            html+= this.boards.map(function(board){
                var vars = '';
                if(board.vars){
                    vars = board.vars.split(',').map(function(v){
                        return '<span class="boards__var">'+v+'</span>';
                    }).join('');
                }
                return `<tr>
                    <td width="40%"><a href="#board/${board.id}">${board.title || board.id}</a></td>
                    <td>${vars}</td>
                </tr>`;
            }).join('');
            html+='</table>';
        }else{
            html+='<br><div class="loader"></div>';
        }
        this.$el.html(html);
        return this;
    }
});


module.exports = Boards;
