var Backbone = require('backbone');

var Table = Backbone.View.extend({
    className: 'table',
    initialize: function(opts = {}){
        this.rows = opts.rows;
        this.fields = opts.fields;
        this.tables = opts.tables;
        this.noResultMessage = typeof opts.noResultMessage === 'undefined' ? 'No result 😐' : opts.noResultMessage;
    },
    setModel(model){
        this.model = model;
    },
    setRows(rows){
        this.rows = rows;
    },

    getColumnX(fieldAlias){
        return this.$(`th[data-alias="${fieldAlias}"]`).position().left;
    },

    render: function(){
        if(this.rows.length === 0){
            this.$el.html(this.noResultMessage);
        }else{
            var html = '<table class="table" cellpadding="0" cellspacing="0" border="0">';
            const baseFields = this.model.getBaseFields();

            html+=`<thead>
                <tr>
                    <th class="join-table__table-name" colspan="${baseFields.length}">
                        ${this.model.table}
                    </th>
                    <th></th>
            `;
            this.model.joins.forEach(join => {
                html+=`
                    <th class="join-table__table-name" colspan="${this.model.getTableFields(join.table).length}">
                        ${join.table}
                    </th>
                    <th></th>`;
            });
            html+=`
                </tr>
            <tr>`;

            // fields of base table
            baseFields.forEach(function(field){
                html+= `<th data-alias="${field.alias}">${field.field}</th>`;
            });

            // fields of joins
            this.model.joins.forEach(join => {
                html+='<th class="join-table__between"></th>';
                this.model.getTableFields(join.table).forEach(function(field){
                    html+= `<th data-alias="${field.alias}">${field.field}</th>`;
                });
            });

            html+='<th class="join-table__add-join"></th>';
            html+'</tr></thead>';

            html+='<tbody>';


            this.rows.forEach((row, rowI) => {
                html+='<tr>';

                baseFields.forEach(function(field){
                    var valueString = row[field.alias] ? row[field.alias].toString() : '';

                    html+='<td>'+valueString+'</td>';
                });

                this.model.joins.forEach(join => {
                    html+= '<td class="join-table__between"></td>';
                    this.model.getTableFields(join.table).forEach(function(field){
                        var valueString = row[field.alias] ? row[field.alias].toString() : '';
                        html+='<td>'+valueString+'</td>';
                    });
                });

                if(rowI===0){
                    html+=`<td class="join-table__add-join" rowspan="${this.rows.length}"></td>`;
                }

                html+='</tr>';

            });
            html+='</tbody>';

            html+='</table>';


            this.$el.html(html);
        }


        return this;
    }
});


module.exports = Table;
