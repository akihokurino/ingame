var UserResultView = Backbone.View.extend({
  tagName:   "li",
  className: "item",
  events: {
    "click .follow-btn":      "follow",
    "click .unfollow-btn":    "unfollow",
    "click .to-profile-page": "toProfilePage"
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
    this.model.follow(function () {
      that.$el.find("ul.btn-list li").html("");
      that.$el.find("ul.btn-list li").append(that.unfollow_btn_template);
      $(".next-page").html("次へ");
    });
  },
  unfollow: function (e) {
    e.preventDefault();
    var that = this;
    this.model.unfollow(function () {
      that.$el.find("ul.btn-list li").html("");
      that.$el.find("ul.btn-list li").append(that.follow_btn_template);
    });
  },
  toProfilePage: function (e) {
    e.preventDefault();
    if (this.model.get("type") != "setting") {
      location.href = "/users/" + this.model.id + "#logs";
    }
  }
});
