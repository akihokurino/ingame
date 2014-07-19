//= require ./models/log.js
//= require ./models/result.js
//= require ./collections/logs.js
//= require ./collections/results.js

(function () {
	$(function () {
		var user_id = $(".logs-page").data("userid");

		/* ---------- Collection ---------- */
		var logs = new Logs();
		var results = new Results();



		/* ---------- View ---------- */
		var AmazonFormView = Backbone.View.extend({
			el: $(".log-form"),
			events: {
				"submit": "saveLog"
			},
			initialize: function () {
				this.collection = logs;
				this.amazon_url = $(".amazon-url-input");
				this.text = $(".text-input");
				this.status = $(".status-select");
			},
			saveLog: function (e) {
				var that = this;
				e.preventDefault();

				var data = {
					"amazon_url": this.amazon_url.val(),
					"text": this.text.val(),
					"status_id": this.status.val()
				}

				$.ajax({
					type: "POST",
					url: "/api/logs",
					data: data,
					success: function (data) {
						var log = new Log(data.log);
						that.collection.add(log);
					},
					error: function () {
						console.log("error");
					}
				})
			}
		})

		var SearchFormView = Backbone.View.extend({
			el: $(".search-form"),
			events: {
				"submit": "search"
			},
			initialize: function () {
				this.collection = results;
				this.search_title = $(".search-title-input");
			},
			search: function (e) {
				var that = this;
				e.preventDefault();

				this.collection.fetch({
					data: {search_title: this.search_title.val()},
					success: function (model, response, options) {
						that.collection.reset();
						app.results_view.$el.html("");
						if(response.results && response.results.length > 0){
							for(var i = 0; i < response.results.length; i++){
								var result = new Result(response.results[i]);
								that.collection.add(result);
							}
						}
					},
					error: function () {
						console.log("error");
					}
				})
			}
		})

		var ResultsView = Backbone.View.extend({
			el: $(".result-list"),
			initialize: function () {
				this.collection = results;
				this.listenTo(this.collection, "add", this.addResult);
			},
			addResult: function (result) {
				if(result.id){
					var result_view = new ResultView({model: result});
					this.$el.prepend(result_view.render().el);
				}
			}
		})

		var ResultView = Backbone.View.extend({
			tagName: "li",
			events: {
				"click .regist-btn": "regist"
			},
			initialize: function () {
				this.collection = logs;
			},
			remove: function () {
				this.$el.remove();
			},
			template: _.template($("#result-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			},
			regist: function () {
				var that = this;

				var data = {
					"log": {
						"game_id": this.model.id,
						status_id: this.$el.find("select").val()
					}
				}

				$.ajax({
					type: "POST",
					url: "/api/logs",
					data: data,
					success: function (data) {
						var log = new Log(data.log);
						that.collection.add(log);
						that.remove();
					},
					error: function () {
						cnsole.log("error");
					}
				})
			}
		})

		var LogsView = Backbone.View.extend({
			el: $(".log-list"),
			initialize: function () {
				this.collection = logs;
				this.listenTo(this.collection, "add", this.addLog);
			},
			addLog: function (log) {
				if(log.id){
					var log_view = new LogView({model: log});
					this.$el.prepend(log_view.render().el);
				}
			}
		})

		var LogView = Backbone.View.extend({
			tagName: "li",
			events: {
				"click .delete": "destroy"
			},
			initialize: function () {
				this.listenTo(this.model, "destroy", this.remove);
				this.listenTo(this.model, "change", this.render);
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

		var AppView = Backbone.View.extend({
			el: ".logs-page",
			initialize: function () {
				this.amazon_form_view = new AmazonFormView();
				this.search_form_view = new SearchFormView();
				this.logs_view = new LogsView();
				this.results_view = new ResultsView();
				this.collection = logs;
				var that = this;

				this.collection.fetch({
					data: {user_id: user_id},
					success: function (model, response, options) {
						for(var i = 0; i < response.logs.length; i++){
							var log = new Log(response.logs[i]);
							that.logs_view.collection.add(log);
						}
					},
					error: function () {
						console.log("error");
					}
				})
			}
		})

		var app = new AppView();
	})
})();
