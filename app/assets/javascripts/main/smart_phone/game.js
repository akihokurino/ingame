//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/comment_view.js
//= require ../../views/comments_view.js
//= require ../../views/comment_modal_view.js


(function () {

  var AllPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.setCurrentTab();

      this.post_collection = new Posts();
      this.posts_view      = new PostsView({el: ".post-list", collection: this.post_collection});

      this.game_id         = $(".game-page").data("gameid");

      this.posts_view.render({type: "all_of_game", game_id: this.game_id, page: 1});
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.all-posts").addClass("current");
    }
  });

  var FollowerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.setCurrentTab();

      this.post_collection = new Posts();
      this.posts_view      = new PostsView({el: ".post-list", collection: this.post_collection});

      this.game_id         = $(".game-page").data("gameid");

      this.posts_view.render({type: "follower_of_game", game_id: this.game_id, page: 1});
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.follower-posts").addClass("current");
    }
  });

  var LikerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.setCurrentTab();

      this.post_collection = new Posts();
      this.posts_view      = new PostsView({el: ".post-list", collection: this.post_collection});

      this.game_id         = $(".game-page").data("gameid");

      this.posts_view.render({type: "liker_of_game", game_id: this.game_id, page: 1});
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.liker-posts").addClass("current");
    }
  });

  var AppView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "change .my-status":  "changeStatus",
      "change .new-status": "registLog",
      "change .my-rate":    "changeRate",
      "click .delete-log-btn": "showDeleteConfirm"
    },
    initialize: function () {
      _.bindAll(this, "destroyLog");

      this.game_id           = $(".game-page").data("gameid");
      this.my_status_select  = $(".my-status");
      this.new_status_select = $(".new-status");
      this.my_rate_select    = $(".my-rate");
    },
    changeRate: function () {
      if (this.my_rate_select.val() != "") {
        var data = {
          "log": {
            "rate": this.my_rate_select.val()
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/logs/" + this.game_id + "/update_status_or_rate",
          data: data,
          success: function (data) {

          },
          error: function () {

          }
        })
      }
    },
    changeStatus: function () {
      if (this.my_status_select.val() != "") {
        var data = {
          "log": {
            "status_id": this.my_status_select.val()
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/logs/" + this.game_id + "/update_status_or_rate",
          data: data,
          success: function (data) {

          },
          error: function () {

          }
        })
      }
    },
    registLog: function () {
      var that = this;
      var data = {
        "log": {
          "game_id": this.game_id,
          "status_id": this.new_status_select.val()
        }
      }

      if (req) {
        req.abort();
      }

      var req = $.ajax({
        type: "POST",
        url: "/api/logs",
        data: data,
        success: function (data) {
          that.new_status_select.removeClass("new-status").addClass("registed").addClass("my-status");
        },
        error: function () {

        }
      })
    },
    destroyLog: function () {
      var that = this;
      $.ajax({
        type: "DELETE",
        url: "/api/logs/" + this.game_id,
        data: {},
        success: function (data) {
          location.reload();
        },
        error: function () {

        }
      })
    },
    showDeleteConfirm: function () {
      var custom_modal_view = new CustomModalView({
        attributes: {
          view: null,
          target: "ゲーム",
          desc: "このゲームに関する投稿データもすべて削除されます",
          callback: this.destroyLog,
          template: _.template($("#delete-confirm-template").html()),
          className: "deleteConfirmModal",
        }
      });
    }
  });


  var Router = Backbone.Router.extend({
    routes: {
      "all":      "all",
      "follower": "follower",
      "liker":    "liker"
    },
    all: function () {
      this.current_list = new AllPostListView();
    },
    follower: function () {
      this.current_list = new FollowerPostListView();
    },
    liker: function () {
      this.current_list = new LikerPostListView();
    }
  });


  var app    = new AppView();
  var router = new Router();
  Backbone.history.start();
})();