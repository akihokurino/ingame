//= require ../../views/post_view.js
//= require ../../views/posts_view.js

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
    }
  });

  var app = new AppView();
})();