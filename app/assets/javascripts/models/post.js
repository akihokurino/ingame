var Post = Backbone.Model.extend({
  defaults: {
    id:                  "",
    text:                "",
    post_likes_count:    "",
    post_comments_count: "",
    i_liked:             "",
    created_at:          "",
    post_type:           "",
    game: {
      id:         "",
      title:      "",
      photo_url:  "",
      photo_path: "",
      device:     ""
    },
    user: {
      id:         "",
      username:   "",
      photo_path: ""
    },
    status: {
      id:   "",
      name: ""
    },
    post_photos:     [],
    post_comments:   [],
    post_urls:       [],
    current_user_id: "",
    review: {
      id:       "",
      title:    "",
      contents: []
    }
  },
  url: "/api/posts/",
  strimGameTitleWidth: function (limit) {
    var title = this.get("game").title;
    if (title.length > limit) {
      var new_title          = title.slice(0, limit);
      new_title             += "...";
      this.get("game").title = new_title;
    }

    return this;
  },
  strimTextWidth: function (limit) {
    var text = this.get("text");
    if (text.length > limit) {
      var new_text = text.slice(0, limit);
      new_text    += "...";
      this.set("text", new_text);
      this.set("isMore", true);
    } else {
      this.set("isMore", false);
    }

    return this;
  },
  strimReviewTextWidth: function (limit) {
    for (var i = 0; i < this.get("review").contents.length; i++) {
      if (this.get("review").contents[i].content_type == "text") {
        var text = this.get("review").contents[i].body;
        if (text.length > limit) {
          var new_text = text.slice(0, limit);
          new_text    += "...";
          this.get("review").contents[i].body = new_text;
          this.set("isMore", true);
        } else {
          this.set("isMore", false);
        }

        break;
      }
    }
    return this;
  },
  sanitize: function () {
    var text = this.get("text").replace(/\n/g, '<br>');
    text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");
    this.set("text", text);

    return this;
  },
  sanitizeReviewText: function () {
    for (var i = 0; i < this.get("review").contents.length; i++) {
      if (this.get("review").contents[i].content_type == "text") {
        var text = this.get("review").contents[i].body.replace(/\n/g, '<br>');
        text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");
        this.get("review").contents[i].body = text;
      }
    }

    return this;
  },
  sanitizeComment: function () {
    for (var i = 0; i < this.get("post_comments").length; i++) {
      var text = this.get("post_comments")[i]["text"].replace(/\n/g, '<br>');
      text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");
      this.get("post_comments")[i]["text"] = text;
    }

    return this;
  },
  getRelativeTime: function () {
    var relative_time = new CalculateTime(this.get("created_at")).getRelativeTime();
    this.set("created_at", relative_time);

    return this;
  },
  getCommentRelativeTime: function (comment_time) {
    for (var i = 0; i < this.get("post_comments").length; i++) {
      var relative_time = new CalculateTime(this.get("post_comments")[i]["created_at"]).getRelativeTime();
      this.get("post_comments")[i]["created_at"] = relative_time;
    }

    return this;
  },
  like: function (callback) {
    var that = this;
    var data = {
      post_like: {
        post_id: this.id,
        user_id: null,
        to_user_id: this.get("user").id
      }
    };

    $.ajax({
      type: "POST",
      url: "/api/post_likes",
      data: data,
      success: function (data) {
        if (data) {
          that.set({
            i_liked: true,
            post_likes_count: parseInt(that.get("post_likes_count")) + 1
          }, {silent: true});

          var send_data = {
            type: "like",
            post_id: that.id,
            from_user_id: like_socket.user_id,
            to_user_id: that.get("user").id
          }

          like_socket.send(send_data);

          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  },
  unlike: function (callback) {
    var that = this;

    $.ajax({
      type: "DELETE",
      url: "/api/post_likes/" + this.id,
      data: {},
      success: function (data) {
        if (data) {
          that.set({
            i_liked: false,
            post_likes_count: parseInt(that.get("post_likes_count")) - 1
          }, {silent: true});

          var send_data = {
            type: "unlike",
            post_id: that.id,
            from_user_id: like_socket.user_id,
            to_user_id: that.get("user").id
          }

          like_socket.send(send_data);

          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  },
  comment: function (text, callback) {
    var that = this;
    var data = {
      post_comment: {
        post_id:    this.id,
        text:       text,
        to_user_id: this.get("user").id
      }
    }

    $.ajax({
      type: "POST",
      url: "/api/post_comments",
      data: data,
      success: function (data) {
        data.comment.text       = new Comment().sanitize(data.comment.text);
        data.comment.created_at = new Comment().getRelativeTime(data.comment.created_at);
        that.get("post_comments").push(data.comment);
        that.set("post_comments_count", that.get("post_comments_count") + 1, {silent: true});

        var data = {
          type: "comment",
          comment: data.comment,
          post_id: that.id,
          from_user_id: comment_socket.user_id,
          to_user_id: that.get("user").id
        }

        comment_socket.send(data);

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
  commentLike: function (index, callback) {
    var comment = this.get("post_comments")[index];
    var that    = this;
    var data = {
      "post_comment_like": {
        "post_comment_id": comment.id,
        "user_id": null,
        "to_user_id": comment.user.id
      }
    };

    $.ajax({
      type: "POST",
      url: "/api/post_comment_likes",
      data: data,
      success: function (data) {
        if (data) {
          comment.i_liked = true;
          comment.comment_likes_count += 1;

          var send_data = {
            type: "comment_like",
            post_id: that.id,
            post_comment_id: comment.id,
            from_user_id: like_socket.user_id,
            to_user_id: comment.user.id
          }

          like_socket.send(send_data);

          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  },
  commentUnlike: function (index, callback) {
    var comment = this.get("post_comments")[index];
    var that    = this;

    $.ajax({
      type: "DELETE",
      url: "/api/post_comment_likes/" + comment.id,
      data: {},
      success: function (data) {
        if (data) {
          comment.i_liked = false;

          if (comment.comment_likes_count > 0) {
            comment.comment_likes_count -= 1;
          }

          var send_data = {
            type: "comment_unlike",
            post_id: that.id,
            post_comment_id: comment.id,
            from_user_id: like_socket.user_id,
            to_user_id: comment.user.id
          }

          like_socket.send(send_data);

          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  }
});