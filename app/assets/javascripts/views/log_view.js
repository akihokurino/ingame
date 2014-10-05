var LogView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {

  },
  initialize: function () {

  },
  template: _.template($("#log-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  }
})