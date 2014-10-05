//= require ../../models/game_result.js
//= require ../../models/user_result.js
//= require ../../collections/game_results.js
//= require ../../collections/user_results.js
//= require ../../views/game_result_view.js
//= require ../../views/game_results_view.js
//= require ../../views/user_result_view.js
//= require ../../views/user_results_view.js
//= require ../../libs/profile_upload.js

(function () {
  var FirstView = Backbone.View.extend({
    el: $(".setting-page"),
    events: {
      "keypress .search": "search",
      "click .next-page": "next"
    },
    template: _.template($("#first-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "pagenation");

      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection});
      this.search_title           = this.$(".search-title-input");
      this.current_search_title   = null;

      var tmp                     = location.href.split("#")[0].split("/");
      this.user_id                = tmp.pop() && tmp.pop();
      this.page                   = 1;
    },
    search: function (e) {
      if (e.which == 13 && this.search_title.val()) {
        e.preventDefault();

        var that                  = this;
        this.page                 = 1;
        this.current_search_title = this.search_title.val();

        this.game_result_collection.fetch({
          data: {search_title: this.current_search_title, page: this.page},
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
          data: {search_title: this.current_search_title, page: this.page},
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
    next: function (e) {
      e.preventDefault();
      location.href = "/users/" + this.user_id + "/setting#second";
    }
  })

  var SecondView = Backbone.View.extend({
    el: $(".setting-page"),
    events: {
      "keypress .user-input": "search",
      "click .next-page":     "next"
    },
    template: _.template($("#second-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "pagenation");

      this.user_result_collection  = new UserResults();
      this.user_results_view       = new UserResultsView({el: ".user-list", collection: this.user_result_collection});
      this.username                = this.$(".user-input");
      this.current_username        = null

      var tmp                      = location.href.split("#")[0].split("/");
      this.user_id                 = tmp.pop() && tmp.pop();
      this.page                    = 1;
    },
    search: function (e) {
      if (e.which == 13 && this.username.val()) {
        e.preventDefault();

        var that              = this;
        this.page             = 1;
        this.current_username = this.username.val()

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
        })
      }
    },
    next: function (e) {
      e.preventDefault();
      location.href = "/users/" + this.user_id + "/setting#third";
    }
  })


  var ThirdView = Backbone.View.extend({
    el: $(".setting-page"),
    events: {
      "click .next-page": "next"
    },
    template: _.template($("#third-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      var tmp      = location.href.split("#")[0].split("/");
      this.user_id = tmp.pop() && tmp.pop();

      this.upload  = new ProfileUpload("upload-btn", "thumbnail", this.user_id);
    },
    next: function (e) {
      e.preventDefault();
      location.href = "/posts";
    }
  })



  /* ---------- Router --------- */

  var Router = Backbone.Router.extend({
    routes: {
      "first":  "first",
      "second": "second",
      "third":  "third"
    },
    first: function () {
      this.current_app = new FirstView();
    },
    second: function () {
      this.current_app = new SecondView();
    },
    third: function () {
      this.current_app = new ThirdView();
    }
  })

  var router = new Router();
  Backbone.history.start();
})();