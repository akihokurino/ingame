//= require ../../views/notification_view.js
//= require ../../views/notifications_view.js


(function () {
  var HeaderView = Backbone.View.extend({
    el: "header",
    events: {
      "click .my-notify": "showNotifications"
    },
    initialize: function () {
      var that = this;
      _.bindAll(this, "hideNotifications");

      this.page_layer_view         = new PageLayerView();

      this.notification_collection = new Notifications();

      this.getNotificationCount();

      event_handle.discribe("hideNotifications", this.hideNotifications);


      notification_socket.callback = function (data) {
        var new_notification_count;
        if (that.$el.find(".notify-num").css("display") == "none") {
          new_notification_count = 1;
        } else {
          new_notification_count = parseInt(that.$el.find(".notifyNum").html()) + 1;
        }

        that.$el.find(".notify-num").css("display", "block").html(new_notification_count);
      }
    },
    getNotificationCount: function () {
      var that = this;
      $.ajax({
        type: "GET",
        url: "/api/notifications/count",
        success: function (data) {
          if (data.count > 0) {
            that.$el.find(".notify-num").css("display", "block");
            that.$el.find(".notify-num").html(data.count);
          } else {
            that.$el.find(".notify-num").css("display", "none");
          }
        },
        error: function () {

        }
      });
    },
    showNotifications: function (e) {
      e.preventDefault();

      this.$el.find(".notify-num").css("display", "none");
      this.$el.find(".notify-num").html(0);

      this.notifications_view = new NotificationsView({collection: this.notification_collection});

      this.page_layer_view.show(".notification-modal");
    },
    hideNotifications: function () {
      this.notifications_view = null;
      this.page_layer_view.hide();
    }
  });

  var header_view = new HeaderView();
})();