//= require ../../vendors/draggable_background.js
//= require ../../libs/profile_upload.js

(function () {
  var AppView = Backbone.View.extend({
    el: ".user-edit-page",
    events: {
      "change #upload-btn": "showClipModal",
      "click .cancel-clip": "hideClipModal",
      "click .done-clip":   "clip"
    },
    initialize: function () {
      var tmp      = location.href.split("#")[0].split("/");
      this.user_id = tmp.pop() && tmp.pop();
      //this.upload = new ProfileUpload("upload-btn", "clip-area", this.user_id, {clip_x_input: "clip-x", clip_y_input: "clip-y"}, null);
      this.upload  = new ProfileUpload("upload-btn", "clip-area", this.user_id, null, "ajax");
    },
    showClipModal: function () {
      this.$(".clip-box").css("display", "block");
    },
    hideClipModal: function () {
      this.upload.reset();
      this.$(".clip-box").css("display", "none");
    },
    clip: function () {
      var that = this;
      $(".next-page").val("アップロード");

      if (this.upload.file) {
        var data = {
          "user": {
            "photo_path": this.upload.file,
            "clip_x":     this.upload.clip_x,
            "clip_y":     this.upload.clip_y
          }
        }

        $.ajax({
          type: "PUT",
          url: "/api/users/" + this.user_id,
          data: data,
          success: function (data) {
            that.hideClipModal();
            var img = $("<img src='/user_photos/" + data.result.photo_path + "' width='98' height='98'>");
            $("#thumbnail").html(img);
          },
          error: function () {

          }
        })
      }
    }
  })

  var app = new AppView();
})();