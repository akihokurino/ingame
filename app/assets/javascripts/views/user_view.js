var UserView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click .follow":   "follow",
    "click .unfollow": "unfollow"
  },
  template: _.template($("#user-template").html()),
  initialize: function () {
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
          if (this.type == "follows-list") {
            that.$el.remove();
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
          if (this.type == "follows-list") {
            that.$el.remove();
          }
        }
      },
      error: function () {

      }
    })
  }
})
