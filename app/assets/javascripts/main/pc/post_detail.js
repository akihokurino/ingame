//= require ../../views/user_view.js
//= require ../../views/users_view.js
//= require ../../views/comment_view.js
//= require ../../views/comments_view.js

(function () {
  var AppView = Backbone.View.extend({
    el: ".post-detail-page",
    events: {
      "click .like-btn":        "like",
      "click .unlike-btn":      "unlike",
      "click .show-like-user":  "showLikeUser",
      "click .hide-like-user":  "hideLikeUser",
      "click .comment-expand":  "commentExpand",
      "keydown .comment-input": "sendComment",
      "click .delete-btn":      "showDeleteConfirm"
    },
    initialize: function () {
      _.bindAll(this, "destroy");
      var that = this;

      this.current_post_id      = this.$el.data("postid");
      this.current_like_count   = this.$el.find(".like-count");
      this.modal_like_count     = this.$el.find(".modal-like-count");
      this.comment_input        = this.$el.find(".comment-input");

      this.comment_collection   = new Comments();
      this.comments_view        = new CommentsView({collection: this.comment_collection});

      this.like_user_collection = new Users();
      this.users_view           = new UsersView({el: ".like-user-list-body", collection: this.like_user_collection, attributes: {template: "#like-user-template"}});

      this.nextOffset = 20;

      this.comments_view.render({post_id: this.current_post_id, type: "init", offset: 0, limit: 20}, function (res) {
        if (res.is_all) {
          that.$el.find(".comment-expand").remove();
        }
      });

      this.users_view.renderAll({type: "liked", post_id: this.current_post_id, page: 1});

      $(".comment-input").autosize();
    },
    sendComment: function (e) {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();

        var that = this;
        var data = {
          "post_comment": {
            "user_id": null,
            "post_id": this.current_post_id,
            "text":    this.comment_input.val()
          }
        }

        this.comment_collection.create(data, {
          method: "POST",
          success: function (response) {
            var comment = new Comment(response.get("comment"));
            comment.sanitize().getRelativeTime();
            that.comment_collection.add(comment, {silent: true});
            var comment_view = new CommentView({model: comment});
            that.comments_view.$el.append(comment_view.render().el);

            that.comment_input.val("");

            that.nextOffset += 1;
          },
          error: function () {

          }
        });
      }
    },
    like: function (e) {
      var that = this;
      var data = {
        "post_like": {
          "post_id": this.current_post_id,
          "user_id": null,
          "to_user_id": null
        }
      };

      $.ajax({
        type: "POST",
          url: "/api/post_likes",
          data: data,
          success: function (data) {
            if (data.result) {
              var like_count = parseInt(that.current_like_count.text());
              that.current_like_count.text(like_count + 1);
              that.modal_like_count.text(like_count + 1);
              $(e.target).removeClass("like-btn").addClass("unlike-btn").addClass("on");
            }
          },
          error: function () {

          }
      });
    },
    unlike: function (e) {
      var that = this;

      $.ajax({
        type: "DELETE",
        url: "/api/post_likes/" + this.current_post_id,
        data: {},
        success: function (data) {
          if (data.result) {
            var like_count = parseInt(that.current_like_count.text());
            if (like_count > 0) {
              that.current_like_count.text(like_count - 1);
              that.modal_like_count.text(like_count - 1);
            } else {
              that.current_like_count.text(0);
              that.modal_like_count.text(0);
            }
            $(e.target).removeClass("unlike-btn").removeClass("on").addClass("like-btn");
          }
        },
        error: function () {

        }
      });
    },
    showLikeUser: function () {
      this.like_user_collection = new Users();
      this.users_view           = new UsersView({el: ".like-user-list-body", collection: this.like_user_collection, attributes: {template: "#like-user-template"}});
      this.users_view.renderAll({type: "liked", post_id: this.current_post_id, page: 1});
      this.$el.find(".like-user-list").addClass("show");
    },
    hideLikeUser: function () {
      this.like_user_collection = null;
      this.users_view           = null;
      this.$el.find(".like-user-list").removeClass("show");
    },
    commentExpand: function () {
      this.comments_view.render({post_id: this.current_post_id, type: null, offset: this.nextOffset});
      this.$el.find(".comment-expand").remove();
    },
    showDeleteConfirm: function () {
      var custom_modal_view = new CustomModalView({
        attributes: {
          view: this,
          title: "この投稿を削除しますか？",
          desc: null,
          template: _.template($("#delete-confirm-template").html()),
          callback: this.destroy,
          className: "deleteConfirmModal",
        }
      });
    },
    destroy: function () {
      $.ajax({
        type: "DELETE",
        url: "/api/posts/" + this.current_post_id,
        data: {},
        success: function () {
          location.href = "/";
        },
        error: function () {

        }
      });
    }
  });

  var app = new AppView();
})();