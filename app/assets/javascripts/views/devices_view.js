var DevicesView = Backbone.View.extend({
  initialize: function () {
    this.tmp_device_list = [];
    this.listenTo(this.collection, "add", this.addDevice);
  },
  addDevice: function (device) {
    if (device.get("name")) {
      var device_view = new DeviceView({model: device});
      this.$el.append(device_view.render().el);
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
    for (var i = 0; i < response.devices.length; i++) {
      var device = new Device(response.devices[i]);
      this.collection.add(device);
      this.tmp_device_list.push(device);
    }
  },
  search: function (search_word) {
    this.collection.reset();
    this.removeDevices();

    if (search_word.length > 0) {
      var keyword = new RegExp(search_word, "i");

      for (var i = 0; i < this.tmp_device_list.length; i++) {
        var device = this.tmp_device_list[i];
        if (device.get("name").match(keyword)) {
          this.collection.add(device);
        }
      }
    } else {
      for (var i = 0; i < this.tmp_device_list.length; i++) {
        this.collection.add(this.tmp_device_list[i]);
      }
    }
  },
  removeDevices: function () {
    this.$el.html("");
  }
});