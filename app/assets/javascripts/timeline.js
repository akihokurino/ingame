(function () {
	$(function () {
		/* ---------- Model ---------- */
		var PostInput = Backbone.Model.extend({
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
				"i_liked": "",
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



		/* ---------- Collection ---------- */
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
		var PostFormView = Backbone.View.extend({
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
				var post_input = new PostInput({
					post: {
						text: this.text.val(),
						game_id: this.game_id.val()
					}
				});

				post_input.save(null, {
					success: function (model, response, options) {
						var post = new Post(response.post);
						that.collection.add(post);
					},
					error: function () {
						console.log("error");
					}
				})
			}
		})

		var GamesSelectView = Backbone.View.extend({
			el: $(".game-select"),
			initialize: function () {
				var that = this;
				this.collection = new Games();
				this.listenTo(this.collection, "add", this.addGame);
				this.collection.fetch({
					success: function (collection, response, options) {
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

		var PostsView = Backbone.View.extend({
			el: $(".post-list"),
			initialize: function () {
				var that = this;
				this.collection = posts;
				this.listenTo(this.collection, "add", this.addPost);
				this.collection.fetch({
					success: function (collection, response, options) {
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

		var PostView = Backbone.View.extend({
			tagName: "li",
			events: {
				"click .delete": "destroy",
				"click .like" : "like",
				"click .unlike": "unlike"
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
			template: _.template($("#post-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);
				return this;
			},
			like: function () {
				var data = {
					"post_like": {
						"post_id": this.model.id,
						"user_id": null
					}
				};
				var that = this;

				$.ajax({
					type: "POST",
  					url: "/api/post_likes",
  					data: data,
  					success: function (data) {
  						if(data){
  							that.model.set({
  								"i_liked": true,
  								"post_likes_count": parseInt(that.model.get("post_likes_count")) + 1
  							});
  						}
  					},
  					error: function () {
  						console.log("error");
  					}
				})
			},
			unlike: function () {
				var that = this;
				$.ajax({
					type: "DELETE",
					url: "/api/post_likes/" + this.model.id,
					data: {},
					success: function (data) {
						if(data){
  							that.model.set({
  								"i_liked": false,
  								"post_likes_count": parseInt(that.model.get("post_likes_count")) - 1
  							});
  						}
					},
					error: function () {
						console.log("error");
					}
				})
			}
		})


		var post_form_view = new PostFormView();
		var games_select_view = new GamesSelectView();
		var posts_view = new PostsView();
	})
})();