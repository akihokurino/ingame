//= require ../../views/device_view
//= require ../../views/game_result_view
//= require ../../views/devices_view
//= require ../../views/game_results_view


(function () {
  var AppView = Backbone.View.extend({
    el: ".search-device-page",
    events: {
      "keyup .search-device": "searchDevice"
    },
    text_template: _.template($("#result-text-template").html()),
    initialize: function () {
      this.current_device = null;

      this.setMenuHeight();

      this.device_collection      = new Devices();
      this.devices_view           = new DevicesView({el: ".device-list", collection: this.device_collection});
      this.game_result_collection = new GameResults();
      this.game_results_view      = new GameResultsView({el: ".result-list", collection: this.game_result_collection, attributes: {type: null}});

      this.devices_view.render({});


      if (url_query.getQueryString()) {
        this.current_device = url_query.getQueryString().device;
        this.search();
      }
    },
    setMenuHeight: function () {
      var height = $(window).height() - $(".device-column").offset().top - 20;
      $(".device-column").css("height", height);
    },
    searchDevice: function (e) {
      var search_word = $(e.target).val();
      this.devices_view.search(search_word);
    },
    search: function () {
      var that = this;

      this.game_results_view.search({search_device: this.current_device, page: 1}, function (response) {
        that.$(".result-area").html((that.text_template({
          search_title: response.device, target: "ゲーム", result_count: response.count
        })));
      });
    }
  });

  var app = new AppView();
})();