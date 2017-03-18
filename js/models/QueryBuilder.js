var Backbone = require('backbone');

var QueryBuilder = Backbone.Model.extend({
    initialize: function(){
        this.reset();
    },
    reset: function(){
        this.tables = [];
    },

    addTable: function(table){
        this.tables.push(table);
    },

    buildSelect: function(){
        if(this.tables.length === 0){
            throw new Error('called buildSelect without adding table(s)');
        }else{
            return 'SELECT *\nFROM ' + this.buildFrom() + '\nWHERE 1';
        }
    },

    buildFrom: function(){
        var from = this.tables[0];
        if(this.tables.length > 1){

            var aliases = this.generateTableAliases();

            this.tables.forEach(function(table, i, tables){
                if(i === 0) return;

                var prev = tables[i-1];

                from += '\n  JOIN ' + table + ' ON ';
            });
        }
        return from;
    },

    generateTableAliases: function(){

        var prefixlessTables = this.removePrefixes(this.tables);


        var aliases = [];
        this.tables.forEach(function(table){
            var alias = table.substr(0, 1);

        });
    },

    removePrefixes: function(tables){

        var stems = {};
        var stemStep = 0;

        tables.forEach(function(table){
            var stemChar = table.substr(stemStep, 1);
            if(!stems[stemChar]){
                stems[stemChar] = {
                    leaves: [table]
                };
            }else{
                stems[stemChar].leaves.push(table);
            }

        });
        stemStep++;

        console.log('step '+stemStep);
        console.log(stems);

        // trust
        // tir
        // asterix
        // tx_ef_truc
        // tx_ef_machin

        /*tables.forEach(function(table){
            var stemChar = table.substr(stemStep, 1),
                prev = table.substr(stemStep-1, 1);

            var currentStem = prev + stemChar;
            if(!stems[currentStem]){
                stems[currentStem] =
            }



        });*/



    }


});



module.exports = QueryBuilder;
