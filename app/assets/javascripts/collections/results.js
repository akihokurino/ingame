var Results = Backbone.Collection.extend({
  model: Result,
  url: "/api/games/search"
})