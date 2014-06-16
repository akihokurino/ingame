(function () {
	$(function () {
		/* ---------- Model ---------- */
		var Input = Backbone.Model.extend({
			urlRoot: "/api/logs",
			defaults: {
				"amazon_url": "",
				"release_day": "",
				"text": "",
				"status_id": ""
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

		var Status = Backbone.Model.extend({
			defaults: {
				"id": "",
				"name": ""
			}
		})

		var Logs = Backbone.Collection.extend({
			model: Log,
			url: "/api/logs"
		})

		var Statuses = Backbone.Collection.extend({
			model: Status,
			url: "/api/statuses"
		})

		var logs = new Logs();


		/* ---------- View ---------- */
		var StatusesView = Backbone.View.extend({
			el: $(".status-select"),
			initialize: function () {
				var that = this;
				this.collection = new Statuses();
				this.listenTo(this.collection, "add", this.addStatus);
				this.collection.fetch({
					success: function (collection, response, options) {
						console.log(response);
						if(response.statuses && response.statuses.length > 0){
							for(var i = 0; i < response.statuses.length; i++){
								var status = new Status(response.statuses[i]);
								that.collection.add(status);
							}
						}
					},
					error: function () {
						console.log("error");
					}
				}, {wait: true})
			},
			addStatus: function (status) {
				if(status.id){
					var status_view = new StatusView({model: status});
					this.$el.append(status_view.render().el);
				}
			}
		})

		var StatusView = Backbone.View.extend({
			tagName: "option",
			template: _.template($("#status-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				this.$el.attr("value", this.model.id);
				return this;
			}
		})

		var FormView = Backbone.View.extend({
			el: $(".log-form"),
			events: {
				"submit": "saveLog"
			},
			initialize: function () {
				this.collection = logs;
				this.amazon_url = $(".amazon-url-input");
				this.release_day = $(".release-day-input");
				this.text = $(".text-input");
				this.status = $(".status-select");
			},
			saveLog: function (e) {
				var that = this;
				e.preventDefault();

				var input = new Input({
					amazon_url: this.amazon_url.val(),
					release_day: this.release_day.val(),
					text: this.text.val(),
					status_id: this.status.val()
				});

				input.save(null, {
					success: function (model, response, options) {
						var log = new Log(response.log);
						that.collection.add(response.log);
					},
					error: function () {
						console.log("error");
					}
				});
			}
		})

		var LogView = Backbone.View.extend({
			tagName: "li",
			events: {
				"click .delete": "destroy"
			},
			initialize: function () {
				this.model.on("destroy", this.remove, this);
				this.model.on("change", this.render, this);
			},
			destroy: function () {
				this.model.destroy();
			},
			remove: function () {
				this.$el.remove();
			},
			template: _.template($("#log-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			}
		})

		var LogsView = Backbone.View.extend({
			el: $(".log-list"),
			initialize: function () {
				var that = this;
				this.collection = logs;
				this.listenTo(this.collection, "add", this.addLog);
				this.collection.fetch({
					success: function (collection, response, options) {
						if(response.logs && response.logs.length > 0){
							for(var i = 0; i < response.logs.length; i++){
								var log = new Log(response.logs[i]);
								that.collection.add(log);
							}
						}
						//that.render();
					},
					error: function () {
						console.log("error");
					}
				}, {wait: true})
			},
			render: function () {
				/*
				console.log(this.collection);
				this.collection.each(function(log){
					console.log(log);
					if(log.id){
						var log_view = new LogView({model: log});
						this.$el.prepend(log_view.render().el);
					}
				}, this);

				return this;
				*/
			},
			addLog: function (log) {
				if(log.id){
					var log_view = new LogView({model: log});
					this.$el.prepend(log_view.render().el);
				}
			}
		})

		var form_view = new FormView();
		var logs_view = new LogsView();
		var statuses_view = new StatusesView();
	})
})();
