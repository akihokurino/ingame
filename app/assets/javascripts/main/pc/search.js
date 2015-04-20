//= require ../../views/game_result_view
//= require ../../views/game_results_view
//= require ../../views/user_result_view
//= require ../../views/user_results_view


(function () {
  var GameSearchView = Backbone.View.extend({
    el: ".search-page",
    events: {
      "click .search-btn":          "clickSearchBtn",
      "keypress .game-title-input": "searchWithEnter",
      "click .change-target-link":  "changeTarget"
    },
    template: _.template($("#game-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection, attributes: {type: null}});

      this.game_title             = this.$(".game-title-input");
      this.current_game_title     = null;

      if (url_query.getQueryString()) {
        this.current_game_title = url_query.getQueryString().search_word;
        this.game_title.val(this.current_game_title);
        this.search();
      }
    },
    search: function () {
      var that  = this;

      this.game_results_view.search({search_title: this.current_game_title, page: 1}, function (response) {
        that.$(".result-area").html((that.text_template({
          search_title: that.current_game_title, target: "ゲーム", result_count: response.count
        })));
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
    changeTarget: function (e) {
      e.preventDefault();
      var search_word = this.game_title.val();

      if (search_word && search_word != "") {
        location.href = "/search?search_word=" + search_word + "#user";
      } else {
        location.href = "/search#user";
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
      this.$el.html("");
      this.$el.append(this.template);

      this.user_result_collection = new UserResults();
      this.user_results_view      = new UserResultsView({el: ".result-list", collection: this.user_result_collection, attributes: {type: null}});

      this.username               = this.$(".username-input");
      this.current_username       = null;

      if (url_query.getQueryString()) {
        this.current_username = url_query.getQueryString().search_word;
        this.username.val(this.current_username);
        this.search();
      }
    },
    search: function () {
      var that  = this;

      this.user_results_view.search({username: this.current_username, page: 1}, function (response) {
        that.$(".result-area").html((that.text_template({
          search_title: that.current_username, target: "ユーザー", result_count: response.count
        })));
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
    changeTarget: function (e) {
      e.preventDefault();
      var search_word = this.username.val();

      if (search_word && search_word != "") {
        location.href = "/search?search_word=" + search_word + "#game";
      } else {
        location.href = "/search#game";
      }
    }
  });


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
  });

  var router = new Router();
  Backbone.history.start();
})();