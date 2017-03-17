var Backbone = require('backbone'),
    Router = require('../Router'),
    ConsoleView = require('./Console'),
    BoardView = require('./Board'),
    BoardModel = require('../models/Board'),
    EditBoardView = require('./EditBoard');

var App = Backbone.View.extend({

    initialize: function(){
        var router = new Router();
        router.on('route:index', this.index.bind(this));
        router.on('route:console', this.console.bind(this));
        router.on('route:board', this.board.bind(this));
        router.on('route:editBoard', this.editBoard.bind(this));
        this.router = router;


    },

    index: function(){
        this.showBody('index');
    },

    console: function(){
        this.showBody('console');
        this.consoleView = new ConsoleView();
        this.$bodyConsole.append(this.consoleView.render().el);
    },

    board: function(id, queryString){
        if(this.boardView){
            this.boardView.remove();
        }
        this.showBody('board');

        var vars = {};
        if(queryString){
            queryString.split('&').reduce(function(o, kv) {
                var p = kv.split('=');
                o[p[0]] = p[1];
                return o;
            }, vars);
        }

        var board = new BoardView(id, {vars: vars});
        this.$bodyBoard.append(board.render().el);
        this.boardView = board;
    },

    editBoard: function(id){
        if(this.editBoardView){
            this.editBoardView.remove();
        }
        var self = this;
        this.showBody('generic');
        var board = new BoardModel(id === 'new' ? null : {id:id});
        var editBoardView = new EditBoardView({
            model: board
        });
        if(board.isNew()){
            this.$bodyGeneric.append(editBoardView.render().el);
        }else{
            board.once('sync', function(){
                self.$bodyGeneric.append(editBoardView.render().el);
            });
            board.fetch();
        }

        this.editBoardView = editBoardView;
    },

    showBody: function(id, opts){
        this.$('.body').hide();
        this.$('.body-'+id).show();
    },

    navigate: function(route, opts){
        this.router.navigate(route, Object.assign({trigger: true}, opts));
    },

    render: function(){
        var html = `
        <div class="sidebar">
            <a href="#" class="sidebar__logo">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><polygon points="81.857,85.109 45.449,9.692 45.449,39.676 45.449,71.819 45.449,87.046 43.283,86.892 43.283,7.522 41.548,7.522   41.548,86.769 18.143,85.109 25.51,92.043 77.522,92.478 79.255,89.443 54.66,87.699 "/></svg>
            </a>
            <div class="sidebar__menu">
                <a href="#console" title="Console">&gt;</a>
                <a href="#boards" title="View boards">B</a>
                <a href="#edit/board/new" title="New board">+</a>
            </div>
        </div>
        <div class="main">
            <div class="body body-index">
                <h1 class="body-title">Welcome to Sail</h1>
                <div class="body-menu">
                    <div class="body-menu__item">Craft queries in the console</div>
                    <div class="body-menu__item">View existing boards</div>
                    <div class="body-menu__item">Create a new board</div>
                </div>
            </div>
            <div class="body body-console" style="display:none"></div>
            <div class="body body-board" style="display:none"></div>
            <div class="body body-generic" style="display:none"></div>
        </div>`;
        this.$el.html(html);
        this.$bodyConsole = this.$('.body-console');
        this.$bodyBoard = this.$('.body-board');
        this.$bodyGeneric = this.$('.body-generic');
        return this;
    }


});

module.exports = App;
