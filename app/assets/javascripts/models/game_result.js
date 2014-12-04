var GameResult = Backbone.Model.extend({
  urlRoot: "/api/logs",
  defaults: {
    "id":         "",
    "title":      "",
    "photo_path": "",
    "device":     "",
    "maker":      "",
    "avg_rate":   "",
    "is_regist":  false
  },
  strimWidth: function (limit) {
    var title = this.get("title");
    if (title.length > limit) {
      var new_title     = title.slice(0, limit);
      new_title        += "...";
      this.set("title", new_title);
    }
  }
})