var Devices = Backbone.Collection.extend({
  model: Device,
  url: "/api/games/devices"
});