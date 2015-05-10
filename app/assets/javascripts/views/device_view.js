var DeviceView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  template: _.template($("#device-template").html()),
  initialize: function () {

  },
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  }
});
