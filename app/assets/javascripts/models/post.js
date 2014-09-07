var Post = Backbone.Model.extend({
  defaults: {
    "id": "",
    "text": "",
    "post_likes_count": "",
    "post_comments_count": "",
    "i_liked": "",
    "created_at": "",
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
    "status": {
      "id": "",
      "name": ""
    },
    "post_photos": [],
    "post_comments": [],
    "current_user_id": ""
  }
})