var GametagView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  template: _.template($("#gametag-template").html()),
  initialize: function () {

  },
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  }
});
