var User = Backbone.Model.extend({
  defaults: {
    "id":           "",
    "username":     "",
    "introduction": "",
    "photo_path":   "",
    "place":        "",
    "i_followed":   "",
    "i_followered": ""
  },
  isCurrentUser: function () {
    return $("#wrapper").data("userid") == this.id ? true : false
  },
  strimWidth: function (limit) {
    var introduction = this.get("introduction");
    if (introduction.length > limit) {
      var new_introduction  = introduction.slice(0, limit);
      new_introduction     += "...";
      this.set("introduction", new_introduction);
    }

    return this;
  }
})