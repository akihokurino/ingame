var NotificationView = Backbone.View.extend({
  tagName: "li",
  template: _.template($("#notification-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  }
});
