var GameResultsView = Backbone.View.extend({
  initialize: function () {
    _.bindAll(this, "setCollection");

    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    this.listenTo(this.collection, "add", this.addGame);
  },
  addGame: function (game) {
    if (game.id) {
      this.settingModel(game);
      var game_result_view = new GameResultView({model: game});
      this.$el.append(game_result_view.render().el);
    }
  },
  search: function (params, callback) {
    var that = this;
    this.$el.next(".loading-gif").css("display", "block");
    $(window).unbind("scroll");

    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.pagenation = new Pagenation(that.collection, params, that.setCollection);

        that.collection.reset();
        that.$el.next(".loading-gif").css("display", "none");
        that.$el.html("");
        that.setCollection(model, response, options);

        if (callback) {
          callback(response);
        }
      },
      error: function () {

      }
    });
  },
  setCollection: function (model, response, options) {
    if (response.results && response.results.length > 0) {
      for (var i = 0; i < response.results.length; i++) {
        var game_result = new GameResult(response.results[i]);
        this.collection.add(game_result);
      }

      $(window).bind("scroll", this.pagenation.load);
    }
  },
  settingModel: function (game) {
    game.set("type", this.type);
    game.strimWidth("title", 38);
  }
});