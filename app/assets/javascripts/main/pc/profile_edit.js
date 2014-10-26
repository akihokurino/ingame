//= require ../../libs/profile_upload.js

(function () {
  var AppView = Backbone.View.extend({
    el: ".user-edit-page",
    initialize: function () {
      this.upload = new ProfileUpload("upload-btn", "clip", null, {clip_width: "clip-width", clip_height: "clip-height"});
    }
  })

  var app = new AppView();
})();