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
  strimUsernameWidth: function (limit) {
    var username = this.get("user").username;
    if (username.length > limit) {
      var new_username          = username.slice(0, limit);
      new_username             += "...";
      this.get("user").username = new_username;
    }

    return this;
  },
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
  }
});