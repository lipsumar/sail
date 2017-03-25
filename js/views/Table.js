var Backbone = require('backbone');

var Table = Backbone.View.extend({
    className: 'table',
    initialize: function(opts){
        this.rows = opts.rows;
        this.fields = opts.fields;
        this.noResultMessage = typeof opts.noResultMessage === 'undefined' ? 'No result 😐' : opts.noResultMessage;
    },
    render: function(){
        if(this.rows.length === 0){
            this.$el.html(this.noResultMessage);
        }else{

            var html = '<table class="table" cellpadding="0" cellspacing="0" border="0">';
            html+'<thead><tr>';
            this.fields.forEach(function(field){
                html+= '<th data-field="'+field+'">'+field+'</th>';
            });
            html+'</tr></thead>';

            html+='<tbody>';
            var fields = this.fields;

            var even = true;
            if(window.SailOptions.styledRows && window.SailOptions.styledRows instanceof Array){
                var styledRows = window.SailOptions.styledRows.filter(function(styledRow){
                    return fields.indexOf(styledRow.column);
                });
            }

            this.rows.forEach(function(row){
                html+='<tr class="'+(even ? 'even' : 'odd')+'"';
                var styles = [];
                styledRows.forEach(function(styledRow){
                    if(row[styledRow.column] == styledRow.value){
                        styles.push(styledRow.style);
                    }
                });

                if(styles.length > 0){
                    html+= 'style="' + styles.join(';') + '"';
                }
                html+='>';

                fields.forEach(function(field){
                    var valueString = row[field] ? row[field].toString() : '';
                    /*if(valueString.length > 30){
                        valueString = valueString.substring(0, 30)+'...';
                    }*/
                    if(field === '_sail_url'){
                        var parts = valueString.split('-&gt;'), //@TODO server should not escape HTML
                            url = valueString;
                        if(parts.length>1){
                            url = parts[1];
                        }
                        html+='<td><a href="'+url+'">'+parts[0]+'</a></td>';
                    }else{
                        html+='<td>'+valueString+'</td>';
                    }

                });
                html+='</tr>';
                even = !even;
            });
            html+='</tbody>';

            html+='</table>';


            this.$el.html(html);
        }


        return this;
    }
});


module.exports = Table;
