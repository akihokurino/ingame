//= require ../../models/post.js
//= require ../../collections/posts.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js


(function () {

  var AppView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "change .my_status":     "changeStatus",
      "change .new_status":    "registLog",
      "change .my_rate":       "changeRate",
      "click .follower_posts": "setFollowerPosts",
      "click .all_posts":      "setAllPosts",
      "click .liker_posts":    "setLikerPosts"
    },
    initialize: function () {
      var that               = this;
      this.post_collection   = new Posts();
      this.posts_view        = new PostsView({collection: this.post_collection});
      this.game_id           = $(".game-page").data("gameid");

      this.my_status_select  = $(".my_status");
      this.new_status_select = $(".new_status");
      this.my_rate_select    = $(".my_rate");

      this.follower_posts    = [];
      this.all_posts         = [];
      this.liker_posts       = [];

      $.ajax({
        type: "GET",
        url: "/api/posts/index_of_game?game_id=" + this.game_id,
        data: {},
        success: function (data) {
          for (var i = 0; i < data.follower_posts.length; i++) {
            var post = new Post(data.follower_posts[i]);
            that.follower_posts.push(post);
            that.posts_view.collection.add(post)
          }

          for (var i = 0; i < data.all_posts.length; i++) {
            var post = new Post(data.all_posts[i]);
            that.all_posts.push(post);
          }

          for (var i = 0; i < data.liker_posts.length; i++) {
            var post = new Post(data.liker_posts[i]);
            that.liker_posts.push(post);
          }
        },
        error: function () {

        }
      })
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
      var data = {
        "log": {
          "game_id": this.game_id,
          "status_id": this.new_status_select.val()
        }
      }

      $.ajax({
        type: "POST",
        url: "/api/logs",
        data: data,
        success: function () {

        },
        error: function () {

        }
      })
    },
    setFollowerPosts: function () {
      this.posts_view.collection.reset();
      this.posts_view.removePosts();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.follower_posts.length; i++) {
        this.posts_view.collection.add(this.follower_posts[i]);
      }
      this.$el.find("ul.sortBox li.follower_posts").addClass("current");
    },
    setAllPosts: function () {
      this.posts_view.collection.reset();
      this.posts_view.removePosts();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.all_posts.length; i++) {
        this.posts_view.collection.add(this.all_posts[i]);
      }
      this.$el.find("ul.sortBox li.all_posts").addClass("current");
    },
    setLikerPosts: function () {
      this.posts_view.collection.reset();
      this.posts_view.removePosts();
      this.$el.find("ul.sortBox li").removeClass("current");
      for (var i = 0; i < this.liker_posts.length; i++) {
        this.posts_view.collection.add(this.liker_posts[i]);
      }
      this.$el.find("ul.sortBox li.liker_posts").addClass("current");
    }
  })

  var app = new AppView();
})();