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
  },
  follow: function (callback) {
    var data = {
      "follow": {
        "to_user_id": this.id
      }
    }

    $.ajax({
      type: "POST",
      url: "/api/follows",
      data: data,
      success: function (data) {
        if (data.result) {
          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  },
  unfollow: function (callback) {
    $.ajax({
      type: "DELETE",
      url: "/api/follows/" + this.id,
      data: {},
      success: function (data) {
        if (data.result) {
          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  }
});