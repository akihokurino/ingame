var DeleteConfirmView = Backbone.View.extend({
  el: ".delete-confirm-wrap",
  events: {
    "click .cancel-btn": "cancel",
    "click .done-btn":   "done"
  },
  template: _.template($("#delete-confirm-template").html()),
  initialize: function () {
    var that          = this;
    this.target       = this.attributes.target;
    this.desc         = this.attributes.desc;
    this.current_view = this.attributes.view;
    this.callback     = this.attributes.callback;
    this.render();

    $(".layer").click(function () {
      that.cancel();
    })
  },
  render: function () {
    var template = this.template({target: this.target, desc: this.desc});
    this.$el.html(template);
    return this;
  },
  done: function () {
    this.unbindEvent();

    if (this.current_view) {
      this.current_view.destroy();
    }

    $(".delete-confirm-wrap").css("display", "none");
    $(".layer").css("display", "none");
    this.$el.html("");

    if (this.callback) {
      this.callback()
    }
  },
  cancel: function () {
    this.unbindEvent();
    $(".delete-confirm-wrap").css("display", "none");
    $(".layer").css("display", "none");
    this.$el.html("");
  },
  unbindEvent: function () {
    $(this.el).undelegate('.cancel-btn', 'click');
    $(this.el).undelegate('.done-btn', 'click');
  }
})