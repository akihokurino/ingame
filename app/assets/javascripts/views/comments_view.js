var CommentsView = Backbone.View.extend({
  el: ".comment-list",
  initialize: function () {
    this.refresh();

    if (this.collection) {
      this.listenTo(this.collection, "add", this.addComment);
      this.render();
    }
  },
  addComment: function (comment) {
    if (comment.id) {
      var comment_view = new CommentView({model: comment});
      this.$el.append(comment_view.render().el);
    }
  },
  refresh: function () {
    this.$el.html("");
  },
  render: function () {
    var that = this;

    this.collection.each(function (model) {
      var comment_view = new CommentView({model: model});
      that.$el.append(comment_view.render().el);
    })

    return this;
  }
})