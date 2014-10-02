//= require ../../libs/profile_edit_upload.js

(function () {
  $(function () {

    /* ---------- View ---------- */

    var AppView = Backbone.View.extend({
      el: ".user-edit-page",
      initialize: function () {
        this.upload = new ProfileUpload("upload-btn", "thumbnail");
      }
    })

    var app = new AppView();
  })
})();