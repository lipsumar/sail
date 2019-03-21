class TableJoinModel{
    constructor(opts){
        this.allTables = opts.allTables;
        this.fields = {};
        this.joins = [];
    }
    setTable(table){
        this.table = table;
        this.fields[this.table] = this.getDefaultSelectFields(this.table);
    }

    getDefaultSelectFields(table){
        const tableDef = this.allTables[table];
        const selectFields = [];
        if(tableDef.__fields.includes('id')){
            selectFields.push('id');
        }
        if(tableDef.__fields.includes('name')){
            selectFields.push('name');
        }
        if(tableDef.__fields.includes('title')){
            selectFields.push('title');
        }
        if(tableDef.__fields.includes('email')){
            selectFields.push('email');
        }
        if(selectFields.length === 0){
            let defaultField = tableDef.__fields[0];
            selectFields.push(defaultField);
        }
        return selectFields;
    }

    addField(table, field){
        this.fields[table].push(field);
    }

    addTable(fromField, table, toField){
        this.joins.push({fromField, table, toField});
        this.fields[table] = this.getDefaultSelectFields(table);
    }

    getBaseFields(){
        return this.fields[this.table].map(f => ({field:f, alias:f}));
    }

    getTableFields(table){
        const i = this.joins.findIndex(j => j.table === table);
        return this.fields[table].map(f => ({field:f, alias:`_t${i}_${f}`}));
    }

    getAllFields(){
        let allFields = this.getBaseFields().map(f => {
            f.table = this.table;
            return f;
        });
        this.joins.forEach(join => {
            const joinFields = this.getTableFields(join.table).map(f => {
                f.table = join.table;
                return f;
            });
            allFields = allFields.concat(joinFields);
        });
        return allFields;
    }

    getQuery(){
        let query = `SELECT ${this.fields[this.table].map(f => `_t.${f}`).join(', ')}`;

        this.joins.forEach((join,i) => {
            query += ', ' + this.fields[join.table].map(f => `_t${i}.${f} AS _t${i}_${f}`).join(', ');
        });

        query += ` FROM ${this.table} _t`;

        this.joins.forEach((join,i) => {
            query += ` JOIN ${join.table} _t${i} ON _t.${join.fromField} = _t${i}.${join.toField}`;
        });
        return query;
    }
}

module.exports = TableJoinModel;