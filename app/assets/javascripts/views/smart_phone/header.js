//= require ../../models/notification.js
//= require ../../collections/notifications.js

(function () {
  $(function () {


    /* ---------- View ---------- */
    var NotificationsView = Backbone.View.extend({
      el: $(".notification-modal"),
      events: {
        "click .close-btn": "hideNotifications"
      },
      initialize: function () {
        var that = this;
        this.listenTo(this.collection, "add", this.addNotification);

        this.collection.fetch({
          data: {},
          success: function (model, response, options) {
            for (var i = 0; i < response.notifications.length; i++) {
              response.notifications[i].text = that.createText(response.notifications[i]);
              var notification = new Notification(response.notifications[i]);
              that.collection.add(notification);
            }
          },
          error: function () {

          }
        })
      },
      addNotification: function (notification) {
        if (notification.id) {
          var notification_view = new NotificationView({model: notification});
          this.$el.find(".notification-list").append(notification_view.render().el);
        }
      },
      createText: function (notification) {
        var text = "<a href='/users/" + notification.from_user.id + "'>" + notification.from_user.username + "さん</a>があなた" + notification.text;
        return text;
      },
      hideNotifications: function () {
        this.stopListening();

        $(".notification-modal").css("display", "none");
        $(".layer").css("display", "none");
        this.$el.find("notification-list").html("");

        header_view.notifications_view = null;
      }
    })

    var NotificationView = Backbone.View.extend({
      tagName: "li",
      template: _.template($("#notification-template").html()),
      render: function () {
        var template = this.template(this.model.toJSON());
        this.$el.html(template);

        return this;
      }
    })

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
      }
    })

    var header_view = new HeaderView();
  })
})();