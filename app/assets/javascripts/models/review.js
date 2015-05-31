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
    rate:                  "",
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
  getRelativeTime: function () {
    var relative_time = new CalculateTime(this.get("created_at")).getRelativeTime();
    this.set("created_at", relative_time);

    return this;
  },
  strimTextWidth: function (limit) {
    for (var i = 0; i < this.get("contents").length; i++) {
      if (this.get("contents")[i].content_type == "text") {
        var text = this.get("contents")[i].body;
        if (text.length > limit) {
          var new_text = text.slice(0, limit);
          new_text    += "...";
          this.get("contents")[i].body = new_text;
          this.set("isMore", true);
        } else {
          this.set("isMore", false);
        }

        break;
      }
    }

    return this;
  },
  sanitize: function () {
    for (var i = 0; i < this.get("contents").length; i++) {
      if (this.get("contents")[i].content_type == "text") {
        var text = this.get("contents")[i].body.replace(/\n/g, '<br>');
        text     = text.replace(/((http:|https:)\/\/[\x21-\x26\x28-\x7e]+)/gi, "<a class='link-text' target='_blank' href='$1'>$1</a>");
        this.get("contents")[i].body = text;
      }
    }

    return this;
  },
  like: function (callback) {
    var that = this;
    var data = {
      review_like: {
        review_id: this.id,
        user_id: null,
        to_user_id: this.get("user").id
      }
    };

    $.ajax({
      type: "POST",
      url: "/api/review_likes",
      data: data,
      success: function (data) {
        if (data) {
          that.set({
            i_liked: true,
            review_likes_count: parseInt(that.get("review_likes_count")) + 1
          }, {silent: true});

          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  },
  unlike: function (callback) {
    var that = this;

    $.ajax({
      type: "DELETE",
      url: "/api/review_likes/" + this.id,
      data: {},
      success: function (data) {
        if (data) {
          that.set({
            i_liked: false,
            review_likes_count: parseInt(that.get("review_likes_count")) - 1
          }, {silent: true});

          if (callback) {
            callback();
          }
        }
      },
      error: function () {

      }
    });
  },
});