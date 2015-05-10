//= require ../../views/gametag_view
//= require ../../views/game_result_view
//= require ../../views/gametags_view
//= require ../../views/game_results_view


(function () {
  var AppView = Backbone.View.extend({
    el: ".search-gametag-page",
    events: {
      "keyup .search-tag": "searchTag"
    },
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      this.current_gametag_id = null;

      this.setMenuHeight();

      this.gametag_collection     = new Gametags();
      this.gametags_view          = new GametagsView({el: ".gametag-list", collection: this.gametag_collection});
      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection, attributes: {type: null}});

      this.gametags_view.render({type: "all"});


      if (url_query.getQueryString()) {
        this.current_gametag_id = url_query.getQueryString().tag;
        this.search();
      }
    },
    setMenuHeight: function () {
      var height = $(window).height() - $(".gametag-column").offset().top - 20;
      $(".gametag-column").css("height", height);
    },
    searchTag: function (e) {
      var search_word = $(e.target).val();
      this.gametags_view.search(search_word);
    },
    search: function () {
      var that = this;

      this.game_results_view.search({search_tag_id: this.current_gametag_id, page: 1}, function (response) {

      });
    }
  });

  var app = new AppView();
})();