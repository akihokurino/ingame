var GameView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "change .my-status": "regist",
  },
  initialize: function () {
    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
    }

    if (this.attributes && this.attributes.template) {
      this.template = _.template($(this.attributes.template).html());
    }
  },
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    this.setCurrentStatus();

    return this;
  },
  regist: function () {
    if (this.$el.find(".my-status").val() != "") {
      var that = this;

      if (this.model.get("i_registed")) {
        var data = {
          "log": {
            "status_id": this.$el.find(".my-status").val()
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/logs/" + this.model.id + "/update_status_or_rate",
          data: data,
          success: function (data) {

          },
          error: function () {

          }
        });
      } else {
        var data = {
          "log": {
            "game_id":   this.model.id,
            "status_id": this.$el.find(".my-status").val()
          }
        }

        $.ajax({
          type: "POST",
          url: "/api/logs",
          data: data,
          success: function (data) {
            that.model.set("i_registed", true);
            that.$el.addClass("registed");
            $(".next-page").html("次へ");
          },
          error: function () {

          }
        });
      }
    }
  },
  setCurrentStatus: function () {
    if (this.model.get("my_status_id")) {
      this.$el.find(".my-status").val(this.model.get("my_status_id"));
      this.$el.addClass("registed");
    }
  },
});
