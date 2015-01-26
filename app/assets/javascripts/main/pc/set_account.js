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
      "click .signup-btn":                "signup",
      "keypress .username-input":         "signupWithEnter",
      "keypress .password-input":         "signupWithEnter",
      "keypress .password-confirm-input": "signupWithEnter"
    },
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      this.username_input         = this.$(".username-input");
      this.password_input         = this.$(".password-input");
      this.password_confirm_input = this.$(".password-confirm-input");
      this.rule_checkbox          = this.$(".rule-checkbox");
    },
    signupWithEnter: function (e) {
      if (e.which == 13) {
        e.preventDefault();
        this.signup(e);
      }
    },
    signup: function (e) {
      e.preventDefault();

      if (this.validate()) {
        var data = {
          "user": {
            "username": this.username_input.val().replace(/\s+/g, ""),
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
    },
    validate: function () {
      this.$el.find(".error-log").html("");
      var error = {};
      if (this.username_input.val() == "") {
        error.username = "empty";
      } else if (this.username_input.val().length > 15) {
        error.username = "toolong";
      } else {
        var result = $.ajax({
          type: "GET",
          url: "/api/users/uniqueness?username=" + this.username_input.val(),
          async: false
        }).responseText;

        if (!JSON.parse(result).result) {
          error.username = "already";
        }
      }

      if (this.password_input.val() == "") {
        error.password = "empty";
      } else if (this.password_input.val().length < 8) {
        error.password = "tooshort";
      }
      if (this.password_confirm_input.val() == "") {
        error.password_confirm = "empty";
      }
      if (this.password_input.val() !== this.password_confirm_input.val()) {
        error.password_confirm = "notsame";
      }

      if (!this.rule_checkbox.prop("checked")) {
        error.rule = "uncheck";
      }

      if (Object.keys(error).length > 0) {
        for (key in error) {
          switch (key) {
            case "username":
              if (error[key] == "empty") {
                this.$el.find(".username-error").html("ユーザー名を入力して下さい。");
              }
              if (error[key] == "toolong") {
                this.$el.find(".username-error").html("ユーザー名は１５文字以内で入力して下さい。");
              }
              if (error[key] == "already") {
                this.$el.find(".username-error").html("そのユーザー名はすでに使われています。");
              }
              break;
            case "password":
              if (error[key] == "empty") {
                this.$el.find(".password-error").html("パスワードを入力して下さい。");
              }
              if (error[key] == "tooshort") {
                this.$el.find(".password-error").html("パスワードは８文字以上で入力して下さい。");
              }
              break;
            case "password_confirm":
              if (error[key] == "empty") {
                this.$el.find(".password-confirm-error").html("確認用のパスワードを入力して下さい。");
              }
              if (error[key] == "notsame") {
                this.$el.find(".password-confirm-error").html("パスワードと確認用パスワードが違います。");
              }
              break;
            case "rule":
              if (error[key] == "uncheck") {
                this.$el.find(".rule-error").html("利用規約に同意して下さい。");
              }
              break;
          }
        }

        return false;
      }

      return true;
    }
  })


  var SigninView = Backbone.View.extend({
    el: $(".set-account-page"),
    template: _.template($("#signin-template").html()),
    events: {
      "click .signin-btn":        "signin",
      "keypress .username-input": "signinWithEnter",
      "keypress .password-input": "signinWithEnter"
    },
    initialize: function () {
      this.$el.html("");
      this.$el.append(this.template);

      this.username_input         = this.$(".username-input");
      this.password_input         = this.$(".password-input");
    },
    signinWithEnter: function (e) {
      if (e.which == 13) {
        e.preventDefault();
        this.signin(e);
      }
    },
    signin: function (e) {
      e.preventDefault();

      if (this.validate()) {
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
            } else {
              $(".error-message").html("ユーザー名かパスワードが違います。");
            }
          },
          error: function () {
            $(".error-message").html("ユーザー名かパスワードが違います。");
          }
        })
      }
    },
    validate: function () {
      this.$el.find(".error-log").html("");
      var error = {};
      if (this.username_input.val() == "") {
        error.username = "empty";
      }
      if (this.password_input.val() == "") {
        error.password = "empty";
      } else if (this.password_input.val().length < 8) {
        error.password = "tooshort";
      }

      if (Object.keys(error).length > 0) {
        for (key in error) {
          switch (key) {
            case "username":
              if (error[key] == "empty") {
                this.$el.find(".username-error").html("ユーザー名を入力して下さい。");
              }
              break;
            case "password":
              if (error[key] == "empty") {
                this.$el.find(".password-error").html("パスワードを入力して下さい。");
              }
              if (error[key] == "tooshort") {
                this.$el.find(".password-error").html("パスワードは８文字以上で入力して下さい。");
              }
              break;
          }
        }

        return false;
      }

      return true;
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