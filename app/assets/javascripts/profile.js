(function () {
	$(function () {
		/* ---------- Model ---------- */
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
					"id": "",
					"name": ""
				}
			}
		})



		/* ---------- Collection ---------- */
		var Logs = Backbone.Collection.extend({
			model: Log,
			url: "/api/logs"
		})

		var logs = new Logs();



		/* ---------- View ---------- */
		var LogsView = Backbone.View.extend({
			el: $(".log-list"),
			initialize: function () {
				var that = this;
				this.collection = logs;
				this.listenTo(this.collection, "add", this.addLog);
			},
			addLog: function (log) {
				if(log.id){
					console.log("test")
					var log_view = new LogView({model: log});
					this.$el.prepend(log_view.render().el);
				}
			},
			removeLogs: function () {
				this.$el.html("");
			}
		})

		var LogView = Backbone.View.extend({
			tagName: "li",
			className: "item",
			events: {

			},
			initialize: function () {

			},
			template: _.template($("#log-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			}
		})

		var AppView = Backbone.View.extend({
			el: ".profile-page",
			events: {
				"click .playing": "setPlaying",
				"click .ready": "setAttention",
				"click .played": "setArchive"
			},
			initialize: function () {
				this.logs_view = new LogsView();
				this.attentions = [];
				this.playings = [];
				this.archives = [];
				var that = this;

				$.ajax({
					type: "GET",
					url: "/api/logs",
					data: {},
					success: function (data) {
						for(var i = 0; i < data.logs.length; i++){
							var log = new Log(data.logs[i]);
							switch(log.get("status").id){
								case 1:
									that.attentions.push(log);
									break;
								case 2:
									that.playings.push(log);
									that.logs_view.collection.add(log);
									break;
								case 3:
									that.archives.push(log);
									break;
							}
						}
					},
					error: function () {
						console.log("error");
					}
				})
			},
			setPlaying: function () {
				this.$el.find("ul.sortBox li").removeClass("current");
				this.logs_view.removeLogs();
				for(var i = 0; i < this.playings.length; i++){
					this.logs_view.addLog(this.playings[i]);
				}
				this.$el.find("ul.sortBox li.playing-li").addClass("current");
			},
			setAttention: function () {
				this.$el.find("ul.sortBox li").removeClass("current");
				this.logs_view.removeLogs();
				for(var i = 0; i < this.attentions.length; i++){
					this.logs_view.addLog(this.attentions[i]);
				}
				this.$el.find("ul.sortBox li.ready-li").addClass("current");
			},
			setArchive: function () {
				this.$el.find("ul.sortBox li").removeClass("current");
				this.logs_view.removeLogs();
				for(var i = 0; i < this.archives.length; i++){
					this.logs_view.addLog(this.archives[i]);
				}
				this.$el.find("ul.sortBox li.played-li").addClass("current");
			}
		})

		var app = new AppView();
	})
})();