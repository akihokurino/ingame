//= require ../../views/game_result_view.js
//= require ../../views/game_results_view.js
//= require ../../views/user_result_view.js
//= require ../../views/user_results_view.js

(function () {
  var FirstView = Backbone.View.extend({
    el: $(".setting-page"),
    events: {
      "keypress .search-title-input": "search",
      "click .next-page":             "next"
    },
    template: _.template($("#first-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      _.bindAll(this, "setGameResultCollection");

      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection, attributes: {type: "setting"}});

      this.search_title           = this.$(".search-title-input");
      this.current_search_title   = null;
      this.user_id                = $("#wrapper").data("userid");
      this.page                   = 1;
    },
    search: function (e) {
      if (e.which == 13 && this.search_title.val()) {
        e.preventDefault();
        $(window).unbind("scroll");
        var that                  = this;
        this.page                 = 1;
        this.current_search_title = this.search_title.val();

        this.game_result_collection.fetch({
          data: {search_title: this.current_search_title, page: this.page},
          success: function (model, response, options) {
            that.pagenation = new Pagenation(that.game_result_collection, {search_title: that.current_search_title, page: that.page}, that.setGameResultCollection);

            that.game_result_collection.reset();
            that.game_results_view.$el.html("");
            that.setGameResultCollection(model, response, options);
          },
          error: function () {

          }
        });
      }
    },
    setGameResultCollection: function (model, response, option) {
      if (response.results && response.results.length > 0) {
        for (var i = 0; i < response.results.length; i++) {
          var game_result = new GameResult(response.results[i]);
          this.game_results_view.collection.add(game_result);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
    },
    next: function (e) {
      e.preventDefault();
      location.href = "/users/" + this.user_id + "/setting#second";
    }
  });

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

      _.bindAll(this, "setUserResultCollection");

      this.user_result_collection  = new UserResults();
      this.user_results_view       = new UserResultsView({el: ".user-list", collection: this.user_result_collection});

      this.username                = this.$(".user-input");
      this.current_username        = null
      this.user_id                 = $("#wrapper").data("userid");
      this.page                    = 1;
    },
    search: function (e) {
      if (e.which == 13 && this.username.val()) {
        e.preventDefault();
        $(window).unbind("scroll");
        var that              = this;
        this.page             = 1;
        this.current_username = this.username.val()

        this.user_result_collection.fetch({
          data: {username: this.current_username, page: this.page},
          success: function (model, response, options) {
            that.pagenation = new Pagenation(that.user_result_collection, {username: that.current_username, page: that.page}, that.setUserResultCollection);

            that.user_result_collection.reset();
            that.user_results_view.$el.html("");
            that.setUserResultCollection(model, response, options);
          },
          error: function () {

          }
        });
      }
    },
    setUserResultCollection: function (model, response, option) {
      if (response.results && response.results.length > 0) {
        for (var i = 0; i < response.results.length; i++) {
          var user_result = new UserResult(response.results[i]);
          this.user_results_view.collection.add(user_result);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
    },
    next: function (e) {
      e.preventDefault();
      location.href = "/users/" + this.user_id + "/setting#third";
    }
  });


  var ThirdView = Backbone.View.extend({
    el: $(".setting-page"),
    events: {
      "click .next-page": "next",
      "change #upload-btn": "showClipModal",
      "click .cancel-clip": "hideClipModal",
      "click .done-clip":   "clip"
    },
    template: _.template($("#third-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      this.user_id = $("#wrapper").data("userid");

      this.upload  = new ProfileUpload("upload-btn", "clip-area", this.user_id, null);
    },
    next: function (e) {
      e.preventDefault();

      location.href = "/posts";
    },
    showClipModal: function () {
      this.$(".clip-box").css("display", "block");
    },
    hideClipModal: function () {
      this.upload.reset();
      this.$(".clip-box").css("display", "none");
    },
    clip: function () {
      var that = this;

      if (this.upload.file) {
        var data = {
          "user": {
            "photo_path": this.upload.file,
            "clip_x":     this.upload.clip_x,
            "clip_y":     this.upload.clip_y
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/users/" + this.user_id,
          data: data,
          success: function (data) {
            that.hideClipModal();
            if (data.error) {
              switch (data.error.type) {
                case "photo":
                  break;
              }
              $(".error-message").html(data.error.message);
            } else if (data.result && data.result.photo_path) {
              var img = $("<img src='/user_photos/" + data.result.photo_path + "' width='157' height='157'>");
              $("#thumbnail").html(img);
              $(".error-message").html("");
              $(".next-page").html("初期設定を完了");
            }
          },
          error: function () {

          }
        });
      }
    }
  });



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
  });

  var router = new Router();
  Backbone.history.start();
})();