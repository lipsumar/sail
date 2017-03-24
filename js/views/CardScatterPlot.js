var Card = require('./Card');

var CardTimeline = Card.extend({
    render: function(){
        var html = this.getBaseHtml();
        this.$el.html(html);
        this.applyEditor();


        if(this.loaded){
            var margin = {top: 20, right: 60, bottom: 60, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500- margin.top - margin.bottom;

            var data = this.rows.map(function(row){
                return [
                    parseFloat(row.x),
                    parseFloat(row.y)
                ];
            });

            var x = d3.scale.linear()
                .domain([
                    d3.min(data, function(d) { return d[0]; }),
                    d3.max(data, function(d) { return d[0]; })
                ])
                .range([ 0, width ]);

            var y = d3.scale.linear()
                .domain([
                    d3.min(data, function(d) { return d[1]; }),
                    d3.max(data, function(d) { return d[1]; })
                ])
                .range([ height, 0 ]);

            this.$('.card__body').empty();
            var chart = d3.select(this.$('.card__body')[0])
                .append('svg:svg')
                .attr('width', width + margin.right)
                .attr('height', height + margin.bottom)
                .attr('class', 'chart');


            var main = chart.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'main');

            // draw the x axis
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            main.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .attr('class', 'main axis date')
                .call(xAxis);

            // draw the y axis
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            main.append('g')
                .attr('transform', 'translate(0,0)')
                .attr('class', 'main axis date')
                .call(yAxis);

            var g = main.append("svg:g");

            g.selectAll("scatter-dots")
              .data(data)
              .enter().append("svg:circle")
                  .attr("cx", function (d) { return x(d[0]); } )
                  .attr("cy", function (d) { return y(d[1]); } )
                  .attr("r", 5);
        }
        return this;
    }
});

module.exports = CardTimeline;
