(function () {
  var AppView = Backbone.View.extend({
    el: ".review-detail-page",
    events: {
      "click .like-btn":   "like",
      "click .unlike-btn": "unlike",
      "click .delete-btn": "showDeleteConfirm"
    },
    initialize: function () {
      _.bindAll(this, "destroy");
      var that = this;

      this.current_review_id  = this.$el.data("reviewid");
      this.current_like_count = this.$el.find(".like-count");
    },
    like: function (e) {
      var that = this;
      var data = {
        "review_like": {
          "review_id":  this.current_review_id,
          "user_id":    null,
          "to_user_id": null
        }
      };

      $.ajax({
        type: "POST",
          url: "/api/review_likes",
          data: data,
          success: function (data) {
            if (data.result) {
              var like_count = parseInt(that.current_like_count.text());
              that.current_like_count.text(like_count + 1);
              $(e.target).removeClass("like-btn").addClass("unlike-btn").addClass("on");
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
        url: "/api/review_likes/" + this.current_review_id,
        data: {},
        success: function (data) {
          if (data.result) {
            var like_count = parseInt(that.current_like_count.text());
            if (like_count > 0) {
              that.current_like_count.text(like_count - 1);
            } else {
              that.current_like_count.text(0);
            }
            $(e.target).removeClass("unlike-btn").removeClass("on").addClass("like-btn");
          }
        },
        error: function () {

        }
      });
    },
    showDeleteConfirm: function () {
      var custom_modal_view = new CustomModalView({
        attributes: {
          view: this,
          title: "このレビューを削除しますか？",
          desc: null,
          template: _.template($("#delete-confirm-template").html()),
          callback: this.destroy,
          className: "deleteConfirmModal",
        }
      });
    },
    destroy: function () {
      $.ajax({
        type: "DELETE",
        url: "/api/reviews/" + this.current_review_id,
        data: {},
        success: function () {
          location.href = "/";
        },
        error: function () {

        }
      });
    }
  });

  var app = new AppView();
})();