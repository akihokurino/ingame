var CommentsView = Backbone.View.extend({
  el: ".comment-list",
  initialize: function () {
    this.$el.html("");
    this.listenTo(this.collection, "add", this.addComment);
  },
  addComment: function (comment) {
    if (comment.id) {
      comment.sanitize().getRelativeTime().strimUsernameWidth(20);
      var comment_view = new CommentView({model: comment});
      this.$el.prepend(comment_view.render().el);
    }
  },
  render: function (params, callback) {
    var that = this;
    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.setCollection(model, response, options);

        if (callback) {
          callback(response);
        }
      },
      error: function () {

      }
    });

    return this;
  },
  setCollection: function (model, response, option) {
    if (response.post_comments && response.post_comments.length > 0) {
      for (var i = 0; i < response.post_comments.length; i++) {
        var comment = new Comment(response.post_comments[i]);
        this.collection.add(comment);
      }
    }
  }
});