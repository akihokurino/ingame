var Game = Backbone.Model.extend({
  defaults: {
    "id":          "",
    "title":       "",
    "photo_path":  "",
    "photo_url":   "",
    "device":      "",
    "provider":    "",
    "maker":       "",
    "release_day": "",
    "avg_rate":    "",
    "i_registed":  ""
  },
  strimWidth: function (prop, limit) {
    var value = this.get(prop);
    if (value.length > limit) {
      var new_value = value.slice(0, limit);
      new_value    += "...";
      this.set(prop, new_value);
    }
  },
  toggleRegist: function (status_id, regist_callback, unregist_callback) {
    var that = this;

    if (this.get("i_registed")) {
      var data = {
        "log": {
          "status_id": status_id
        }
      }

      $.ajax({
        type: "PUT",
        url: "/api/logs/" + this.id + "/update_status_or_rate",
        data: data,
        success: function (data) {
          if (regist_callback) {
            regist_callback();
          }
        },
        error: function () {

        }
      });
    } else {
      var data = {
        "log": {
          "game_id":   this.id,
          "status_id": status_id
        }
      }

      $.ajax({
        type: "POST",
        url: "/api/logs",
        data: data,
        success: function (data) {
          that.set("i_registed", true);

          if (unregist_callback) {
            unregist_callback();
          }
        },
        error: function () {

        }
      });
    }
  }
});