var UserResultView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click .follow": "follow"
  },
  template: _.template($("#user-result-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  follow: function (e) {
    e.preventDefault();
    var that = this;
    var data = {
      "follow": {
        "to_user_id": this.model.id
      }
    }

    $.ajax({
      type: "POST",
      url: "/api/follows",
      data: data,
      success: function (data) {
        if (data.result) {
          that.$el.remove();
        }
        $(".next-page").attr("value", "次へ");
      },
      error: function () {

      }
    })
  }
})
