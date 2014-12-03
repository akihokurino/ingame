var GameResultsView = Backbone.View.extend({
  initialize: function () {

    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    this.listenTo(this.collection, "add", this.addGame);
  },
  addGame: function (game) {
    if (game.id) {
      game.set("type", this.type);
      game.strimWidth(40);
      var game_result_view = new GameResultView({model: game});
      this.$el.append(game_result_view.render().el);
    }
  }
})