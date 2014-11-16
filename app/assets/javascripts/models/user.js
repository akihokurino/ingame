var User = Backbone.Model.extend({
  defaults: {
    "id":           "",
    "username":     "",
    "introduction": "",
    "photo_path":   "",
    "place":        "",
    "i_followed":   "",
    "i_followered": ""
  }
})