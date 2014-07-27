var Log = Backbone.Model.extend({
  defaults: {
    "id": "",
    "text": "",
    "rate": "",
    "game": {
      "id": "",
      "title": "",
      "photo_path": "",
      "device": "",
      "maker": "",
      "game_like_count": 0
    },
    "status": {
      "id": "",
      "name": ""
    }
  }
})