var LogView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click": "select"
  },
  initialize: function () {
    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }
  },
  template: _.template($("#log-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  select: function () {
    if (this.type == "select") {
      event_handle.publish("selectLog", this.model);
    }
  }
})