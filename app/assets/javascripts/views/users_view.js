var UsersView = Backbone.View.extend({
  initialize: function () {
    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }
    this.listenTo(this.collection, "add", this.addUser);
  },
  addUser: function (user) {
    if (user.id) {
      user.set("type", this.type);
      var user_view = new UserView({model: user, attributes: {type: this.type}});
      this.$el.append(user_view.render().el);
    }
  }
})