var UserView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click .follow":   "follow",
    "click .unfollow": "unfollow"
  },
  template: _.template($("#user-template").html()),
  initialize: function () {
    if ($("#follow-btn-template").html() && $("#unfollow-btn-template").html()) {
      this.follow_btn_template   = _.template($("#follow-btn-template").html());
      this.unfollow_btn_template = _.template($("#unfollow-btn-template").html());
    }

    if (this.attributes && this.attributes.type) {
      this.type = this.attributes.type;
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
          if (that.type == "follows-list") {
            that.$el.remove();
          }

          if (that.type == "followers-list") {
            that.$el.find("ul.btnList li").html("");
            that.$el.find("ul.btnList li").append(that.unfollow_btn_template);
          }
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
          if (that.type == "follows-list") {
            that.$el.remove();
          }

          if (that.type == "followers-list") {
            that.$el.find("ul.btnList li").html("");
            that.$el.find("ul.btnList li").append(that.follow_btn_template({text: "フォローを仕返す"}));
          }
        }
      },
      error: function () {

      }
    })
  }
})
