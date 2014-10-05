var GameResults = Backbone.Collection.extend({
  model: GameResult,
  url: "/api/games/search"
})