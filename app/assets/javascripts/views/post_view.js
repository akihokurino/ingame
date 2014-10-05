var PostView = Backbone.View.extend({
  tagName: "article",
  className: "postBox",
  events: {
    "click .delete":      "destroy",
    "click .like" :       "like",
    "click .unlike":      "unlike",
    "click .comment-btn": "showComment",
  },
  initialize: function () {
    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "change", this.render);
  },
  destroy: function () {
    this.model.destroy();
  },
  remove: function () {
    this.$el.remove();
  },
  template: _.template($("#post-template").html()),
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  like: function () {
    var that = this;
    var data = {
      "post_like": {
        "post_id": this.model.id,
        "user_id": null,
        "to_user_id": this.model.get("user").id
      }
    };

    $.ajax({
      type: "POST",
        url: "/api/post_likes",
        data: data,
        success: function (data) {
          if (data) {
            that.model.set({
              "i_liked": true,
              "post_likes_count": parseInt(that.model.get("post_likes_count")) + 1
            });
          }
        },
        error: function () {

        }
    })
  },
  unlike: function () {
    var that = this;

    $.ajax({
      type: "DELETE",
      url: "/api/post_likes/" + this.model.id,
      data: {},
      success: function (data) {
        if (data) {
          that.model.set({
            "i_liked": false,
            "post_likes_count": parseInt(that.model.get("post_likes_count")) - 1
          });
        }
      },
      error: function () {

      }
    })
  }
})
