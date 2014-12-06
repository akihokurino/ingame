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
    signup: function (e) {
      e.preventDefault();

      if (this.username_input.val() != "" && this.password_input.val() != "" && this.password_confirm_input.val() != "") {
        if (this.password_input.val() === this.password_confirm_input.val()) {
          var data = {
            "user": {
              "username": this.username_input.val(),
              "password": this.password_input.val(),
              "password_confirm": this.password_confirm_input.val()
            }
          }

          $.ajax({
            type: "POST",
            url: "/api/users",
            data: data,
            success: function (data) {
              if (data.result) {
                location.href = "/users/" + data.result + "/setting#first";
              }
            },
            error: function () {

            }
          })
        }
      }
    }
  })


  var SigninView = Backbone.View.extend({
    el: $(".set-account-page"),
    template: _.template($("#signin-template").html()),
    events: {
      "click .signin-btn": "signin"
    },
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      this.username_input         = this.$(".username-input");
      this.password_input         = this.$(".password-input");
    },
    signin: function (e) {
      e.preventDefault();

      if (this.username_input.val() != "" && this.password_input.val() != "") {

        var data = {
          "user": {
            "username": this.username_input.val(),
            "password": this.password_input.val()
          }
        }

        $.ajax({
          type: "POST",
          url: "/api/sessions",
          data: data,
          success: function (data) {
            if (data.result) {
              location.href = data.result;
            }
          },
          error: function () {

          }
        })
      }
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