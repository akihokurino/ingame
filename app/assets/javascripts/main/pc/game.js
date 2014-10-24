//= require ../../libs/socket.js
//= require ../../models/post.js
//= require ../../collections/posts.js
//= require ../../views/delete_confirm_view.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js



(function () {
  var AllPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.$(".post-list").html("");
      this.$el.find("ul.sortList li").removeClass("current");
      this.$el.find("ul.sortList li.all_posts").addClass("current");

      _.bindAll(this, "pagenation");

      var that                = this;
      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});

      this.comment_input      = this.$(".comment-input");

      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      this.post_collection.fetch({
        data: {type: "all_of_game", page: this.page, game_id: this.game_id},
        success: function (model, response, options) {
          for (var i = 0; i < response.posts.length; i++) {
            var post = new Post(response.posts[i]);
            that.posts_view.collection.add(post);
          }
        },
        error: function () {

        }
      })

      $(window).bind("scroll", this.pagenation);
    },
    pagenation: function () {
      var that           = this;
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();
      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");
        this.page += 1;

        this.post_collection.fetch({
          data: {type: "all_of_game", page: this.page, game_id: this.game_id},
          success: function (model, response, options) {
            for (var i = 0; i < response.posts.length; i++) {
              var post = new Post(response.posts[i]);
              that.posts_view.collection.add(post);
            }

            $(".loading-gif").css("display", "none");

            if (response.posts.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    },
    unbindEvent: function () {

    }
  })

  var FollowerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.$(".post-list").html("");
      this.$el.find("ul.sortList li").removeClass("current");
      this.$el.find("ul.sortList li.follower_posts").addClass("current");

      _.bindAll(this, "pagenation");

      var that                = this;
      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});

      this.comment_input      = this.$(".comment-input");

      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      event_handle.discribe("showComment", this.showComment);


      this.post_collection.fetch({
        data: {type: "follower_of_game", page: this.page, game_id: this.game_id},
        success: function (model, response, options) {
          for (var i = 0; i < response.posts.length; i++) {
            var post = new Post(response.posts[i]);
            that.posts_view.collection.add(post);
          }
        },
        error: function () {

        }
      })

      $(window).bind("scroll", this.pagenation);
    },
    pagenation: function () {
      var that           = this;
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();
      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");
        this.page += 1;

        this.post_collection.fetch({
          data: {type: "follower_of_game", page: this.page, game_id: this.game_id},
          success: function (model, response, options) {
            for (var i = 0; i < response.posts.length; i++) {
              var post = new Post(response.posts[i]);
              that.posts_view.collection.add(post);
            }

            $(".loading-gif").css("display", "none");

            if (response.posts.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    },
    unbindEvent: function () {

    }
  })

  var LikerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {

    },
    initialize: function () {
      this.$(".post-list").html("");
      this.$el.find("ul.sortList li").removeClass("current");
      this.$el.find("ul.sortList li.liker_posts").addClass("current");

      _.bindAll(this, "pagenation");

      var that                = this;
      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});

      this.comment_input      = this.$(".comment-input");

      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      this.post_collection.fetch({
        data: {type: "liker_of_game", page: this.page, game_id: this.game_id},
        success: function (model, response, options) {
          for (var i = 0; i < response.posts.length; i++) {
            var post = new Post(response.posts[i]);
            that.posts_view.collection.add(post);
          }
        },
        error: function () {

        }
      })

      $(window).bind("scroll", this.pagenation);
    },
    pagenation: function () {
      var that           = this;
      var scrollHeight   = $(document).height();
      var scrollPosition = $(window).height() + $(window).scrollTop();
      if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
        $(".loading-gif").css("display", "block");
        $(window).unbind("scroll");
        this.page += 1;

        this.post_collection.fetch({
          data: {type: "liker_of_game", page: this.page, game_id: this.game_id},
          success: function (model, response, options) {
            for (var i = 0; i < response.posts.length; i++) {
              var post = new Post(response.posts[i]);
              that.posts_view.collection.add(post);
            }

            $(".loading-gif").css("display", "none");

            if (response.posts.length != 0) {
              $(window).bind("scroll", that.pagenation);
            }
          },
          error: function () {

          }
        })
      }
    },
    unbindEvent: function () {

    }
  })

  var AppView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "change .my_status":  "changeStatus",
      "change .new_status": "registLog",
      "change .my_rate":    "changeRate",
    },
    initialize: function () {
      var that               = this;
      this.game_id           = $(".game-page").data("gameid");

      this.my_status_select  = $(".my_status");
      this.new_status_select = $(".new_status");
      this.my_rate_select    = $(".my_rate");
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
    }
  })


  /* ---------- Router ---------- */
  var Router = Backbone.Router.extend({
    routes: {
      "all":      "all",
      "follower": "follower",
      "liker":    "liker"
    },
    all: function () {
      if (this.current_list) {
        this.current_list.unbindEvent();
      }
      this.current_list = new AllPostListView();
    },
    follower: function () {
      if (this.current_list) {
        this.current_list.unbindEvent();
      }
      this.current_list = new FollowerPostListView();
    },
    liker: function () {
      if (this.current_list) {
        this.current_list.unbindEvent();
      }
      this.current_list = new LikerPostListView();
    }
  })


  var app    = new AppView();
  var router = new Router();
  Backbone.history.start();
})();