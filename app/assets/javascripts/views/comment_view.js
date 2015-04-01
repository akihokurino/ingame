var CommentView = Backbone.View.extend({
  tagName: "li",
  className: "item",
  events: {
    "click .like-btn":           "like",
    "click .unlike-btn":         "unlike",
    "click .comment-delete-btn": "showDeleteConfirm"
  },
  template: _.template($("#comment-template").html()),
  initialize: function () {
    _.bindAll(this, "destroy");

    this.listenTo(this.model, "destroy", this.remove);
    this.listenTo(this.model, "change", this.render);
  },
  render: function () {
    var template = this.template(this.model.toJSON());
    this.$el.html(template);

    return this;
  },
  destroy: function () {
    this.model.url += this.model.id;
    this.model.destroy();
  },
  remove: function () {
    var that = this;
    this.$el.animate({
      "opacity": 0
    }, 500, function () {
      that.$el.remove();
    });
  },
  like: function (e) {
    e.stopPropagation();

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
    });
  },
  unlike: function (e) {
    e.stopPropagation();

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
    });
  },
  showDeleteConfirm: function () {
    var custom_modal_view = new CustomModalView({
      attributes: {
        view: this,
        title: "このコメントを削除しますか？",
        desc: null,
        template: _.template($("#delete-confirm-template").html()),
        callback: this.destroy,
        className: "deleteConfirmModal",
      }
    });
  }
});