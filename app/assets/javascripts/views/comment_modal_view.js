var CommentModalView = Backbone.View.extend({
  el: ".comment-modal",
  events: {
    "click .cancel-modal-btn":   "close",
    "click .submit-comment-btn": "postComment"
  },
  template: _.template($("#comment-modal-template").html()),
  initialize: function () {
    var that = this;

    _.bindAll(this, "close");

    this.render();

    this.current_model      = this.attributes.current_model;
    this.current_comments   = this.attributes.current_comments;

    this.comment_collection = new Comments()
    this.comments_view      = new CommentsView({collection: this.comment_collection});

    this.comments_view.render(this.current_comments);

    this.comment_input      = this.$(".comment-input");

    $(".custom-layer").css("display", "block").click(that.close);
  },
  render: function () {
    this.$el.html(this.template).css("display", "block");
    return this;
  },
  close: function () {
    this.unbindEvent();
    this.comment_input.val("");
    this.current_model      = null;
    this.current_comments   = null;
    this.comment_collection = null;
    this.comments_view      = null;
    this.$el.html("").css("display", "none");
    $(".custom-layer").css("display", "none");
  },
  postComment: function () {
    if (this.comment_input.val() != "") {
      var that = this;

      var data = {
        "post_comment": {
          "post_id":    this.current_model.id,
          "text":       this.comment_input.val(),
          "to_user_id": this.current_model.get("user").id
        }
      }

      this.comment_collection.create(data, {
        method: "POST",
        success: function (response) {
          var comment = new Comment(response.get("comment"));
          that.comments_view.collection.add(comment);
          that.current_model.get("post_comments").push(response.get("comment"));
          that.current_model.set("post_comments_count", that.current_model.get("post_comments_count") + 1);

          that.comment_input.val("");

          var data = {
            type: "comment",
            comment: response.get("comment"),
            post_id: that.current_model.id,
            from_user_id: comment_socket.user_id,
            to_user_id: that.current_model.get("user").id
          }

          comment_socket.send(data);

        },
        error: function () {

        }
      });
    }
  },
  unbindEvent: function () {
    $(this.el).undelegate('.cancel-modal-btn', 'click');
    $(this.el).undelegate('.submit-comment-btn', 'click');
  }
});