var CommentView = Backbone.View.extend({
  tagName: "li",
  className: "comment",
  template: _.template($("#comment-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  }
})