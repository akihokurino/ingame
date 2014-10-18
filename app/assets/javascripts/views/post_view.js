var PostView = Backbone.View.extend({
  tagName: "article",
  className: "postBox",
  events: {
    "click .delete":          "destroy",
    "click .like":            "like",
    "click .unlike":          "unlike",
    "click .comment-btn":     "showComment",
    "keydown .comment-input": "comment"
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

          var data = {
            type: "like",
            post_id: that.model.id,
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
      url: "/api/post_likes/" + this.model.id,
      data: {},
      success: function (data) {
        if (data) {
          that.model.set({
            "i_liked": false,
            "post_likes_count": parseInt(that.model.get("post_likes_count")) - 1
          });
        }

        var data = {
          type: "unlike",
          post_id: that.model.id,
          from_user_id: like_socket.user_id,
          to_user_id: that.model.get("user").id
        }

        like_socket.send(data);
      },
      error: function () {

      }
    })
  },
  showComment: function (e) {
    e.preventDefault();
    event_handle.publish("showComment", this.model);
  },
  comment: function (e) {
    if (e.which == 13) {
      var that = this;
      var data = {
        "post_comment": {
          "post_id":    this.model.id,
          "text":       this.$(".comment-input").val(),
          "to_user_id": this.model.get("user").id
        }
      }

      $.ajax({
        type: "POST",
        url: "/api/post_comments",
        data: data,
        success: function (data) {
          that.model.get("post_comments").push(data.comment);
          that.render();
        },
        error: function () {

        }
      })

      this.$(".comment-input").val("");
    }
  }
})
