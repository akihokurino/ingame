var Pagenation = function (collection, params, callback) {
  this.collection = collection;
  this.params     = params;
  this.callback   = callback;
  _.bindAll(this, "load");

  $(".loading-gif").css("display", "block");
}

Pagenation.prototype = {
  load: function () {
    var that           = this;
    var scrollHeight   = $(document).height();
    var scrollPosition = $(window).height() + $(window).scrollTop();

    if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
      $(".loading-gif").css("display", "block");
      $(window).unbind("scroll");
      this.params["page"] += 1;
      this.collection.fetch({
        data: this.params,
        success: function (model, response, options) {
          that.callback(model, response, options);
        },
        error: function () {

        }
      });
    }
  }
}