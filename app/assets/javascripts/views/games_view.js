var GamesView = Backbone.View.extend({
  initialize: function () {
    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    if (this.attributes && this.attributes.template) {
      this.template = this.attributes.template;
    }

    this.listenTo(this.collection, "add", this.addGame);
    this.$el.find(".loading-gif").css("display", "block");
  },
  addGame: function (game) {
    if (game.id) {
      this.settingModel(game);
      var game_view = new GameView({model: game, attributes: {type: this.type, template: this.template}});
      this.$el.append(game_view.render().el);
    }
  },
  renderAll: function (params, callback) {
    var that = this;
    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.$el.find(".loading-gif").css("display", "none");
        that.setCollection(model, response, options);

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
  setCollection: function (model, response, options) {
    for (var i = 0; i < response.games.length; i++) {
      var game = new Game(response.games[i]);
      this.collection.add(game);
    }
  },
  settingModel: function (game) {
    game.strimWidth("title", 48);
  }
});