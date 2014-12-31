//= require ../../libs/socket.js
//= require ../../libs/pagenation.js
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
  var AppView = Backbone.View.extend({
    el: ".timeline-page",
    events: {
      "click .cancel-modal-btn":   "hideComment",
      "click .submit-comment-btn": "postComment"
    },
    initialize: function () {
      _.bindAll(this, "showComment", "setPostCollection");

      var that                = this;
      this.post_collection    = new Posts();
      this.comment_collection = null;
      this.posts_view         = new PostsView({collection: this.post_collection});
      this.comments_view      = new CommentsView({collection: this.comment_collection});
      this.comment_input      = this.$(".comment-input");

      this.page               = 1;

      event_handle.discribe("showComment", this.showComment);

      this.pagenation = new Pagenation(this.post_collection, {}, this.setPostCollection);

      like_socket.callback = function (data) {
        that.post_collection.find(function (model) {
          if (model.id == data.post_id) {
            var new_like_count;
            if (data.type == "like") {
              new_like_count = parseInt(model.get("post_likes_count")) + 1;
            } else if (data.type == "unlike") {
              new_like_count = parseInt(model.get("post_likes_count")) - 1;
            }

            model.set({
              "post_likes_count": new_like_count
            });
          }
        });
      }

      post_socket.callback = function (data) {
        var post      = new Post(data.post);
        that.posts_view.collection.add(post, {silent: true});
        var post_view = new PostView({model: post});
        that.posts_view.$el.prepend(post_view.render().el);
      }

      comment_socket.callback = function (data) {
        that.post_collection.find(function (model) {
          if (model.id == data.post_id) {
            var new_comment_count;
            if (data.type == "comment") {
              new_comment_count = parseInt(model.get("post_comments_count")) + 1
            } else if (data.type == "uncomment") {
              new_comment_count = parseInt(model.get("post_comments_count")) - 1;
            }

            model.set({
              "post_comments_count": new_comment_count
            });
          }
        });
      }

      this.post_collection.fetch({
        data: {page: this.page},
        success: function (model, response, options) {
          that.setPostCollection(model, response, options);
        },
        error: function () {

        }
      });
    },
    setPostCollection: function (model, response, option) {
      for (var i = 0; i < response.posts.length; i++) {
        var post = new Post(response.posts[i]);
        this.posts_view.collection.add(post);
      }

      if (response.posts.length != 0) {
        $(window).bind("scroll", this.pagenation.load);
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
    }
  })

  var app = new AppView();
})();