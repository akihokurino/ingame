//= require ../models/notification.js
//= require ../collections/notifications.js

(function () {
  $(function () {

    /* ---------- Collection ---------- */
    var notifications = new Notifications();



    /* ---------- View ---------- */
    var NotificationsView = Backbone.View.extend({
      el: $(".notification-modal"),
      events: {
        "click .close-btn": "hideNotifications"
      },
      initialize: function () {
        var that        = this;
        this.collection = notifications;

        this.listenTo(this.collection, "add", this.addNotification);

        this.collection.fetch({
          data: {},
          success: function (model, response, options) {
            console.log(response);
            for (var i = 0; i < response.notifications.length; i++) {
              response.notifications[i].text = that.createText(response.notifications[i]);
              var notification = new Notification(response.notifications[i]);
              that.collection.add(notification);
            }
          },
          error: function () {
            console.log("error");
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
        this.$el.find("notification-list").html("");
        $(".notification-modal").css("display", "none");
        $(".layer").css("display", "none");

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
        this.getNotificationCount();
      },
      getNotificationCount: function () {
        var that = this;
        $.ajax({
          type: "GET",
          url: "/api/notifications/count",
          success: function (data) {
            that.$el.find(".notifyNum").html(data.count);
          },
          error: function () {
            console.log("error");
          }
        })
      },
      showNotifications: function (e) {
        e.preventDefault();
        $(".notification-modal").css("display", "block");
        $(".layer").css("display", "block");
        this.notifications_view = new NotificationsView();
        this.$el.find(".notifyNum").html(0);
      }
    })

    var header_view = new HeaderView();
  })
})();