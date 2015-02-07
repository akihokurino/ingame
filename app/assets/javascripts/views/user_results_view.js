var UserResultsView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.collection, "add", this.addUser);
  },
  addUser: function (user) {
    if (user.id) {
      var user_result_view = new UserResultView({model: user});
      this.$el.append(user_result_view.render().el);
    }
  }
});
