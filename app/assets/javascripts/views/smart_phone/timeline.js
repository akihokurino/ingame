//= require ../../models/post.js
//= require ../../models/comment.js
//= require ../../collections/posts.js
//= require ../../collections/comments.js
//= require ../../libs/socket.js

(function () {
	$(function () {


		/* ---------- View ---------- */
		var PostsView = Backbone.View.extend({
			el: $(".post-list"),
			initialize: function () {
				this.listenTo(this.collection, "add", this.addPost);
			},
			addPost: function (post) {
				if (post.id) {
					post.strimWidth(40);
					var post_view = new PostView({model: post});
					this.$el.append(post_view.render().el);
				}
			},
			render: function () {

			}
		})

		var PostView = Backbone.View.extend({
			tagName: "article",
			className: "postBox",
			events: {
				"click .delete":      "destroy",
				"click .like" :       "like",
				"click .unlike":      "unlike",
				"click .comment-btn": "showComment",
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
				var that = this;
				var data = {
					"post_like": {
						"post_id": this.model.id,
						"user_id": null,
						"to_user_id": this.model.get("user").id
					}
				};

				$.ajax({
					type: "POST",
  					url: "/api/post_likes",
  					data: data,
  					success: function (data) {
  						if (data) {
  							that.model.set({
  								"i_liked": true,
  								"post_likes_count": parseInt(that.model.get("post_likes_count")) + 1
  							});
  						}
  					},
  					error: function () {

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
						if (data) {
  							that.model.set({
  								"i_liked": false,
  								"post_likes_count": parseInt(that.model.get("post_likes_count")) - 1
  							});
  						}
					},
					error: function () {

					}
				})
			},
			showComment: function (e) {
				e.preventDefault();

				app.comment_modal_view.model      = this.model;
				app.comment_modal_view.collection = new Comments(this.model.get("post_comments"));
				app.comments_view                 = new CommentsView({collection: app.comment_modal_view.collection});

				$(".comment-modal").css("display", "block");
				$(".layer").css("display", "block");
			}
		})

		var CommentsView = Backbone.View.extend({
			el: ".comment-list",
			initialize: function () {
				this.refresh();
				this.listenTo(this.collection, "add", this.addComment);
				this.render();
			},
			addComment: function (comment) {
				if (comment.id) {
					var comment_view = new CommentView({model: comment});
					this.$el.append(comment_view.render().el);
				}
			},
			refresh: function () {
				this.$el.html("");
			},
			render: function () {
				var that = this;

				this.collection.each(function (model) {
					var comment_view = new CommentView({model: model});
					that.$el.append(comment_view.render().el);
				})

				return this;
			}
		})

		var CommentView = Backbone.View.extend({
			tagName: "li",
			className: "comment",
			template: _.template($("#comment-template").html()),
			render: function () {
				var template = this.template(this.model.toJSON());
				this.$el.html(template);

				return this;
			}
		})

		var CommentModalView = Backbone.View.extend({
			el: ".comment-modal",
			events: {
				"click .cancel-btn": "hideComment",
				"click .submit-btn": "postComment"
			},
			initialize: function () {
				this.comment_input = this.$(".comment-input");
				this.model         = null;
			},
			hideComment: function () {
				app.comment_modal_view.model      = null;
				app.comment_modal_view.collection = null;
				app.comments_view                 = null;

				$(".comment-modal").css("display", "none");
				$(".layer").css("display", "none");

				this.comment_input.val("");
			},
			postComment: function () {
				if (this.comment_input.val() != "") {
					var that = this;

					var data = {
						"post_comment": {
							"post_id":    this.model.id,
							"text":       this.comment_input.val(),
							"to_user_id": this.model.get("user").id
						}
					}

					this.collection.create(data, {
						method: "POST",
						success: function (response) {
							var comment = new Comment(response.get("comment"));
							that.collection.add(comment);
							that.model.get("post_comments").push(response.get("comment"));
							that.model.set("post_comments_count", that.model.get("post_comments_count") + 1);

							that.comment_input.val("");
						},
						error: function () {
							console.log("error");
						}
					})
				}
			}
		})

		var AppView = Backbone.View.extend({
			el: ".timeline-page",
			initialize: function () {
				_.bindAll(this, "pagenation");

				this.post_collection    = new Posts();
				this.comment_collection = null;
				this.posts_view         = new PostsView({collection: this.post_collection});
				this.comment_modal_view = new CommentModalView({collection: this.comment_collection});
				this.socket             = new Socket("localhost:3000/websocket", true, "post", function () {});
				this.page               = 1;
				var that                = this;


				this.post_collection.fetch({
					data: {page: this.page},
					success: function (model, response, options) {
						for (var i = 0; i < response.posts.length; i++) {
							var post = new Post(response.posts[i]);
							that.posts_view.collection.add(post);
						}
					},
					error: function () {

					}
				})

				$(window).bind("scroll", this.pagenation);
			},
			pagenation: function () {
				var that           = this;
				var scrollHeight   = $(document).height();
				var scrollPosition = $(window).height() + $(window).scrollTop();
				if ((scrollHeight - scrollPosition) / scrollHeight <= 0.1) {
					$(".loading-gif").css("display", "block");
					$(window).unbind("scroll");
					this.page += 1;

					this.post_collection.fetch({
						data: {page: this.page},
						success: function (model, response, options) {
							for (var i = 0; i < response.posts.length; i++) {
								var post = new Post(response.posts[i]);
								that.posts_view.collection.add(post);
							}

							$(".loading-gif").css("display", "none");

							if (response.posts.length != 0) {
								$(window).bind("scroll", that.pagenation);
							}
						},
						error: function () {

						}
					})
				}
			}
		})

		var app = new AppView();
	})
})();