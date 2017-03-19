var Card = require('./Card'),
    formatNumber = require('format-number'),
    countFormatter = formatNumber({
        integerSeparator: '&nbsp;'
    });

var CardCount = Card.extend({
    render: function(){
        var html = this.getBaseHtml();
        this.$el.html(html);
        this.applyEditor();


        if(this.loaded){
            var count = this.rows[0].num;
            this.$('.card__body').html('<div class="card-count__count">'+countFormatter(count)+'</div>');
        }
        return this;
    }
});

module.exports = CardCount;
