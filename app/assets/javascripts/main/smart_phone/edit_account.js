(function () {
  var AppView = Backbone.View.extend({
    el: ".edit-account-page",
    events: {
      "click .delete-account-btn": "showDeleteConfirm"
    },
    initialize: function () {
      _.bindAll(this, "deleteAccount");

      this.user_id = $("#wrapper").data("userid");
    },
    showDeleteConfirm: function (e) {
      e.preventDefault();

      var custom_modal_view = new CustomModalView({
        attributes: {
          view: this,
          title: "本当に退会してよろしいですか？",
          desc: "あなたに関するデータは全て破棄されます。",
          template: _.template($("#delete-confirm-template").html()),
          callback: this.deleteAccount,
          className: "deleteConfirmModal",
        }
      });
    },
    deleteAccount: function () {
      this.deleteSubmit("/users/" + this.user_id, "DELETE");
    },
    deleteSubmit: function (href, method) {
      var form           = $('<form method="post" action="' + href + '"></form>');
      var metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';
      var csrf_token     = $('meta[name=csrf-token]').attr('content');
      var csrf_param     = $('meta[name=csrf-param]').attr('content');

      if (csrf_param != undefined && csrf_token != undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
        form.hide().append(metadata_input).appendTo('body');
        form.submit();
      }
    }
  });

  var app = new AppView();
})();