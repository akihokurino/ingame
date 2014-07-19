var Result = Backbone.Model.extend({
  urlRoot: "/api/logs",
  defaults: {
    "title": "",
    "photo_path": "",
    "device": "",
    "maker": ""
  }
})