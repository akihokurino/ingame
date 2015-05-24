var GameResultView = Backbone.View.extend({
  tagName:   "li",
  className: "item",
  events: {
    "change .my-status":   "regist",
    "click .to-game-page": "toGamePage"
  },
  initialize: function () {

  },
  template: _.template($("#game-result-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    this.setCurrentStatus();

    return this;
  },
  regist: function () {
    if (this.$el.find(".my-status").val() != "") {
      var that = this;
      this.model.toggleRegist(this.$el.find(".my-status").val(), null, function () {
        that.$el.addClass("registed");
        $(".next-page").html("次へ");
      });
    }
  },
  setCurrentStatus: function () {
    if (this.model.get("my_status_id")) {
      this.$el.find(".my-status").val(this.model.get("my_status_id"));
      this.$el.addClass("registed");
    }
  },
  toGamePage: function (e) {
    e.preventDefault();
    if (this.model.get("type") != "setting") {
      location.href = "/games/" + this.model.id + "#all";
    }
  }
});