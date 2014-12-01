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
      this.upload  = new ProfileUpload("upload-btn", "clip-area", this.user_id, {clip_x_input: "clip-x", clip_y_input: "clip-y"});
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

      if (this.upload.file) {
        var data = {
          "user": {
            "tmp_data": this.upload.file,
            "clip_x":   this.upload.clip_x,
            "clip_y":   this.upload.clip_y
          }
        }

        $.ajax({
          type: "POST",
          url: "/api/users/tmp_upload",
          data: data,
          success: function (data) {
            that.$(".clip-box").css("display", "none");
            var img = $("<img src='/tmp_photos/" + data.result + "' width='98' height='98'>");
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