var Comment = Backbone.Model.extend({
  defaults: {
    "id": "",
    "text": "",
    "user": {
      "id": "",
      "username": "",
      "photo_path": ""
    }
  }
})