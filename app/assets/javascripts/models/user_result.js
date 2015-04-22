var UserResult = Backbone.Model.extend({
  defaults: {
    "id":           "",
    "username":     "",
    "introduction": "",
    "photo_path":   "",
    "logs_count":   "",
    "place":        "",
    "i_followed":   ""
  },
  strimWidth: function (prop, limit) {
    var value = this.get(prop);
    if (value && value.length > limit) {
      var new_value  = value.slice(0, limit);
      new_value     += "...";
      this.set(prop, new_value);
    }

    return this;
  }
});