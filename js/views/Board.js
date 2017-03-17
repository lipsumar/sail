var Backbone = require('backbone'),
    $ = require('jquery'),
    YAML = require('yamljs'),
    Card = require('./Card.js'),
    CardTimeline = require('./CardTimeline.js'),
    BoardModel = require('../models/Board');

var CardTypes = {Card, CardTimeline};

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
        console.log(config);
        if(config.defaults){
            Object.assign(this.vars, config.defaults)
        }
        this.renderVars();
        this.cards = config.cards.map(this.buildCard.bind(this));
    },

    renderVars: function(){
        var vars = this.vars;
        var inputs = $.map(this.config.vars, function(label, variable){
            var name = label || variable;
            return '<div class="var">'+name+':<input name="'+name+'" value="'+(vars[variable] || '')+'" autocomplete="off"></div>';
        });
        this.$('.vars').html(inputs.join('')+'<button type="submit" class="reload">▶</button>');

        this.$('.vars input').autoresize({padding:5,minWidth:40,maxWidth:300});
    },

    buildCard: function(cardConfig){
        var cardClass = cardConfig.renderer || 'Card';
        var card = new CardTypes[cardClass](Object.assign({}, cardConfig, {board:this}));
        this.$cards.append(card.render().el);
        return card;
    },

    render: function(){
        var html = '';
        html+='<form class="top"><div class="vars"></div><a href="#edit/board/'+this.id+'">✏️</a></form><div class="cards"></div>';
        this.$el.html(html);
        this.$cards = this.$('.cards');
        return this;
    }
});

module.exports = Board;
