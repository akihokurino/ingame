var UsersView = Backbone.View.extend({
  initialize: function () {

    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    if (this.attributes && this.attributes.template) {
      this.template = this.attributes.template;
    }

    this.listenTo(this.collection, "add", this.addUser);
  },
  addUser: function (user) {
    if (user.id) {
      user.set("type", this.type);
      user.set("isCurrentUser", user.isCurrentUser());
      var user_view = new UserView({model: user, attributes: {type: this.type, template: this.template}});
      this.$el.append(user_view.render().el);
    }
  }
});