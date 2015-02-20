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

      post_socket.callback = function (data) {
        var post = new Post(data.post);
        post.strimWidth(40).sanitize().sanitizeComment();
        post.getRelativeTime().getCommentRelativeTime();
        that.posts_view.collection.add(post, {silent: true});

        var post_view = new PostView({model: post});
        that.posts_view.$el.prepend(post_view.render().el);
      }
    }
  });

  var app = new AppView();
})();