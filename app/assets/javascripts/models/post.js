var Post = Backbone.Model.extend({
  defaults: {
    "id":                  "",
    "text":                "",
    "post_likes_count":    "",
    "post_comments_count": "",
    "i_liked":             "",
    "created_at":          "",
    "post_type":           "",
    "game": {
      "id":         "",
      "title":      "",
      "photo_url":  "",
      "photo_path": "",
      "device":     ""
    },
    "user": {
      "id":         "",
      "username":   "",
      "photo_path": ""
    },
    "status": {
      "id":   "",
      "name": ""
    },
    "post_photos":     [],
    "post_comments":   [],
    "post_urls":       [],
    "current_user_id": ""
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
  strimUsernameWidth: function (limit) {
    var username = this.get("user").username;
    if (username.length > limit) {
      var new_username          = username.slice(0, limit);
      new_username             += "...";
      this.get("user").username = new_username;
    }

    return this;
  },
  strimCommentUsernameWidth: function (limit) {
    for (var i = 0; i < this.get("post_comments").length; i++) {
      var username = this.get("post_comments")[i].user.username;
      if (username.length > limit) {
        var new_username          = username.slice(0, limit);
        new_username             += "...";
        this.get("user").username = new_username;
      }
      this.get("post_comments")[i].user.username = new_username;
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
  sanitize: function () {
    var text = this.get("text").replace(/\n/g, '<br>');
    text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");
    this.set("text", text);

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
  }
});