var PostsView = Backbone.View.extend({
  el: ".post-list",
  initialize: function () {
    _.bindAll(this, "setCollection");
    this.listenTo(this.collection, "add", this.addPost);
  },
  addPost: function (post) {
    if (post.id) {
      post.strimWidth(40).sanitize().sanitizeComment();
      post.getRelativeTime().getCommentRelativeTime();

      var post_view = new PostView({model: post});
      this.$el.append(post_view.render().el);
    }
  },
  render: function (params, callback) {
    var that = this;

    $(window).unbind("scroll");
    this.$el.html("");

    this.pagenation = new Pagenation(this.collection, params, this.setCollection);
    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.setCollection(model, response, options);

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
  setCollection: function (model, response, option) {
    if (response.posts && response.posts.length > 0) {
      for (var i = 0; i < response.posts.length; i++) {
        var post = new Post(response.posts[i]);
        this.collection.add(post);
      }

      $(window).bind("scroll", this.pagenation.load);
    }
  },
  removePosts: function () {
    this.$el.html("");
  }
});
