var Log = Backbone.Model.extend({
	defaults: {
		"text": ""
		"game": {
			"title": "",
			"photo_path": "",
			"device": "",
			"price": "",
			"maker": "",
			"release_day": "",
			"game_like_count": 0
		},
		"status": {
			"name": ""
		}
	}
})

var Logs = Backbone.Collection.extend({
	model: Log,
	url: "/logs.json"
})

var LogsView = Backbone.View.extend({
	el: $("#logs"),
	initialize: function () {
		this.collection = new Logs();
		this.collection.fetch({
			error: $.proxy(this.error, this)
			success: $.proxy(this.render, this)
		})
	},
	render: function () {

	}
})