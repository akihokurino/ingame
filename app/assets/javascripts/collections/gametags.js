var Gametags = Backbone.Collection.extend({
  model: Gametag,
  url: "/api/gametags"
});