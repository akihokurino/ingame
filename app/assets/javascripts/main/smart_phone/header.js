//= require ../../models/notification.js
//= require ../../collections/notifications.js
//= require ../../views/notification_view.js
//= require ../../views/notifications_view.js

(function () {
  $(function () {

    var HeaderView = Backbone.View.extend({
      el: $("header"),
      events: {
        "click .notify": "showNotifications"
      },
      initialize: function () {
        this.notification_collection = new Notifications();
        this.getNotificationCount();
      },
      getNotificationCount: function () {
        var that = this;
        $.ajax({
          type: "GET",
          url: "/api/notifications/count",
          success: function (data) {
            if (data.count > 0) {
              that.$el.find(".notifyNum").html(data.count);
            } else {
              that.$el.find(".notifyNum").css("display", "none");
            }
          },
          error: function () {

          }
        })
      },
      showNotifications: function (e) {
        e.preventDefault();

        $(".notification-modal").css("display", "block");
        $(".layer").css("display", "block");
        this.$el.find(".notifyNum").html(0);

        this.notifications_view = new NotificationsView({collection: this.notification_collection});
      },
      hideNotifications: function () {
        $(".notification-modal").css("display", "none");
        $(".layer").css("display", "none");
        $("notification-list").html("");

        this.notifications_view = null;
      }
    })

    var header_view = new HeaderView();
  })
})();