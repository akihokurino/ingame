var PostsView = Backbone.View.extend({
  el: $(".post-list"),
  initialize: function () {
    this.listenTo(this.collection, "add", this.addPost);
  },
  addPost: function (post) {
    if (post.id) {
      post.strimWidth(40);
      var post_view = new PostView({model: post});
      this.$el.append(post_view.render().el);
    }
  },
  render: function () {

  }
})
