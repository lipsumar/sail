var Backbone = require('backbone'),
    YAML = require('yamljs');

var defaultConfig = `title: New board
id:
vars:
  foo:
cards:
  - title: My card
    query: |
      select * from table
      where foo=$foo
`;


var Board = Backbone.Model.extend({
    defaults:{
        config: defaultConfig,
        title: 'New board',
        vars: ['foo'],
        id: null
    },
    parse: function(board){
        var config = YAML.parse(board.config);
        board.title = config.title;
        board.vars = config.vars;
        return board;
    },
    url: function(){
        return 'php/?cmd=board&board='+(this.id || 'new');
    }
});


module.exports = Board;
