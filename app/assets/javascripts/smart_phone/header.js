//= require ../models/notification.js
//= require ../collections/notifications.js

(function () {
  $(function () {

    /* ---------- Collection ---------- */
    var notifications = new Notifications();



    /* ---------- View ---------- */
    var NotificationsView = Backbone.View.extend({
      el: $(".notification-list"),
      initialize: function () {
        var that        = this;
        this.collection = notifications;
        this.page       = 1;

        this.listenTo(this.collection, "add", this.addNotification);

        this.collection.fetch({
          data: {page: this.page},
          success: function (model, response, options) {
            console.log(response);
            for (var i = 0; i < response.notifications.length; i++) {
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
        var notification_view = new NotificationView({model: notification});
        this.$el.append(notification_view.render().el);
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
      initialize: function () {
        this.notifications_view = new NotificationsView();
      }
    })

    var header_view = new HeaderView();
  })
})();