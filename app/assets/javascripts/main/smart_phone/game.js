//= require ../../libs/socket.js
//= require ../../models/post.js
//= require ../../models/comment.js
//= require ../../collections/posts.js
//= require ../../collections/comments.js
//= require ../../views/delete_confirm_view.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/comment_view.js
//= require ../../views/comments_view.js


(function () {

  var AllPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "click .cancel-modal-btn":   "hideComment",
      "click .submit-comment-btn": "postComment"
    },
    initialize: function () {
      this.$(".post-list").html("");
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.all-posts").addClass("current");

      _.bindAll(this, "pagenation", "showComment");

      var that                = this;
      this.post_collection    = new Posts();
      this.comment_collection = null;
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});
      this.comments_view      = new CommentsView({collection: this.comment_collection});
      this.comment_input      = this.$(".comment-input");

      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      event_handle.discribe("showComment", this.showComment);

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
    showComment: function (model) {
      this.commented_post_model = model;
      this.comment_collection   = new Comments(model.get("post_comments"));
      this.comments_view        = new CommentsView({collection: this.comment_collection});

      $(".comment-modal").css("display", "block");
      $(".layer").css("display", "block");
    },
    hideComment: function () {
      this.commented_post_model = null;
      this.comment_collection   = null;
      this.comments_view        = null;

      this.comment_input.val("");

      $(".comment-modal").css("display", "none");
      $(".layer").css("display", "none");
    },
    postComment: function () {
      if (this.comment_input.val() != "") {
        var that = this;

        var data = {
          "post_comment": {
            "post_id":    this.commented_post_model.id,
            "text":       this.comment_input.val(),
            "to_user_id": this.commented_post_model.get("user").id
          }
        }

        this.comment_collection.create(data, {
          method: "POST",
          success: function (response) {
            var comment = new Comment(response.get("comment"));
            that.comments_view.collection.add(comment);
            that.commented_post_model.get("post_comments").push(response.get("comment"));
            that.commented_post_model.set("post_comments_count", that.commented_post_model.get("post_comments_count") + 1);

            that.comment_input.val("");

            var data = {
              type: "comment",
              comment: response.get("comment"),
              post_id: that.commented_post_model.id,
              from_user_id: comment_socket.user_id,
              to_user_id: that.commented_post_model.get("user").id
            }

            comment_socket.send(data);

          },
          error: function () {

          }
        })
      }
    },
    unbindEvent: function () {
      $(this.el).undelegate('.cancel-modal-btn', 'click');
      $(this.el).undelegate('.submit-comment-btn', 'click');
    }
  })

  var FollowerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "click .cancel-modal-btn":   "hideComment",
      "click .submit-comment-btn": "postComment"
    },
    initialize: function () {
      this.$(".post-list").html("");
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.follower-posts").addClass("current");

      _.bindAll(this, "pagenation", "showComment");

      var that                = this;
      this.post_collection    = new Posts();
      this.comment_collection = null;
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});
      this.comments_view      = new CommentsView({collection: this.comment_collection});
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
    showComment: function (model) {
      this.commented_post_model = model;
      this.comment_collection   = new Comments(model.get("post_comments"));
      this.comments_view        = new CommentsView({collection: this.comment_collection});

      $(".comment-modal").css("display", "block");
      $(".layer").css("display", "block");
    },
    hideComment: function () {
      this.commented_post_model = null;
      this.comment_collection   = null;
      this.comments_view        = null;

      this.comment_input.val("");

      $(".comment-modal").css("display", "none");
      $(".layer").css("display", "none");
    },
    postComment: function () {
      if (this.comment_input.val() != "") {
        var that = this;

        var data = {
          "post_comment": {
            "post_id":    this.commented_post_model.id,
            "text":       this.comment_input.val(),
            "to_user_id": this.commented_post_model.get("user").id
          }
        }

        this.comment_collection.create(data, {
          method: "POST",
          success: function (response) {
            var comment = new Comment(response.get("comment"));
            that.comments_view.collection.add(comment);
            that.commented_post_model.get("post_comments").push(response.get("comment"));
            that.commented_post_model.set("post_comments_count", that.commented_post_model.get("post_comments_count") + 1);

            that.comment_input.val("");

            var data = {
              type: "comment",
              comment: response.get("comment"),
              post_id: that.commented_post_model.id,
              from_user_id: comment_socket.user_id,
              to_user_id: that.commented_post_model.get("user").id
            }

            comment_socket.send(data);

          },
          error: function () {

          }
        })
      }
    },
    unbindEvent: function () {
      $(this.el).undelegate('.cancel-modal-btn', 'click');
      $(this.el).undelegate('.submit-comment-btn', 'click');
    }
  })

  var LikerPostListView = Backbone.View.extend({
    el: ".game-page",
    events: {
      "click .cancel-modal-btn":   "hideComment",
      "click .submit-comment-btn": "postComment"
    },
    initialize: function () {
      this.$(".post-list").html("");
      this.$el.find("ul.sort-box li").removeClass("current");
      this.$el.find("ul.sort-box li.liker-posts").addClass("current");

      _.bindAll(this, "pagenation", "showComment");

      var that                = this;
      this.post_collection    = new Posts();
      this.comment_collection = null;
      this.posts_view         = new PostsView({el: ".post-list", collection: this.post_collection});
      this.comments_view      = new CommentsView({collection: this.comment_collection});
      this.comment_input      = this.$(".comment-input");

      this.game_id            = $(".game-page").data("gameid");
      this.page               = 1;

      event_handle.discribe("showComment", this.showComment);


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
    showComment: function (model) {
      this.commented_post_model = model;
      this.comment_collection   = new Comments(model.get("post_comments"));
      this.comments_view        = new CommentsView({collection: this.comment_collection});

      $(".comment-modal").css("display", "block");
      $(".layer").css("display", "block");
    },
    hideComment: function () {
      this.commented_post_model = null;
      this.comment_collection   = null;
      this.comments_view        = null;

      this.comment_input.val("");

      $(".comment-modal").css("display", "none");
      $(".layer").css("display", "none");
    },
    postComment: function () {
      if (this.comment_input.val() != "") {
        var that = this;

        var data = {
          "post_comment": {
            "post_id":    this.commented_post_model.id,
            "text":       this.comment_input.val(),
            "to_user_id": this.commented_post_model.get("user").id
          }
        }

        this.comment_collection.create(data, {
          method: "POST",
          success: function (response) {
            var comment = new Comment(response.get("comment"));
            that.comments_view.collection.add(comment);
            that.commented_post_model.get("post_comments").push(response.get("comment"));
            that.commented_post_model.set("post_comments_count", that.commented_post_model.get("post_comments_count") + 1);

            that.comment_input.val("");

            var data = {
              type: "comment",
              comment: response.get("comment"),
              post_id: that.commented_post_model.id,
              from_user_id: comment_socket.user_id,
              to_user_id: that.commented_post_model.get("user").id
            }

            comment_socket.send(data);

          },
          error: function () {

          }
        })
      }
    },
    unbindEvent: function () {
      $(this.el).undelegate('.cancel-modal-btn', 'click');
      $(this.el).undelegate('.submit-comment-btn', 'click');
    }
  })

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

      $.ajax({
        type: "POST",
        url: "/api/logs",
        data: data,
        success: function (data) {
          that.new_status_select.addClass("registed");
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
      event_handle.destroy("showComment");
      if (this.current_list) {
        this.current_list.unbindEvent();
      }
      this.current_list = new AllPostListView();
    },
    follower: function () {
      event_handle.destroy("showComment");
      if (this.current_list) {
        this.current_list.unbindEvent();
      }
      this.current_list = new FollowerPostListView();
    },
    liker: function () {
      event_handle.destroy("showComment");
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