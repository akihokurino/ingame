//= require ../../views/post_view.js
//= require ../../views/posts_view.js
//= require ../../views/comment_view.js
//= require ../../views/comments_view.js
//= require ../../views/comment_modal_view.js


(function () {
  var AppView = Backbone.View.extend({
    el: ".timeline-page",
    events: {

    },
    initialize: function () {
      var that             = this;
      this.post_collection = new Posts();
      this.posts_view      = new PostsView({collection: this.post_collection});

      this.posts_view.render({page: 1});

      /*
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
      */
    }
  });

  var app = new AppView();
})();