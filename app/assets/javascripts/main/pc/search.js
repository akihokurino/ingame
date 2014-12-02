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
      "click .search-btn":          "search",
      "keypress .game-title-input": "searchWithEnter"
    },
    template: _.template($("#game-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "pagenation");

      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection});
      this.game_title             = this.$(".game-title-input");
      this.current_game_title     = null;
      this.page                   = 1;

      if (this.getQueryString()) {
        this.current_game_title = this.getQueryString().search_word;
        this.game_title.val(this.current_game_title);
        $(".header-search-input").val(this.current_game_title);
        this.search(null, "first");
      }
    },
    search: function (e, type) {
      if (e) {
        e.preventDefault();
      }

      var that  = this;
      this.page = 1;

      if (type != "first") {
        this.current_game_title = this.game_title.val();
      }

      this.game_result_collection.fetch({
        data: {search_title: this.current_game_title, page: this.page},
        success: function (model, response, options) {
          that.game_result_collection.reset();
          that.game_results_view.$el.html("");
          if (response.results && response.results.length > 0) {
            for (var i = 0; i < response.results.length; i++) {
              var game_result = new GameResult(response.results[i]);
              var current_url = "/games/" + game_result.id + "#all";
              game_result.set("current_url", current_url);
              that.game_results_view.collection.add(game_result);
            }
          }

          that.$(".result-area").html((that.text_template({
            search_title: that.current_game_title, target: "ゲーム", result_count: response.count
          })));
        },
        error: function () {

        }
      })

      $(window).unbind("scroll");
      $(window).bind("scroll", this.pagenation);
    },
    searchWithEnter: function (e) {
      if (e.which == 13) {
        e.preventDefault();
        this.search(e, null);
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
                var current_url = "/games/" + game_result.id + "#all";
                game_result.set("current_url", current_url);
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
    },
    getQueryString: function () {
      if (1 < document.location.search.length) {
        var query      = document.location.search.substring(1);
        var parameters = query.split('&');
        var result     = new Object();

        for (var i = 0; i < parameters.length; i++) {
          var element       = parameters[i].split('=');
          var paramName     = decodeURIComponent(element[0]);
          var paramValue    = decodeURIComponent(element[1]);
          result[paramName] = decodeURIComponent(paramValue);
        }
        return result;
      }
      return null;
    }
  })

  var UserSearchView = Backbone.View.extend({
    el: $(".search-page"),
    events: {
      "click .search-btn":        "search",
      "keypress .username-input": "searchWithEnter"
    },
    template: _.template($("#user-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
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

          that.$(".result-area").html((that.text_template({
            search_title: that.current_username, target: "ユーザー", result_count: response.count
          })));
        },
        error: function () {

        }
      });

      $(window).unbind("scroll");
      $(window).bind("scroll", this.pagenation);
    },
    searchWithEnter: function (e) {
      if (e.which == 13) {
        e.preventDefault();
        this.search(e);
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