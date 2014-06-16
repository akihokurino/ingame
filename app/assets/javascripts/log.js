(function () {
	$(function () {
		// Model

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
				"id": "",
				"text": "",
				"game": {
					"id": "",
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

		var logs = new Logs();



		//View

		var FormView = Backbone.View.extend({
			el: $(".log-form"),
			events: {
				"submit": "saveLog",
			},
			initialize: function () {
				this.collection = logs;
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
						var log = new Log(response.log);
						logs_view.addLog(log);
					},
					error: function () {
						console.log("error");
					}
				});
			}
		});

		var LogView = Backbone.View.extend({
			tagName: "li",
			events: {
				"click .delete": "destroy"
			},
			initialize: function(){
				this.model.on("destroy", this.remove, this);
				this.model.on("change", this.render, this);
			},
			destroy: function(){
				this.model.destroy();
			},
			remove: function(){
				this.$el.remove();
			},
			template: _.template($("#log-template").html()),
			render: function(){
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			}
		});

		var LogsView = Backbone.View.extend({
			el: $(".log-list"),
			initialize: function () {
				var that = this;
				this.collection = logs;
				this.listenTo(this.collection, "add", this.addLog);
				this.collection.fetch({
					success: function (collection, response, options) {
						console.log(response);
						if(response.logs && response.logs.length > 0){
							for(var i = 0; i < response.logs.length; i++){
								var log = new Log(response.logs[i]);
								that.collection.add(log);
							}
						}
					},
					error: function () {
						console.log("error");
					}
				})
			},
			render: function () {
				console.log(this.collection);
				/*
				this.collection.each(function(log){
					var log_view = new LogView({model: log});
					this.$el.append(log_view.render().el);
				}, this);
				return this;
				*/
			},
			addLog: function (log) {
				var log_view = new LogView({model: log});
				this.$el.prepend(log_view.render().el);
			}
		})

		var form_view = new FormView();
		var logs_view = new LogsView();
	})
})();
