var CommentView = Backbone.View.extend({
  tagName: "li",
  className: "comment",
  events: {
    "click .like-btn":   "like",
    "click .unlike-btn": "unlike"
  },
  template: _.template($("#comment-template").html()),
  initialize: function () {
    this.listenTo(this.model, "change", this.render);
  },
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  like: function () {
    var that = this;
    var data = {
      "comment_like": {
        "post_comment_id": this.model.id,
        "user_id": null,
        "to_user_id": this.model.get("user").id
      }
    };

    $.ajax({
      type: "POST",
        url: "/api/comment_likes",
        data: data,
        success: function (data) {
          if (data) {
            that.model.set({
              "i_liked": true,
              "comment_likes_count": parseInt(that.model.get("comment_likes_count")) + 1
            });
          }

          var data = {
            type: "comment_like",
            comment_id: that.model.id,
            from_user_id: like_socket.user_id,
            to_user_id: that.model.get("user").id
          }

          like_socket.send(data);
        },
        error: function () {

        }
    })
  },
  unlike: function () {
    var that = this;

    $.ajax({
      type: "DELETE",
      url: "/api/comment_likes/" + this.model.id,
      data: {},
      success: function (data) {
        if (data) {
          that.model.set({
            "i_liked": false,
            "comment_likes_count": parseInt(that.model.get("comment_likes_count")) - 1
          });
        }

        var data = {
          type: "comment_unlike",
          comment_id: that.model.id,
          from_user_id: like_socket.user_id,
          to_user_id: that.model.get("user").id
        }

        like_socket.send(data);
      },
      error: function () {

      }
    })
  },
})