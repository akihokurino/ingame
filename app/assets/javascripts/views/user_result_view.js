var UserResultView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click .follow-btn": "follow",
    "click .unfollow-btn": "unfollow"
  },
  template: _.template($("#user-result-template").html()),
  initialize: function () {
    if ($("#follow-btn-template").html() && $("#unfollow-btn-template").html()) {
      this.follow_btn_template   = _.template($("#follow-btn-template").html());
      this.unfollow_btn_template = _.template($("#unfollow-btn-template").html());
    }
  },
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
          that.$el.find("ul.btn-list li").html("");
          that.$el.find("ul.btn-list li").append(that.unfollow_btn_template);
          $(".next-page").html("次へ");
        }
      },
      error: function () {

      }
    })
  },
  unfollow: function (e) {
    e.preventDefault();
    var that = this;

    $.ajax({
      type: "DELETE",
      url: "/api/follows/" + this.model.id,
      data: {},
      success: function (data) {
        if (data.result) {
          that.$el.find("ul.btn-list li").html("");
          that.$el.find("ul.btn-list li").append(that.follow_btn_template);
        }
      },
      error: function () {

      }
    })
  }
})
