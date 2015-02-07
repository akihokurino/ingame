var Log = Backbone.Model.extend({
  defaults: {
    "id":      "",
    "text":    "",
    "user_id": "",
    "rate":    "",
    "game": {
      "id":              "",
      "title":           "",
      "photo_path":      "",
      "photo_url":       "",
      "device":          "",
      "maker":           "",
      "game_like_count": 0
    },
    "status": {
      "id":   "",
      "name": ""
    }
  },
  url: "/api/logs/",
  strimWidth: function (limit) {
    var title = this.get("game").title;
    if (title.length > limit) {
      var new_title          = title.slice(0, limit);
      new_title             += "...";
      this.get("game").title = new_title;
    }
  },
  isCurrentUserLog: function () {
    return $("#wrapper").data("userid") == this.get("user_id") ? true : false
  }
});