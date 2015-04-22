var GameResult = Backbone.Model.extend({
  urlRoot: "/api/logs",
  defaults: {
    "id":         "",
    "title":      "",
    "photo_path": "",
    "device":     "",
    "maker":      "",
    "avg_rate":   "",
    "i_registed": ""
  },
  strimWidth: function (prop, limit) {
    var value = this.get(prop);
    if (value.length > limit) {
      var new_value = value.slice(0, limit);
      new_value    += "...";
      this.set(prop, new_value);
    }
  }
});