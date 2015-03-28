var Notification = Backbone.Model.extend({
  defaults: {
    "id":   "",
    "text": "",
    "post_id": "",
    "link": "",
    "to_user": {
      "id":         "",
      "username":   "",
      "photo_path": ""
    },
    "from_user": {
      "id":         "",
      "username":   "",
      "photo_path": ""
    }
  }
});