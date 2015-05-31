var ReviewsView = Backbone.View.extend({
  el: ".review-list",
  initialize: function () {
    var that = this;

    _.bindAll(this, "setCollection");
    this.listenTo(this.collection, "add", this.addReview);
  },
  addReview: function (review) {
    if (review.id) {
      var review_view = new ReviewView({model: review});
      this.$el.append(review_view.render().el);
    }
  },
  render: function (params, callback) {
    var that = this;

    $(window).unbind("scroll");
    this.$el.html("");

    this.pagenation = new Pagenation(this.collection, params, this.setCollection);
    this.collection.fetch({
      data: params,
      success: function (model, response, options) {
        that.setCollection(model, response, options);

        if (callback) {
          callback();
        }
      },
      error: function () {

      }
    });
  },
  setCollection: function (model, response, option) {
    console.log(response);
    if (response.reviews && response.reviews.length > 0) {
      for (var i = 0; i < response.reviews.length; i++) {
        var review = new Review(response.reviews[i]);
        this.collection.add(review);
      }

      $(window).bind("scroll", this.pagenation.load);
    }

    $(".loading-gif").css("display", "none");
  },
});
