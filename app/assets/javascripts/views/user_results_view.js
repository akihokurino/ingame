var UserResultsView = Backbone.View.extend({
  initialize: function () {
    _.bindAll(this, "setCollection");

    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    this.listenTo(this.collection, "add", this.addUser);
  },
  addUser: function (user) {
    if (user.id) {
      this.settingModel(user);
      var user_result_view = new UserResultView({model: user});
      this.$el.append(user_result_view.render().el);
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
  setCollection: function (model, response, option) {
    if (response.results && response.results.length > 0) {
      for (var i = 0; i < response.results.length; i++) {
        var user_result = new UserResult(response.results[i]);
        this.collection.add(user_result);
      }

      $(window).bind("scroll", this.pagenation.load);
    }
  },
  settingModel: function (user) {
    user.set("type", this.type);
  }
});
