var CustomModalView = Backbone.View.extend({
  el: ".custom-modal",
  events: {
    "click .cancel-btn": "cancel",
    "click .done-btn":   "done"
  },
  initialize: function () {
    var that = this;

    _.bindAll(this, "cancel");

    this.title        = this.attributes.title;
    this.desc         = this.attributes.desc;
    this.current_view = this.attributes.view;
    this.callback     = this.attributes.callback;
    this.template     = this.attributes.template;
    this.className    = this.attributes.className;

    $(".custom-layer").css("display", "block").click(that.cancel);

    this.render();
  },
  render: function () {
    var template = this.template({title: this.title, desc: this.desc});
    this.$el.html(template).css("display", "block").addClass(this.className);
    return this;
  },
  done: function () {
    this.close();

    if (this.callback) {
      this.callback()
    }
  },
  cancel: function () {
    this.close();
  },
  unbindEvent: function () {
    $(this.el).undelegate('.cancel-btn', 'click');
    $(this.el).undelegate('.done-btn', 'click');
  },
  close: function () {
    this.unbindEvent();
    this.$el.html("").css("display", "none").removeClass(this.className);
    $(".custom-layer").css("display", "none");
  }
});