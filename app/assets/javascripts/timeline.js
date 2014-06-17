(function () {
	$(function () {
		/* ---------- Model ---------- */
		var Input = Backbone.Model.extend({
			urlRoot: "/api/posts",
			defaults: {
				"post": {
					"text": "",
					"game_id": ""
				}
			}
		})

		var Post = Backbone.Model.extend({
			defaults: {
				"id": "",
				"text": "",
				"post_likes_count": "",
				"game": {
					"id": "",
					"title": "",
					"photo_path": "",
				},
				"user": {
					"id": "",
					"username": "",
					"photo_path": ""
				},
				"current_user_id": ""
			}
		})

		var Game = Backbone.Model.extend({
			defaults: {
				"id": "",
				"title": ""
			}
		})

		var Posts = Backbone.Collection.extend({
			model: Post,
			url: "/api/posts"
		})

		var Games = Backbone.Collection.extend({
			model: Game,
			url: "api/games"
		})

		var posts = new Posts();


		/* ---------- View ---------- */
		var GamesView = Backbone.View.extend({
			el: $(".game-select"),
			initialize: function () {
				var that = this;
				this.collection = new Games();
				this.listenTo(this.collection, "add", this.addGame);
				this.collection.fetch({
					success: function (collection, response, options) {
						console.log(response);
						if(response.games && response.games.length > 0){
							for(var i = 0; i < response.games.length; i++){
								var game = new Game(response.games[i])
								that.collection.add(game);
							}
						}
					},
					error: function () {
						console.log("error");
					}
				}, {wait: true})
			},
			addGame: function (game) {
				if(game.id){
					var game_view = new GameView({model: game});
					this.$el.append(game_view.render().el);
				}
			}
		})

		var GameView = Backbone.View.extend({
			tagName: "option",
			template: _.template($("#game-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				this.$el.attr("value", this.model.id);
				return this;
			}
		})

		var FormView = Backbone.View.extend({
			el: $(".post-form"),
			events: {
				"submit": "savePost"
			},
			initialize: function () {
				this.collection = posts;
				this.text = $(".text-input");
				this.game_id = $(".game-select");
			},
			savePost: function (e) {
				e.preventDefault();

				var that = this;
				var input = new Input({
					post: {
						text: this.text.val(),
						game_id: this.game_id.val()
					}
				});

				input.save(null, {
					success: function (model, response, options) {
						var post = new Post(response.post);
						that.collection.add(response.post);
					},
					error: function () {
						console.log("error");
					}
				})
			}
		})

		var PostView = Backbone.View.extend({
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
			template: _.template($("#post-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			}
		})

		var PostsView = Backbone.View.extend({
			el: $(".post-list"),
			initialize: function () {
				var that = this;
				this.collection = posts;
				this.listenTo(this.collection, "add", this.addPost);
				this.collection.fetch({
					success: function (collection, response, options) {
						console.log(response);
						if(response.posts && response.posts.length > 0){
							for(var i = 0; i < response.posts.length; i++){
								var post = new Post(response.posts[i]);
								that.collection.add(post);
							}
						}
					},
					error: function () {
						console.log("error");
					}
				})
			},
			addPost: function (post) {
				if(post.id){
					var post_view = new PostView({model: post});
					this.$el.prepend(post_view.render().el);
				}
			}
		})

		var form_view = new FormView();
		var posts_view = new PostsView();
		var games_view = new GamesView();
	})
})();