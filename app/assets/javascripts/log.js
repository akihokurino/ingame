(function () {
	$(function () {
		var FormView = Backbone.View.extend({
			el: $(".log-form"),
			events: {
				"submit": "saveLog",
			},
			initialize: function () {
				this.amazon_url = $(".amazon_url_input");
				this.release_day = $(".release_day_input");
				this.text = $(".text_input");
			},
			saveLog: function (e) {
				e.preventDefault();

				var input = new Input({
					amazon_url: this.amazon_url.val(),
					release_day: this.release_day.val(),
					text: this.text.val()
				});

				input.save(null, {
					success: function (model, response, options) {
						console.log(response);
					},
					error: function () {
						console.log("error");
					}
				});
			}
		});

		var Input = Backbone.Model.extend({
			urlRoot: "/api/logs",
			defaults: {
				"amazon_url": "",
				"release_day": "",
				"text": ""
			}
		})

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
			url: "/api/logs"
		})

		var LogsView = Backbone.View.extend({
			el: $(".logs-list"),
			initialize: function () {
				this.collection = new Logs();
				this.collection.fetch({
					success: function () {

					},
					error: function () {
						console.log("error");
					}
				})
			},
			render: function () {

			}
		})

		var form_view = new FormView();
	})
})();
