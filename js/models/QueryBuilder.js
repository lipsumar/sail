var Backbone = require('backbone');

var QueryBuilder = Backbone.Model.extend({
    reset: function(){

    },

    buildSelectFromTable: function(table){
        return 'SELECT *\nFROM '+table+'\nWHERE 1';
    }
});



module.exports = QueryBuilder;
