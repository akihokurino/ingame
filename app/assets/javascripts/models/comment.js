//= require ../libs/calculate_time.js

var Comment = Backbone.Model.extend({
  defaults: {
    "id": "",
    "text": "",
    "comment_likes_count": "",
    "i_liked": "",
    "created_at": "",
    "user": {
      "id": "",
      "username": "",
      "photo_path": ""
    }
  },
  sanitize: function (text) {
    var text = this.get("text").replace(/\n/g, '<br>');
    text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");
    this.set("text", text);

    return this;
  },
  getRelativeTime: function () {
    var relative_time = new CalculateTime(this.get("created_at")).getRelativeTime();
    this.set("created_at", relative_time);

    return this;
  }
})