//= require ../../libs/socket.js
//= require ../../models/game_result.js
//= require ../../models/user_result.js
//= require ../../collections/game_results.js
//= require ../../collections/user_results.js
//= require ../../views/game_result_view
//= require ../../views/game_results_view
//= require ../../views/user_result_view
//= require ../../views/user_results_view

(function () {

  var GameSearchView = Backbone.View.extend({
    el: $(".search-page"),
    events: {
      "keypress .search": "search"
    },
    template: _.template($("#game-search-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "pagenation");

      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection});
      this.game_title              = this.$(".game-title-input");
      this.current_game_title      = null;
      this.page                    = 1;
    },
    search: function (e) {
      if (e.which == 13 && this.game_title.val()) {
        e.preventDefault();

        var that                = this;
        this.page               = 1;
        this.current_game_title = this.game_title.val();

        this.game_result_collection.fetch({
          data: {search_title: this.current_game_title, page: this.page},
          success: function (model, response, options) {
            that.game_result_collection.reset();
            that.game_results_view.$el.html("");
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var game_result = new GameResult(response.results[i]);
                that.game_results_view.collection.add(game_result);
              }
            }
          },
          error: function () {

          }
        })

        $(window).unbind("scroll");
        $(window).bind("scroll", this.pagenation);
      }
    },
    pagenation: function () {
      var that           = this;
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();

      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
         $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");

        this.page += 1;

        this.game_result_collection.fetch({
          data: {search_title: this.current_game_title, page: this.page},
          success: function (model, response, options) {
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var game_result = new GameResult(response.results[i]);
                that.game_results_view.collection.add(game_result);
              }
            }

            $(".loading-gif").css("display", "none");

            if (response.results.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    }
  })

  var UserSearchView = Backbone.View.extend({
    el: $(".search-page"),
    events: {
      "keypress .search": "search"
    },
    template: _.template($("#user-search-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "pagenation");

      this.user_result_collection = new UserResults();
      this.user_results_view      = new UserResultsView({el: ".result-list", collection: this.user_result_collection});
      this.username               = this.$(".username-input");
      this.current_username       = null;
      this.page                   = 1;
    },
    search: function (e) {
      if (e.which == 13 && this.username.val()) {
        e.preventDefault();

        var that              = this;
        this.page             = 1;
        this.current_username = this.username.val();

        this.user_result_collection.fetch({
          data: {username: this.current_username, page: this.page},
          success: function (model, response, options) {
            that.user_result_collection.reset();
            that.user_results_view.$el.html("");
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var user_result = new UserResult(response.results[i]);
                that.user_results_view.collection.add(user_result);
              }
            }
          },
          error: function () {

          }
        });

        $(window).unbind("scroll");
        $(window).bind("scroll", this.pagenation);
      }
    },
    pagenation: function () {
      var that           = this;
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();

      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");

        this.page += 1;

        this.user_result_collection.fetch({
          data: {username: this.current_username, page: this.page},
          success: function (model, response, options) {
            if (response.results && response.results.length > 0) {
              for (var i = 0; i < response.results.length; i++) {
                var user_result = new UserResult(response.results[i]);
                that.user_results_view.collection.add(user_result);
              }
            }

            $(".loading-gif").css("display", "none");

            if (response.results.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        });
      }
    }
  })


  var Router = Backbone.Router.extend({
    routes: {
      "game": "game",
      "user": "user"
    },
    game: function () {
      this.current_app = new GameSearchView();
    },
    user: function () {
      this.current_app = new UserSearchView();
    }
  })

  var router = new Router();
  Backbone.history.start();
})();