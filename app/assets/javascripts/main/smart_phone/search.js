//= require ../../libs/socket.js
//= require ../../libs/url_query.js
//= require ../../models/game_result.js
//= require ../../models/user_result.js
//= require ../../models/user.js
//= require ../../collections/game_results.js
//= require ../../collections/user_results.js
//= require ../../collections/users.js
//= require ../../views/game_result_view
//= require ../../views/game_results_view
//= require ../../views/user_result_view
//= require ../../views/user_results_view
//= require ../../views/user_view
//= require ../../views/users_view

(function () {

  var GameSearchView = Backbone.View.extend({
    el: $(".search-page"),
    events: {
      "keypress .game-title-input": "searchWithEnter",
      "click .change-target-link":  "changeTarget"
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

      if (url_query.getQueryString()) {
        this.current_game_title = url_query.getQueryString().search_word;
        this.game_title.val(this.current_game_title);
        this.search();
      }
    },
    search: function () {
      var that  = this;
      this.page = 1;

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

          that.$(".result-area").html((that.text_template({
            result_count: response.count
          })));
        },
        error: function () {

        }
      })

      $(window).unbind("scroll");
      $(window).bind("scroll", this.pagenation);
    },
    searchWithEnter: function (e) {
      if (e.which == 13 && this.game_title.val()) {
        e.preventDefault();
        this.current_game_title = this.game_title.val();
        url_query.insertParam("search_word", this.current_game_title);
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
  })

  var UserSearchView = Backbone.View.extend({
    el: $(".search-page"),
    events: {
      "keypress .username-input":  "searchWithEnter",
      "click .change-target-link": "changeTarget"
    },
    template: _.template($("#user-search-template").html()),
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "pagenation");

      this.user_result_collection = new UserResults();
      this.user_results_view      = new UserResultsView({el: ".result-list", collection: this.user_result_collection});
      this.user_collection        = new Users();
      this.users_view             = new UsersView({el: ".user-activity-list", collection: this.user_collection, attributes: {type: "activity", template: "#user-activity-template"}});

      this.username               = this.$(".username-input");
      this.current_username       = null;
      this.page                   = 1;

      if (url_query.getQueryString()) {
        this.current_username = url_query.getQueryString().search_word;
        this.username.val(this.current_username);
        this.search();
      }

      var that = this;

      this.user_collection.fetch({
        data: {page: 1, type: "activity"},
        success: function (model, response, options) {
          for (var i = 0; i < response.users.length; i++) {
            var user = new User(response.users[i]);
            user.strimWidth(30);
            that.users_view.collection.add(user);
          }
        },
        error: function () {

        }
      })
    },
    search: function () {
      var that  = this;
      this.page = 1;

      this.user_result_collection.fetch({
        data: {username: this.current_username, page: this.page},
        success: function (model, response, options) {
          that.hideActivity();

          that.user_result_collection.reset();
          that.user_results_view.$el.html("");
          if (response.results && response.results.length > 0) {
            for (var i = 0; i < response.results.length; i++) {
              var user_result = new UserResult(response.results[i]);
              that.user_results_view.collection.add(user_result);
            }
          }

          that.$(".result-area").html((that.text_template({
            result_count: response.count
          })));
        },
        error: function () {

        }
      });

      $(window).unbind("scroll");
      $(window).bind("scroll", this.pagenation);
    },
    searchWithEnter: function (e) {
      if (e.which == 13 && this.username.val()) {
        e.preventDefault();
        this.current_username = this.username.val();
        url_query.insertParam("search_word", this.current_username);
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