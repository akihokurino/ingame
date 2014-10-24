var Post = Backbone.Model.extend({
  defaults: {
    "id": "",
    "text": "",
    "post_likes_count": "",
    "post_comments_count": "",
    "i_liked": "",
    "created_at": "",
    "game": {
      "id": "",
      "title": "",
      "photo_path": "",
    },
    "user": {
      "id": "",
      "username": "",
      "photo_path": ""
    },
    "status": {
      "id": "",
      "name": ""
    },
    "post_photos": [],
    "post_comments": [],
    "current_user_id": ""
  },
  url: "/api/posts/",
  strimWidth: function (limit) {
    var title = this.get("game").title;
    if (title.length > limit) {
      var new_title          = title.slice(0, limit);
      new_title             += "...";
      this.get("game").title = new_title;
    }

    return this;
  },
  sanitize: function () {
    var text = this.get("text").replace(/\n/g, '<br>');
    this.set("text", text);

    return this;
  }
})