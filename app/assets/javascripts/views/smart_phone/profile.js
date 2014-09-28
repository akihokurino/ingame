//= require ../../models/log.js
//= require ../../collections/logs.js

(function () {
	$(function () {
		var user_id = $(".profile-page").data("userid");


		/* ---------- Collection --------- */
		var logs    = new Logs();



		/* ---------- View ---------- */
		var LogsView = Backbone.View.extend({
			el: $(".log-list"),
			initialize: function () {
				this.collection = logs;
				this.listenTo(this.collection, "add", this.addLog);
			},
			addLog: function (log) {
				if (log.id) {
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
				"click .playing":       "setPlaying",
				"click .ready":         "setAttention",
				"click .played":        "setArchive",
				"click .follow":        "follow",
				"click .unfollow":      "unfollow",
				"keypress .search-log": "search"
			},
			initialize: function () {
				var that               = this;
				this.logs_view         = new LogsView();

				this.attentions        = [];
				this.playings          = [];
				this.archives          = [];

				this.follow_template   = _.template($("#follow-template").html());
				this.unfollow_template = _.template($("#unfollow-template").html());

				this.search_log_title  = $(".search-log");
				this.current_tab       = null;

				$.ajax({
					type: "GET",
					url: "/api/logs?user_id=" + user_id,
					data: {},
					success: function (data) {
						for (var i = 0; i < data.logs.length; i++) {
							var log = new Log(data.logs[i]);
							switch (log.get("status").id) {
								case 1:
									that.attentions.push(log);
									that.logs_view.collection.add(log);
									that.current_tab = 1
									break;
								case 2:
									that.playings.push(log);
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
			setAttention: function () {
				this.logs_view.collection.reset();
				this.logs_view.removeLogs();
				this.$el.find("ul.sortBox li").removeClass("current");
				for (var i = 0; i < this.attentions.length; i++) {
					this.logs_view.collection.add(this.attentions[i]);
				}
				this.$el.find("ul.sortBox li.ready-li").addClass("current");
				this.current_tab = 1
			},
			setPlaying: function () {
				this.logs_view.collection.reset();
				this.logs_view.removeLogs();
				this.$el.find("ul.sortBox li").removeClass("current");
				for (var i = 0; i < this.playings.length; i++) {
					this.logs_view.collection.add(this.playings[i]);
				}
				this.$el.find("ul.sortBox li.playing-li").addClass("current");
				this.current_tab = 2
			},
			setArchive: function () {
				this.logs_view.collection.reset();
				this.logs_view.removeLogs();
				this.$el.find("ul.sortBox li").removeClass("current");
				for (var i = 0; i < this.archives.length; i++) {
					this.logs_view.collection.add(this.archives[i]);
				}
				this.$el.find("ul.sortBox li.played-li").addClass("current");
				this.current_tab = 3
			},
			follow: function () {
				var that = this;
				var data = {
					"follow": {
						"to_user_id": user_id
					}
				}

				$.ajax({
					type: "POST",
					url: "/api/follows",
					data: data,
					success: function (data) {
						if(data.result){
							that.$el.find(".follow-wrap").html("");
							that.$el.find(".follow-wrap").append(that.unfollow_template);
						}
					},
					error: function () {
						console.log("error");
					}
				})
			},
			unfollow: function () {
				var that = this;
				$.ajax({
					"type": "DELETE",
					url: "/api/follows/" + user_id,
					data: {},
					success: function (data) {
						if (data.result) {
							that.$el.find(".follow-wrap").html("");
							that.$el.find(".follow-wrap").append(that.follow_template);
						}
					},
					error: function () {
						console.log("error");
					}
				})
			},
			search: function (e) {
				e.preventDefault();
				if (e.which == 13 && this.search_log_title.val() != "") {
					this.logs_view.collection.reset();
					this.logs_view.removeLogs();
					this.$el.find("ul.sortBox li").removeClass("current");

					var keyword = new RegExp(this.search_log_title.val(), "i");

					switch (this.current_tab) {
						case 1:
							for (var i = 0; i < this.attentions.length; i++) {
								var log = this.attentions[i]
								if (log.get("game").title.match(keyword)) {
									this.logs_view.collection.add(log);
								}
							}
							break;
						case 2:
							for (var i = 0; i < this.playings.length; i++) {
								var log = this.playings[i]
								if (log.get("game").title.match(keyword)) {
									this.logs_view.collection.add(log);
								}
							}
							break;
						case 3:
							for (var i = 0; i < this.archives.length; i++) {
								var log = this.archives[i]
								if (log.get("game").title.match(keyword)) {
									this.logs_view.collection.add(log);
								}
							}
							break;
					}

					this.search_log_title.val("");
				}
			}
		})

		var app = new AppView();
	})
})();