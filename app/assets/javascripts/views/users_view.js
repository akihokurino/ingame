var UsersView = Backbone.View.extend({
  initialize: function () {
    this.listenTo(this.collection, "add", this.addUser);
  },
  addUser: function (user) {
    if (user.id) {
      var user_view = new UserView({model: user});
      this.$el.append(user_view.render().el);
    }
  }
})