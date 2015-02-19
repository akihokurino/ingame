var UserResultsView = Backbone.View.extend({
  initialize: function () {
    _.bindAll(this, "setCollection");
    this.listenTo(this.collection, "add", this.addUser);
  },
  addUser: function (user) {
    if (user.id) {
      var user_result_view = new UserResultView({model: user});
      this.$el.append(user_result_view.render().el);
    }
  },
  search: function (params, callback) {
    var that = this;

    $(window).unbind("scroll");

    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.pagenation = new Pagenation(that.collection, params, that.setCollection);

        that.collection.reset();
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
  }
});
