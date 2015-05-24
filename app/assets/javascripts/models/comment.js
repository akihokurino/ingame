var Comment = Backbone.Model.extend({
  defaults: {
    "id":                  "",
    "text":                "",
    "comment_likes_count": "",
    "i_liked":             "",
    "created_at":          "",
    "user": {
      "id":         "",
      "username":   "",
      "photo_path": ""
    },
    "current_user_id": ""
  },
  url: "/api/post_comments/",
  sanitize: function (text_params) {
    if (text_params) {
      var text = text_params.replace(/\n/g, '<br>');
      text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");

      return text;
    } else {
      var text = this.get("text").replace(/\n/g, '<br>');
      text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");
      this.set("text", text);

      return this;
    }
  },
  getRelativeTime: function (time_params) {
    if (time_params) {
      return new CalculateTime(time_params).getRelativeTime();
    } else {
      var re = new RegExp("/", "i");
      if (this.get("created_at").match(re)) {
        var relative_time = new CalculateTime(this.get("created_at")).getRelativeTime();
        this.set("created_at", relative_time);
      }

      return this;
    }
  },
  like: function (callback) {
    var that = this;
    var data = {
      "post_comment_like": {
        "post_comment_id": this.id,
        "user_id": null,
        "to_user_id": this.get("user").id
      }
    };

    $.ajax({
      type: "POST",
        url: "/api/post_comment_likes",
        data: data,
        success: function (data) {
          if (data) {
            that.set({
              "i_liked": true,
              "comment_likes_count": parseInt(that.get("comment_likes_count")) + 1
            });
          }

          var data = {
            type: "comment_like",
            comment_id: that.id,
            from_user_id: like_socket.user_id,
            to_user_id: that.get("user").id
          }

          like_socket.send(data);

          if (callback) {
            callback();
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
      url: "/api/post_comment_likes/" + this.id,
      data: {},
      success: function (data) {
        if (data) {
          that.set({
            "i_liked": false,
            "comment_likes_count": parseInt(that.get("comment_likes_count")) - 1
          });
        }

        var data = {
          type: "comment_unlike",
          comment_id: that.id,
          from_user_id: like_socket.user_id,
          to_user_id: that.get("user").id
        }

        like_socket.send(data);

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
});