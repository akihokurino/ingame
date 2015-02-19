var CommentsView = Backbone.View.extend({
  el: ".comment-list",
  initialize: function () {
    this.$el.html("");

    if (this.collection) {
      this.listenTo(this.collection, "add", this.addComment);
      this.render();
    }
  },
  addComment: function (comment) {
    if (comment.id) {
      comment.sanitize().getRelativeTime();
      var comment_view = new CommentView({model: comment});
      this.$el.append(comment_view.render().el);
    }
  },
  render: function (comments) {
    if (comments && comments.length > 0) {
      for (var i = 0; i < comments.length; i++) {
        var comment = new Comment(comments[i]);
        this.collection.add(comment);
      }
    }

    return this;
  },
});