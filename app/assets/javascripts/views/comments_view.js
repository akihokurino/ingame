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
  render: function () {
    var that = this;

    this.collection.each(function (model) {
      var comment_view = new CommentView({model: model});
      that.$el.append(comment_view.render().el);
    });

    return this;
  }
});