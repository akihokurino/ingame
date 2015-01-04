var GameView = Backbone.View.extend({
  tagName: "div",
  className: "Gamelist",
  template: _.template($("#game-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  }
})
