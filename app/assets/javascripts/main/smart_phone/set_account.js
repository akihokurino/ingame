(function () {
  var FlowView = Backbone.View.extend({
    el: $(".set-account-page"),
    template: _.template($("#flow-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);
    }
  })


  var SignupView = Backbone.View.extend({
    el: $(".set-account-page"),
    template: _.template($("#signup-template").html()),
    events: {
      "click .signup-btn": "signup"
    },
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      this.username_input         = this.$(".username-input");
      this.password_input         = this.$(".password-input");
      this.password_confirm_input = this.$(".password-confirm-input");
    },
    signup: function () {
      if (this.username_input.val() != "" && this.password_input.val() != "" && this.password_confirm_input.val() != "") {
        if (this.password_input.val() === this.password_confirm_input.val()) {

        }
      }
    }
  })


  var SigninView = Backbone.View.extend({
    el: $(".set-account-page"),
    template: _.template($("#signin-template").html()),
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);
    }
  })


  /* ---------- Router --------- */

  var Router = Backbone.Router.extend({
    routes: {
      "flow":   "flow",
      "signup": "signup",
      "signin": "signin"
    },
    flow: function () {
      this.current_app = new FlowView();
    },
    signup: function () {
      this.current_app = new SignupView();
    },
    signin: function () {
      this.current_app = new SigninView();
    }
  })

  var router = new Router();
  Backbone.history.start();
})();