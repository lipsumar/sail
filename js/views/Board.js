var Backbone = require('backbone'),
    $ = require('jquery'),
    YAML = require('yamljs'),
    Card = require('./Card.js'),
    CardTimeline = require('./CardTimeline.js'),
    CardCount = require('./CardCount.js'),
    CardScatterPlot = require('./CardScatterPlot.js'),
    BoardModel = require('../models/Board');

var CardTypes = {Card, CardTimeline, CardCount, CardScatterPlot};
var editIcon = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 100"><g transform="translate(0,-952.36218)"><path style="opacity:1;stroke:none;stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-opacity:1;stroke-dashoffset:0;marker:none;visibility:visible;display:inline;overflow:visible;enable-background:accumulate;fill-opacity:1;" d="M 70 13 L 61.4375 21.5625 L 78.4375 38.5625 L 87 30 L 70 13 z M 58.59375 24.40625 L 20.4375 62.5625 L 37.4375 79.5625 L 75.59375 41.40625 L 58.59375 24.40625 z M 17.84375 65.65625 L 13 87 L 34.34375 82.15625 L 17.84375 65.65625 z " transform="translate(0,952.36218)"/></g></svg>'

var Board = Backbone.View.extend({
    initialize: function(boardId, opts){
        this.id = boardId;
        this.vars = opts.vars || {};
        this.loadConfig(boardId);
    },

    events:{
        'submit form': 'formSubmit'
    },

    formSubmit: function(e){
        e.preventDefault();

        this.vars = this.$('form').serializeArray().reduce(function(vars, v){
            vars[v.name] = v.value;
            return vars;
        }, {});

        this.trigger('varsChanged');
    },

    loadConfig: function(name){
        var self = this;
        var board = new BoardModel({id: name});
        board.fetch().then(function(){
            self.displayConfig(board.get('config'));
        });

    },

    displayConfig: function(config){
        config = YAML.parse(config);
        this.config = config;
        if(config.defaults){
            Object.assign(this.vars, config.defaults);
        }
        this.$('.body-title span').text(this.config.title);
        this.renderVars();
        config.cards.forEach(this.buildCard.bind(this));
    },

    renderVars: function(){
        var vars = this.vars;
        var inputs = $.map(this.config.vars, function(label, variable){
            var name = label || variable;
            return '<div class="var">'+name+':<input name="'+variable+'" value="'+(vars[variable] || '')+'" autocomplete="off" type="search"></div>';
        });
        this.$('.vars').html(inputs.join('')+'<button type="submit" class="reload">▶</button>');

        this.$('.vars input').autoresize({padding:5,minWidth:60,maxWidth:300});
    },

    buildCard: function(cardConfig, $parent){
        if(cardConfig instanceof $){ // switch params
            var temp = $parent;
            $parent = cardConfig;
            cardConfig = temp;
        }

        if(!($parent instanceof $)){
            $parent = this.$cards;
        }

        if(cardConfig.row){
            var $row = $('<div class="grid__row"></div>');
            $parent.append($row);
            cardConfig.row.forEach(this.buildCard.bind(this, $row));
        }else{
            var cardClass = cardConfig.renderer || 'Card';
            var card = new CardTypes[cardClass](Object.assign({}, cardConfig, {board:this}));
            var $cell = $('<div class="grid__cell"></div>');
            if(cardConfig.width){
                $cell.css('flex', '0 0 '+cardConfig.width);
            }
            $cell.append(card.render().el);
            $parent.append($cell);
        }
    },

    render: function(){
        var html = '<h1 class="body-title body-title--pad"><span></span><a href="#edit/board/'+this.id+'" class="body-title__link">'+editIcon+'</a></h1>';
        html+='<form class="top"><div class="vars"></div></form><div class="cards"></div>';
        this.$el.html(html);
        this.$cards = this.$('.cards');
        return this;
    }
});

module.exports = Board;
