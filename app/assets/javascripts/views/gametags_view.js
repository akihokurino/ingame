var GametagsView = Backbone.View.extend({
  initialize: function () {
    this.tmp_gametag_list = [];
    this.listenTo(this.collection, "add", this.addGametag);
  },
  addGametag: function (gametag) {
    if (gametag.id) {
      var gametag_view = new GametagView({model: gametag});
      this.$el.append(gametag_view.render().el);
    }
  },
  render: function (params, callback) {
    var that = this;
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
  setCollection: function (model, response, options) {
    for (var i = 0; i < response.gametags.length; i++) {
      var gametag = new Gametag(response.gametags[i]);
      this.collection.add(gametag);
      this.tmp_gametag_list.push(gametag);
    }
  },
  search: function (search_word) {
    this.collection.reset();
    this.removeTags();

    if (search_word.length > 0) {
      var keyword = new RegExp(search_word, "i");

      for (var i = 0; i < this.tmp_gametag_list.length; i++) {
        var gametag = this.tmp_gametag_list[i];
        if (gametag.get("name").match(keyword)) {
          this.collection.add(gametag);
        }
      }
    } else {
      for (var i = 0; i < this.tmp_gametag_list.length; i++) {
        this.collection.add(this.tmp_gametag_list[i]);
      }
    }
  },
  removeTags: function () {
    this.$el.html("");
  }
});