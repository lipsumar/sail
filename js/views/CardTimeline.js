var Card = require('./Card');

var CardTimeline = Card.extend({
    render: function(){
        var html = this.getBaseHtml();
        this.$el.html(html);
        this.applyEditor();


        if(this.loaded){
            var data = this.rows.map(function(row){
                return {
                    label: row.label || row.name || row.title,
                    times:[{
                        starting_time: row.start_time,
                        ending_time: row.end_time
                    }]
                };
            });

            var chart = d3.timeline()//.width(500*4)
                .tickFormat({
                    format: d3.time.format("%b %d"),
                    tickTime: d3.time.days,
                    tickInterval: 1,
                    tickSize: 5
                })
                .showTimeAxisTick()
                .stack()
                .margin({left:170, right:30, top:0, bottom:0});

            this.$('.card__body').empty();
            d3.select(this.$('.card__body')[0]).append("svg")
                .attr("width", 1200)
                .datum(data).call(chart);
        }
        return this;
    }
});

module.exports = CardTimeline;
