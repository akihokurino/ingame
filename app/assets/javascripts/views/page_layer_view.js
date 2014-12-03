var PageLayerView = Backbone.View.extend({
  el: ".page-layer",
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

    this.$el.css("display", "block");

    this.isDisplay     = true;
    this.currentTarget = target;
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
})

var pageLayerView = new PageLayerView();