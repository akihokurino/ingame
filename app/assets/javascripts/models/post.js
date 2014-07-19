var Post = Backbone.Model.extend({
  defaults: {
    "id": "",
    "text": "",
    "post_likes_count": "",
    "i_liked": "",
    "game": {
      "id": "",
      "title": "",
      "photo_path": "",
    },
    "user": {
      "id": "",
      "username": "",
      "photo_path": ""
    },
    "current_user_id": ""
  }
})