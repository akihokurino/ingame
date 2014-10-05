var UserResults = Backbone.Collection.extend({
  model: UserResult,
  url: "/api/users/search"
})