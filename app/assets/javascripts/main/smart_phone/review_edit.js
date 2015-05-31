(function () {
  var AppView = Backbone.View.extend({
    el: ".review-edit-page",
    events: {
      "click .update-btn": "update"
    },
    initialize: function () {
      this.review_select = this.$el.find(".my-rate");
      this.title_input   = this.$el.find(".title-input");
      this.text_input    = this.$el.find(".text-input");
      this.game_id       = this.$el.data("gameid");
      this.review_id     = this.$el.data("reviewid");
    },
    update: function (e) {
      var that = this;
      e.preventDefault();
      if (this.validate()) {
        var data = {
          "review": {
            "game_id": this.game_id,
            "rate": this.review_select.val(),
            "title": this.title_input.val(),
            "contents": [
              {
                "type": "text",
                "value": this.text_input.val()
              }
            ]
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/reviews/" + this.review_id,
          data: data,
          success: function (data) {
            if (data) {
              location.href = "/games/" + that.game_id + "#review";
            }
          },
          error: function () {

          }
        });
      }
    },
    validate: function () {
      this.$el.find(".error-log").html("");
      var error = {};

      if (!this.review_select.val() || this.review_select.val() == "") {
        error.review = "empty";
      }

      if (this.title_input.val() == "") {
        error.title = "empty";
      } else if (this.title_input.val().length > 20) {
        error.title = "toolong";
      }

      if (this.text_input.val() == "") {
        error.text = "empty";
      } else if (this.text_input.val().length > 2000) {
        error.text = "toolong";
      }

      if (Object.keys(error).length > 0) {
        for (key in error) {
          switch (key) {
            case "review":
              if (error[key] == "empty") {
                this.$el.find(".review-error").html("評価値を選択して下さい。");
              }
              break;
            case "title":
              if (error[key] == "empty") {
                this.$el.find(".title-error").html("タイトルを入力して下さい。");
              }
              if (error[key] == "toolong") {
                this.$el.find(".title-error").html("タイトルは20文字以内で入力して下さい。");
              }
              break;
            case "text":
              if (error[key] == "empty") {
                this.$el.find(".text-error").html("本文を入力して下さい。");
              }
              if (error[key] == "toolong") {
                this.$el.find(".text-error").html("本文は2000文字以内で入力して下さい。");
              }
              break;
          }
        }

        return false;
      }

      return true;
    }
  });

  var app = new AppView();
})();