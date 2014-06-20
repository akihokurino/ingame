(function () {
	$(function () {
		/* ---------- Model ---------- */
		var SearchInput = Backbone.Model.extend({
			urlRoot: "/api/games/search",
			defaults: {
				"search_title": ""
			}
		})

		var Result = Backbone.Model.extend({
			urlRoot: "/api/logs",
			defaults: {
				"title": "",
				"photo_path": "",
				"device": "",
				"maker": ""
			}
		})

		var RegistGame = Backbone.Model.extend({
			urlRoot: "/api/logs"
		})

		var Input = Backbone.Model.extend({
			urlRoot: "/api/logs",
			defaults: {
				"amazon_url": "",
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
					"maker": "",
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



		/* ---------- Collection ---------- */
		var Results = Backbone.Collection.extend({
			model: Result,
			url: "/api/games/search"
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
		var results = new Results();



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

		var SearchView = Backbone.View.extend({
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

				var search_title = this.search_title.val();

				this.collection.reset([]);
				this.collection.fetch({
					data: {search_title: search_title},
					success: function (model, response, options) {
						console.log(response.results)
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

		var FormView = Backbone.View.extend({
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
				var regist_game = new RegistGame({
					log: {
						game_id: this.model.id
					}
				});
				regist_game.save(null, {
					success: function (model, response, options) {
						console.log(response);
						that.collection.add(response.log);
						that.remove();
					},
					error: function () {
						console.log("error");
					}
				})
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

		var ResultsView = Backbone.View.extend({
			el: $(".result-list"),
			initialize: function () {
				var that = this;
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
					},
					error: function () {
						console.log("error");
					}
				}, {wait: true})
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
		var search_view = new SearchView();
		var results_view = new ResultsView();
	})
})();
