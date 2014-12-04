var GameResultView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "change .my-status": "regist"
  },
  initialize: function () {

  },
  template: _.template($("#game-result-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  regist: function () {
    if (this.$el.find(".status").val() != "") {

      var that = this;

      if (this.model.get("is_regist")) {
        var data = {
          "log": {
            "status_id": this.$el.find(".status").val()
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
        })
      } else {
        var data = {
          "log": {
            "game_id":   this.model.id,
            "status_id": this.$el.find(".status").val()
          }
        }

        $.ajax({
          type: "POST",
          url: "/api/logs",
          data: data,
          success: function (data) {
            that.model.set("is_regist", true);
            that.$el.addClass("registed");
          },
          error: function () {

          }
        })
      }
    }
  }
})