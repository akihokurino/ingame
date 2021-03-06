var UsersView = Backbone.View.extend({
  initialize: function () {
    _.bindAll(this, "setCollection");

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
      this.settingModel(user);
      var user_view = new UserView({model: user, attributes: {type: this.type, template: this.template}});
      this.$el.append(user_view.render().el);
    }
  },
  render: function (params, callback) {
    var that = this;

    $(window).unbind("scroll");
    this.$el.html("");

    this.pagenation = new Pagenation(this.collection, params, this.setCollection);
    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.setCollection(model, response, options);

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
  setCollection: function (model, response, option) {
    if (response.users.length != 0) {
      for (var i = 0; i < response.users.length; i++) {
        var user = new User(response.users[i]);
        this.collection.add(user);
      }

      $(window).bind("scroll", this.pagenation.load);
    }
  },
  renderAll: function (params, callback) {
    var that = this;
    this.$el.next(".loading-gif").css("display", "block");

    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.$el.next(".loading-gif").css("display", "none");

        for (var i = 0; i < response.users.length; i++) {
          var user = new User(response.users[i]);
          that.collection.add(user);
        }

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
  settingModel: function (user) {
    user.set("type", this.type);
    user.set("isCurrentUser", user.isCurrentUser());
  }
});