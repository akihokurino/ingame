var TooltipView = Backbone.View.extend({
  el: ".tooltip-layer",
  events: {
    "click": "hide"
  },
  initialize: function () {
    this.isDisplay     = false;
    this.currentTarget = null;
  },
  show: function (target) {
    if (this.isDisplay) {
      return;
    }

    this.isDisplay     = true;
    this.currentTarget = target;

    this.$el.css("display", "block");
    $(this.currentTarget).css("display", "block");
  },
  hide: function () {
    if (!this.isDisplay) {
      return;
    }

    this.$el.css("display", "none");
    $(this.currentTarget).css("display", "none");

    this.isDisplay     = false;
    this.currentTarget = null;
  }
});