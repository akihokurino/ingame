//= require ../../libs/socket.js
//= require ../../libs/pagenation.js
//= require ../../libs/url_query.js
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
      "click .search-btn":          "clickSearchBtn",
      "keypress .game-title-input": "searchWithEnter",
      "click .change-target-link":  "changeTarget"
    },
    template: _.template($("#game-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      $(window).unbind("scroll");
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "setGameResultCollection");

      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection, type: null});
      this.game_title             = this.$(".game-title-input");
      this.current_game_title     = null;
      this.page                   = 1;

      if (url_query.getQueryString()) {
        this.current_game_title = url_query.getQueryString().search_word;
        this.game_title.val(this.current_game_title);
        this.search();
      }
    },
    search: function () {
      var that  = this;
      this.page = 1;
      $(window).unbind("scroll");

      this.game_result_collection.fetch({
        data: {search_title: this.current_game_title, page: this.page},
        success: function (model, response, options) {
          that.pagenation = new Pagenation(that.game_result_collection, {search_title: that.current_game_title}, that.setGameResultCollection);

          that.game_result_collection.reset();
          that.game_results_view.$el.html("");
          that.setGameResultCollection(model, response, options);

          that.$(".result-area").html((that.text_template({
            search_title: that.current_game_title, target: "ゲーム", result_count: response.count
          })));
        },
        error: function () {
        }
      });
    },
    searchWithEnter: function (e) {
      if (e.which == 13 && this.game_title.val() != "") {
        e.preventDefault();
        this.current_game_title = this.game_title.val();
        url_query.insertParam("search_word", this.current_game_title);
      }
    },
    clickSearchBtn: function () {
      if (this.game_title.val() != "") {
        this.current_game_title = this.game_title.val();
        url_query.insertParam("search_word", this.current_game_title);
      }
    },
    setGameResultCollection: function (model, response, option) {
      if (response.results && response.results.length > 0) {
        for (var i = 0; i < response.results.length; i++) {
          var game_result = new GameResult(response.results[i]);
          this.game_results_view.collection.add(game_result);
        }
      }

      if (response.results.length != 0) {
        $(window).bind("scroll", this.pagenation.load);
      }
    },
    changeTarget: function (e) {
      e.preventDefault();
      var search_word     = this.game_title.val();
      var current_user_id = $("#wrapper").data("userid");

      if (search_word && search_word != "") {
        location.href = "/users/" + current_user_id + "/search_game_or_user?search_word=" + search_word + "#user";
      } else {
        location.href = "/users/" + current_user_id + "/search_game_or_user#user";
      }
    }
  });

  var UserSearchView = Backbone.View.extend({
    el: $(".search-page"),
    events: {
      "click .search-btn":         "clickSearchBtn",
      "keypress .username-input":  "searchWithEnter",
      "click .change-target-link": "changeTarget"
    },
    template: _.template($("#user-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      $(window).unbind("scroll");
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "setUserResultCollection");

      this.user_result_collection = new UserResults();
      this.user_results_view      = new UserResultsView({el: ".result-list", collection: this.user_result_collection});
      this.username               = this.$(".username-input");
      this.current_username       = null;
      this.page                   = 1;

      if (url_query.getQueryString()) {
        this.current_username = url_query.getQueryString().search_word;
        this.username.val(this.current_username);
        this.search();
      }
    },
    search: function () {
      var that  = this;
      this.page = 1;
      $(window).unbind("scroll");

      this.user_result_collection.fetch({
        data: {username: this.current_username, page: this.page},
        success: function (model, response, options) {
          that.pagenation = new Pagenation(that.user_result_collection, {username: that.current_username}, that.setUserResultCollection);

          that.user_result_collection.reset();
          that.user_results_view.$el.html("");
          that.setUserResultCollection(model, response, options);

          that.$(".result-area").html((that.text_template({
            search_title: that.current_username, target: "ユーザー", result_count: response.count
          })));
        },
        error: function () {
        }
      });
    },
    searchWithEnter: function (e) {
      if (e.which == 13 && this.username.val() != "") {
        e.preventDefault();
        this.current_username = this.username.val();
        url_query.insertParam("search_word", this.current_username);
      }
    },
    clickSearchBtn: function () {
      if (this.username.val() != "") {
        this.current_username = this.username.val();
        url_query.insertParam("search_word", this.current_username);
      }
    },
    setUserResultCollection: function (model, response, option) {
      if (response.results && response.results.length > 0) {
        for (var i = 0; i < response.results.length; i++) {
          var user_result = new UserResult(response.results[i]);
          this.user_results_view.collection.add(user_result);
        }
      }

      if (response.results.length != 0) {
        $(window).bind("scroll", this.pagenation.load);
      }
    },
    changeTarget: function (e) {
      e.preventDefault();
      var search_word     = this.username.val();
      var current_user_id = $("#wrapper").data("userid");

      if (search_word && search_word != "") {
        location.href = "/users/" + current_user_id + "/search_game_or_user?search_word=" + search_word + "#game";
      } else {
        location.href = "/users/" + current_user_id + "/search_game_or_user#game";
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