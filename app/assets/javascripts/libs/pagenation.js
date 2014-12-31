var Pagenation = function (collection, params, callback) {
  this.page       = 1;
  this.collection = collection;
  this.params     = params;
  this.callback   = callback;

  _.bindAll(this, "load");
}

Pagenation.prototype = {
  load: function () {
    var that           = this;
    var scrollHeight   = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();

    if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
      $(".loading-gif").css("display", "block");
      $(window).unbind("scroll");
      this.page          += 1;
      this.params["page"] = this.page;
      this.collection.fetch({
        data: this.params,
        success: function (model, response, options) {
          that.callback(model, response, options);

          $(".loading-gif").css("display", "none");
        },
        error: function () {
        }
      });
    }
  }
}