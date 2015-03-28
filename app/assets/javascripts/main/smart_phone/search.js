//= require ../../views/game_result_view
//= require ../../views/game_results_view
//= require ../../views/user_result_view
//= require ../../views/user_results_view
//= require ../../views/user_view
//= require ../../views/users_view
//= require ../../views/game_view
//= require ../../views/games_view

(function () {
  var GameSearchView = Backbone.View.extend({
    el: ".search-page",
    events: {
      "keypress .game-title-input": "searchWithEnter",
      "click .change-target-link":  "changeTarget"
    },
    template: _.template($("#game-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection});
      this.game_collection        = new Games();
      this.games_view             = new GamesView({el: ".game-activity-list", collection: this.game_collection, attributes: {type: "activity", template: "#game-activity-template"}});

      this.game_title             = this.$(".game-title-input");
      this.current_game_title     = null;

      if (url_query.getQueryString()) {
        this.current_game_title = url_query.getQueryString().search_word;
        this.game_title.val(this.current_game_title);
        this.search();
      }

      this.games_view.getActivity({type: "activity"});
    },
    search: function () {
      var that  = this;

      this.game_results_view.search({search_title: this.current_game_title, page: 1}, function (response) {
        that.hideActivity();
        that.$(".result-area").html((that.text_template({
          result_count: response.count
        })));
      });
    },
    searchWithEnter: function (e) {
      if (e.which == 13 && this.game_title.val()) {
        e.preventDefault();
        this.current_game_title = this.game_title.val();
        url_query.insertParam("search_word", this.current_game_title);
      }
    },
    hideActivity: function () {
      $(".game-activity-list-wrap").html("");
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
      "keypress .username-input":  "searchWithEnter",
      "click .change-target-link": "changeTarget"
    },
    template: _.template($("#user-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      var that = this;

      this.$el.html("");
      this.$el.append(this.template);

      this.user_result_collection = new UserResults();
      this.user_results_view      = new UserResultsView({el: ".result-list", collection: this.user_result_collection});
      this.user_collection        = new Users();
      this.users_view             = new UsersView({el: ".user-activity-list", collection: this.user_collection, attributes: {type: "activity", template: "#user-activity-template"}});

      this.username               = this.$(".username-input");
      this.current_username       = null;

      if (url_query.getQueryString()) {
        this.current_username = url_query.getQueryString().search_word;
        this.username.val(this.current_username);
        this.search();
      }

      this.users_view.renderAll({page: 1, type: "activity"});
    },
    search: function () {
      var that  = this;

      this.user_results_view.search({username: this.current_username, page: 1}, function (response) {
        that.hideActivity();
        that.$(".result-area").html((that.text_template({
          result_count: response.count
        })));
      });
    },
    searchWithEnter: function (e) {
      if (e.which == 13 && this.username.val()) {
        e.preventDefault();
        this.current_username = this.username.val();
        url_query.insertParam("search_word", this.current_username);
      }
    },
    hideActivity: function () {
      $(".user-activity-list-wrap").html("");
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