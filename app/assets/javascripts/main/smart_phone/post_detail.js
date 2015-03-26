//= require ../../views/user_view.js
//= require ../../views/users_view.js

(function () {
  var AppView = Backbone.View.extend({
    el: ".post-detail-page",
    events: {
      "click .like-btn":       "like",
      "click .unlike-btn":     "unlike",
      "click .show-like-user": "showLikeUser",
      "click .hide-like-user": "hideLikeUser"
    },
    initialize: function () {
      this.current_post_id    = this.$el.data("postid");
      this.current_like_count = this.$el.find(".like-count");
    },
    like: function (e) {
      var that = this;
      var data = {
        "post_like": {
          "post_id": this.current_post_id,
          "user_id": null,
          "to_user_id": null
        }
      };

      $.ajax({
        type: "POST",
          url: "/api/post_likes",
          data: data,
          success: function (data) {
            console.log(data);
            if (data) {
              var like_count = parseInt(that.current_like_count.text());
              that.current_like_count.text(++like_count);
              $(e.target).removeClass("like-btn").addClass("unlike-btn");
            }
          },
          error: function () {

          }
      });
    },
    unlike: function (e) {
      var that = this;

      $.ajax({
        type: "DELETE",
        url: "/api/post_likes/" + this.current_post_id,
        data: {},
        success: function (data) {
          if (data) {
            var like_count = parseInt(that.current_like_count.text());
            if (like_count > 0) {
              that.current_like_count.text(--like_count);
            } else {
              that.current_like_count.text(0);
            }
            $(e.target).removeClass("unlike-btn").addClass("like-btn");
          }
        },
        error: function () {

        }
      });
    },
    showLikeUser: function () {
      this.like_user_collection = new Users();
      this.users_view           = new UsersView({el: ".like-user-list-body", collection: this.like_user_collection, attributes: {template: "#like-user-template"}});
      this.users_view.getLiked({type: "liked", post_id: this.current_post_id, page: 1});
      this.$el.find(".like-user-list").addClass("show");
    },
    hideLikeUser: function () {
      this.like_user_collection = null;
      this.users_view           = null;
      this.$el.find(".like-user-list").removeClass("show");
    }
  });

  var app = new AppView();
})();