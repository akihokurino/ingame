var GameResultsView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.collection, "add", this.addGame);
  },
  addGame: function (game) {
    if (game.id) {
      game.strimWidth(40);
      var game_result_view = new GameResultView({model: game});
      this.$el.prepend(game_result_view.render().el);
    }
  }
})