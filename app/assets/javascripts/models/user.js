var User = Backbone.Model.extend({
  defaults: {
    "id":           "",
    "username":     "",
    "introduction": "",
    "photo_path":   "",
    "place":        "",
    "logs_count":   "",
    "i_followed":   "",
    "i_followered": ""
  },
  isCurrentUser: function () {
    return $("#wrapper").data("userid") == this.id ? true : false;
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