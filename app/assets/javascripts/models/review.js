var Review = Backbone.Model.extend({
  defaults: {
    id:                    "",
    title:                 "",
    review_likes_count:    "",
    review_comments_count: "",
    i_liked:               "",
    view_count:            "",
    created_at:            "",
    contents:              [],
    review_comments:       [],
    is_my_review:          "",
    game: {
      id:         "",
      title:      "",
      photo_url:  "",
      photo_path: "",
      device:     ""
    },
    user: {
      id:         "",
      username:   "",
      photo_path: ""
    },
    status: {
      id:   "",
      name: ""
    }
  },
  url: "/api/reviews/",
});