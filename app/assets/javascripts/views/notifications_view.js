var NotificationsView = Backbone.View.extend({
  el: ".notification-modal",
  events: {
    "click .close-btn": "hideNotifications"
  },
  initialize: function () {
    var that = this;

    this.$el.find(".notification-list").html("");

    this.listenTo(this.collection, "add", this.addNotification);

    this.collection.fetch({
      data: {},
      success: function (model, response, options) {
        that.collection.reset();
        for (var i = 0; i < response.notifications.length; i++) {
          response.notifications[i].text = that.createText(response.notifications[i]);
          var notification               = new Notification(response.notifications[i]);
          that.collection.add(notification);
        }

        that.stopListening();
      },
      error: function () {

      }
    });
  },
  addNotification: function (notification) {
    if (notification.id) {
      var notification_view = new NotificationView({model: notification});
      this.$el.find(".notification-list").append(notification_view.render().el);
    }
  },
  createText: function (notification) {
    var text = "<a href='/users/" + notification.from_user.id + "#logs'>" + notification.from_user.username + "</a>さんがあなた" + notification.text;
    return text;
  },
  hideNotifications: function () {
    event_handle.publish("hideNotifications");
  }
});
