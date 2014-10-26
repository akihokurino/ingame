//= require ../../models/notification.js
//= require ../../collections/notifications.js
//= require ../../views/notification_view.js
//= require ../../views/notifications_view.js


(function () {
  var HeaderView = Backbone.View.extend({
    el: $("header"),
    events: {
      "click .notify":                 "showNotifications",
      "click .menu-btn":               "toggleMenu",
      "keypress .header-search-input": "search"
    },
    initialize: function () {
      var that = this;
      _.bindAll(this, "hideNotifications");

      this.notification_collection = new Notifications();
      this.getNotificationCount();

      this.search_input = this.$(".header-search-input");
      this.user_id      = $("#wrapper").data("userid");

      event_handle.discribe("hideNotifications", this.hideNotifications);


      notification_socket.callback = function (data) {
        var new_notification_count;
        if (that.$el.find(".notifyNum").css("display") == "none") {
          new_notification_count = 1;
        } else {
          new_notification_count = parseInt(that.$el.find(".notifyNum").html()) + 1;
        }

        that.$el.find(".notifyNum").css("display", "block").html(new_notification_count);
      }
    },
    getNotificationCount: function () {
      var that = this;
      $.ajax({
        type: "GET",
        url: "/api/notifications/count",
        success: function (data) {
          if (data.count > 0) {
            that.$el.find(".notifyNum").css("display", "block");
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
      this.$el.find(".notifyNum").css("display", "none");
      this.$el.find(".notifyNum").html(0);

      this.notifications_view = new NotificationsView({collection: this.notification_collection});
    },
    hideNotifications: function () {
      $(".notification-modal").css("display", "none");
      $(".layer").css("display", "none");
      $("notification-list").html("");

      this.notifications_view = null;
    },
    toggleMenu: function () {
      if (this.$(".openMenu").css("display") == "none") {
        this.$(".openMenu").css("display", "block");
      } else {
        this.$(".openMenu").css("display", "none");
      }
    },
    search: function (e) {
      if (e.which == 13 && this.search_input.val() != "") {
        e.preventDefault();
        location.href = "/users/" + this.user_id + "/search_game_or_user?search_word=" + this.search_input.val() + "#game";
      }
    }
  })

  var header_view = new HeaderView();
})();