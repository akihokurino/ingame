var GameResultView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "change .status": "regist"
  },
  initialize: function () {

  },
  remove: function () {
    this.$el.remove();
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
          $(".next-page").attr("value", "次へ");
          that.remove();
        },
        error: function () {

        }
      })
    }
  }
})