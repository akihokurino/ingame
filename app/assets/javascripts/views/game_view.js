var GameView = Backbone.View.extend({
  tagName:   "li",
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
      this.model.toggleRegist(this.$el.find(".my-status").val(), null, function () {
        that.$el.addClass("registed");
      });
    }
  },
  setCurrentStatus: function () {
    if (this.model.get("my_status_id")) {
      this.$el.find(".my-status").val(this.model.get("my_status_id"));
      this.$el.addClass("registed");
    }
  },
});
