var Backbone = require('backbone'),
    Router = require('../Router'),
    ConsoleView = require('./Console'),
    BoardView = require('./Board'),
    BoardModel = require('../models/Board'),
    EditBoardView = require('./EditBoard'),
    BoardsView = require('./Boards');

var App = Backbone.View.extend({

    initialize: function(){
        var router = new Router();
        router.on('route:index', this.index.bind(this));
        router.on('route:console', this.console.bind(this));
        router.on('route:board', this.board.bind(this));
        router.on('route:editBoard', this.editBoard.bind(this));
        router.on('route:boards', this.boards.bind(this));
        this.router = router;


    },

    index: function(){
        this.showBody('index');
    },

    console: function(){
        this.showBody('console');
        this.activeMenu('console');
        this.consoleView = new ConsoleView();
        this.$bodyConsole.append(this.consoleView.render().el);
    },

    boards: function(){
        if(this.boardsView){
            this.boardsView.remove();
        }
        this.boardsView = new BoardsView();
        this.showBody('generic');
        this.$bodyGeneric.empty();
        this.$bodyGeneric.append(this.boardsView.render().el);
    },

    board: function(id, queryString){
        if(this.boardView){
            this.boardView.remove();
        }
        this.showBody('board');
        this.activeMenu('board');

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
        this.$bodyGeneric.empty();

        var board = new BoardModel(id === 'new' ? null : {id:id});
        this.activeMenu(board.isNew() ? 'new' : 'board');
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

    activeMenu: function(menu){
        this.$('.sidebar__menu a').removeClass('active');
        if(menu){
            this.$('.sidebar__menu a[data-menu="'+menu+'"]').addClass('active');
        }
    },

    navigate: function(route, opts){
        this.router.navigate(route, Object.assign({trigger: true}, opts));
    },

    render: function(){
        var html = `
        <div class="sidebar">
            <a href="#" class="sidebar__logo">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><polygon points="81.857,85.109 45.449,9.692 45.449,39.676 45.449,71.819 45.449,87.046 43.283,86.892 43.283,7.522 41.548,7.522   41.548,86.769 18.143,85.109 25.51,92.043 77.522,92.478 79.255,89.443 54.66,87.699 "/></svg>
            </a>
            <div class="sidebar__menu">
                <a href="#console" data-menu="console" title="Console">
                    <svg xmlns="http://www.w3.org/2000/svg"  version="1.1" viewBox="0 0 24 30" x="0px" y="0px"><g transform="translate(0,-21)"><path style="clip-rule:nonzero;display:inline;overflow:visible;visibility:visible;opacity:1;isolation:auto;mix-blend-mode:normal;color-interpolation:sRGB;color-interpolation-filters:linearRGB;solid-opacity:1;stroke:none;marker:none;color-rendering:auto;image-rendering:auto;shape-rendering:auto;text-rendering:auto;enable-background:accumulate" d="M 4 4 C 2.892 4 2 4.892 2 6 L 2 18 C 2 19.108 2.892 20 4 20 L 20 20 C 21.108 20 22 19.108 22 18 L 22 6 C 22 4.892 21.108 4 20 4 L 4 4 z M 4 6 L 20 6 L 20 18 L 4 18 L 4 6 z M 7.4140625 8 L 6 9.4140625 L 8.1210938 11.535156 L 6 13.65625 L 7.4140625 15.070312 L 10.949219 11.535156 L 7.4140625 8 z M 13 13.070312 L 13 15.070312 L 18 15.070312 L 18 13.070312 L 13 13.070312 z " transform="translate(0,24)"/></g></svg>
                </a>
                <a href="#boards" data-menu="board" title="View boards">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><g transform="translate(0,11)"><path d="M93.125,5H6.875C5.839,5,5,5.838,5,6.873c0,1.033,0.839,1.872,1.875,1.872h3.75v46.802c0,1.035,0.839,1.872,1.875,1.872    h75c1.036,0,1.875-0.837,1.875-1.872V8.745h3.75C94.161,8.745,95,7.906,95,6.873C95,5.838,94.161,5,93.125,5z M36.875,42.442    c0,1.034-0.839,1.872-1.875,1.872s-1.875-0.838-1.875-1.872V31.21c0-1.034,0.839-1.873,1.875-1.873s1.875,0.838,1.875,1.873    V42.442z M51.875,42.442c0,1.034-0.839,1.872-1.875,1.872c-1.036,0-1.875-0.838-1.875-1.872V19.977    c0-1.034,0.839-1.872,1.875-1.872c1.036,0,1.875,0.838,1.875,1.872V42.442z M66.875,42.442c0,1.034-0.839,1.872-1.875,1.872    s-1.875-0.838-1.875-1.872v-5.616c0-1.034,0.839-1.872,1.875-1.872s1.875,0.838,1.875,1.872V42.442z M51.875,73.632v-4.98h7.5    c1.036,0,1.875-0.837,1.875-1.872c0-1.034-0.839-1.872-1.875-1.872h-18.75c-1.036,0-1.875,0.838-1.875,1.872    c0,1.035,0.839,1.872,1.875,1.872h7.5v4.98L29.924,91.805c-0.732,0.731-0.732,1.916,0,2.647c0.732,0.73,1.919,0.73,2.651,0    l15.549-15.526v14.202C48.125,94.162,48.964,95,50,95c1.036,0,1.875-0.838,1.875-1.872V78.926l15.549,15.526    c0.729,0.726,1.912,0.736,2.652,0c0.732-0.731,0.732-1.916,0-2.647L51.875,73.632z"/></g></g></svg>
                </a>
                <a href="#edit/board/new" data-menu="new" title="New board">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" x="0px" y="0px" viewBox="0 0 50 62.5"><g transform="translate(0,-996.3622)"><path style="text-indent:0;text-transform:none;direction:ltr;block-progression:tb;baseline-shift:baseline;enable-background:accumulate;" d="m 25,1042.3622 c -1.6568,0 -3,-1.3431 -3,-3 l 0,-9 -9,0 c -1.65685,0 -3,-1.3431 -3,-3 0,-1.6568 1.34315,-3 3,-3 l 9,0 0,-9 c 0,-1.6568 1.3432,-3 3,-3 1.6569,0 3,1.3432 3,3 l 0,9 9,0 c 1.65685,0 3,1.3432 3,3 0,1.6569 -1.34315,3 -3,3 l -9,0 0,9 c 0,1.6569 -1.3431,3 -3,3 z" fill-opacity="1" stroke="none" marker="none" visibility="visible" display="inline" overflow="visible"/></g></svg>
                </a>
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
