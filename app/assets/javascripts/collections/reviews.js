var Reviews = Backbone.Collection.extend({
  model: Review,
  url: "/api/reviews"
});