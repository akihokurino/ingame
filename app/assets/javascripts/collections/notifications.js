var Notifications = Backbone.Collection.extend({
  model: Notification,
  url: "/api/notifications"
});