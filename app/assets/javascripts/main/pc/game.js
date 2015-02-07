//= require ../../libs/socket.js
//= require ../../libs/pagenation.js
//= require ../../models/post.js
//= require ../../collections/posts.js
//= require ../../views/custom_modal_view.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js



(function () {
  var AllPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      var that = this;

      $(window).unbind("scroll");
      this.$(".post-list").html("");

      this.setCurrentTab();

      _.bindAll(this, "setPostCollection");

      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});

      this.comment_input      = this.$(".comment-input");
      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      this.pagenation         = new Pagenation(this.post_collection, {type: "all_of_game", game_id: this.game_id}, this.setPostCollection);

      this.post_collection.fetch({
        data: {type: "all_of_game", page: this.page, game_id: this.game_id},
        success: function (model, response, options) {
          that.setPostCollection(model, response, options);
        },
        error: function () {

        }
      });
    },
    setPostCollection: function (model, response, option) {
      if (response.posts && response.posts.length > 0) {
        for (var i = 0; i < response.posts.length; i++) {
          var post = new Post(response.posts[i]);
          this.posts_view.collection.add(post);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-list li").removeClass("current");
      this.$el.find("ul.sort-list li.all-posts").addClass("current");
    }
  });

  var FollowerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      var that = this;

      $(window).unbind("scroll");
      this.$(".post-list").html("");

      this.setCurrentTab();

      _.bindAll(this, "setPostCollection");

      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});

      this.comment_input      = this.$(".comment-input");
      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      this.pagenation         = new Pagenation(this.post_collection, {type: "follower_of_game", game_id: this.game_id}, this.setPostCollection);


      this.post_collection.fetch({
        data: {type: "follower_of_game", page: this.page, game_id: this.game_id},
        success: function (model, response, options) {
          that.setPostCollection(model, response, options);
        },
        error: function () {

        }
      });
    },
    setPostCollection: function (model, response, option) {
      if (response.posts && response.posts.length > 0) {
        for (var i = 0; i < response.posts.length; i++) {
          var post = new Post(response.posts[i]);
          this.posts_view.collection.add(post);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-list li").removeClass("current");
      this.$el.find("ul.sort-list li.follower-posts").addClass("current");
    }
  });

  var LikerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      var that = this;

      $(window).unbind("scroll");
      this.$(".post-list").html("");

      this.setCurrentTab();

      _.bindAll(this, "setPostCollection");

      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});

      this.comment_input      = this.$(".comment-input");
      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      this.pagenation         = new Pagenation(this.post_collection, {type: "liker_of_game", game_id: this.game_id}, this.setPostCollection);

      this.post_collection.fetch({
        data: {type: "liker_of_game", page: this.page, game_id: this.game_id},
        success: function (model, response, options) {
          that.setPostCollection(model, response, options);
        },
        error: function () {

        }
      });
    },
    setPostCollection: function (model, response, option) {
      if (response.posts && response.posts.length > 0) {
        for (var i = 0; i < response.posts.length; i++) {
          var post = new Post(response.posts[i]);
          this.posts_view.collection.add(post);
        }

        $(window).bind("scroll", this.pagenation.load);
      }
    },
    setCurrentTab: function () {
      this.$el.find("ul.sort-list li").removeClass("current");
      this.$el.find("ul.sort-list li.liker-posts").addClass("current");
    }
  });

  var AppView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "change .my-status":  "changeStatus",
      "change .new-status": "registLog",
      "change .my-rate":    "changeRate",
    },
    initialize: function () {
      var that               = this;
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
        });
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
        });
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
        success: function () {
          that.new_status_select.removeClass("new-status").addClass("registed").addClass("my-status");
        },
        error: function () {
        }
      });
    }
  });


  /* ---------- Router ---------- */
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