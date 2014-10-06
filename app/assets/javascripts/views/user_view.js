var UserView = Backbone.View.extend({
  tagName: "li",
  className: "user",
  template: _.template($("#user-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  }
})
