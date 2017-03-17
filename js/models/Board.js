var Backbone = require('backbone');

var defaultConfig = `title: New board
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
        config: defaultConfig
    },
    url: function(){
        return 'php/?cmd=board&board='+(this.id || 'new');
    }
});


module.exports = Board;
