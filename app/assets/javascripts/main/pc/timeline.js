//= require ../../libs/socket.js
//= require ../../models/post.js
//= require ../../collections/posts.js
//= require ../../views/post_view.js
//= require ../../views/posts_view.js



(function () {
  var AppView = Backbone.View.extend({
    el: ".timeline-page",
    events: {
      "click .submit-comment-btn": "postComment",
      "click .show-select-modal": "toggleSelectModal"
    },
    initialize: function () {
      _.bindAll(this, "pagenation");

      var that                = this;
      this.post_collection    = new Posts();
      this.posts_view         = new PostsView({collection: this.post_collection});

      this.comment_input      = this.$(".comment-input");
      this.page               = 1;

      event_handle.discribe("showComment", this.showComment);


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

      /*
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
      */


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
    toggleSelectModal: function () {
      if ($(".selectModal").css("display") == "none") {
        $(".selectModal").css("display", "block");
      } else {
        $(".selectModal").css("display", "none");
      }
    }
  })

  var app = new AppView();
})();