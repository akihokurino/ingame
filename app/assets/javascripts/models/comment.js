var Comment = Backbone.Model.extend({
  defaults: {
    "id": "",
    "text": "",
    "created_at": "",
    "user": {
      "id": "",
      "username": "",
      "photo_path": ""
    }
  },
  sanitize: function (text) {
    var text = this.get("text").replace(/\n/g, '<br>');
    this.set("text", text);

    return this;
  }
})