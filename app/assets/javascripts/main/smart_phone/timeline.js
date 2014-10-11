//= require ../../models/post.js
//= require ../../models/comment.js
//= require ../../collections/posts.js
//= require ../../collections/comments.js
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
      _.bindAll(this, "pagenation", "showComment");

      var that                = this;
      this.post_collection    = new Posts();
      this.comment_collection = null;
      this.posts_view         = new PostsView({collection: this.post_collection});
      this.comments_view      = new CommentsView({collection: this.comment_collection});
      this.comment_input      = this.$(".comment-input");

      this.page               = 1;

      event_handle.discribe("showComment", this.showComment);


      this.post_collection.fetch({
        data: {page: this.page},
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
          data: {page: this.page},
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
          },
          error: function () {

          }
        })
      }
    }
  })

  var app = new AppView();
})();