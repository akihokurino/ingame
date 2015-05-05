(function () {
  var AppView = Backbone.View.extend({
    el: ".edit-account-page",
    events: {
      "click .delete-account-btn": "showDeleteConfirm",
      "click .tw-log-status-share-checkbox":  "toggleLogStatusTwShare",
      "click .fb-log-status-share-checkbox":  "toggleLogStatusFbShare",
    },
    initialize: function () {
      _.bindAll(this, "deleteAccount");

      this.user_id = $("#wrapper").data("userid");

      this.tw_log_status_share_checkbox = $(".tw-log-status-share-checkbox");
      this.fb_log_status_share_checkbox = $(".fb-log-status-share-checkbox");
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
    },
    toggleLogStatusTwShare: function () {
      var id = this.tw_log_status_share_checkbox.data("id");

      if (this.tw_log_status_share_checkbox.prop("checked")) {
         var data = {
          "user_provider": {
            "share_log_status": true
          }
        }
      } else {
         var data = {
          "user_provider": {
            "share_log_status": false
          }
        }
      }

      this.updateShareLogStatus(id, data);
    },
    toggleLogStatusFbShare: function () {
      var id = this.fb_log_status_share_checkbox.data("id");

      if (this.fb_log_status_share_checkbox.prop("checked")) {
        var data = {
          "user_provider": {
            "share_log_status": true
          }
        }
      } else {
         var data = {
          "user_provider": {
            "share_log_status": false
          }
        }
      }

      this.updateShareLogStatus(id, data);
    },
    updateShareLogStatus: function (id, data) {
      if (req) {
        req.abort();
      }

      var req = $.ajax({
        type: "PUT",
        url: "/api/user_providers/" + id,
        data: data,
        success: function (data) {

        },
        error: function () {

        }
      });
    }
  });

  var app = new AppView();
})();