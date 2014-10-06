json.posts do |json|
  json.array!(@posts) do |post|
  	json.id post[:id]
  	json.text post[:text]
    json.i_liked post.i_liked
    json.created_at post.datetime
    json.post_likes_count post[:post_likes_count]
    json.post_comments_count post[:post_comments_count]
  	json.game do |json|
      json.id post.game[:id]
      json.title post.game[:title]
      json.photo_path post.game[:photo_path]
    end
    json.user do |json|
      json.id post.user[:id]
      json.username post.user[:username]
      json.photo_path post.user[:photo_path]
    end
    json.status do |json|
      json.id post.log.status[:id]
      json.name post.log.status[:name]
    end
    json.post_photos do |json|
      json.array!(post.post_photos) do |post_photo|
        json.id post_photo[:id]
        json.photo_path post_photo[:photo_path]
      end
    end
    json.post_comments do |json|
      json.array!(post.post_comments) do |post_comment|
        json.id post_comment[:id]
        json.text post_comment[:text]
        json.user do |json|
          json.id post_comment.user[:id]
          json.username post_comment.user[:username]
          json.photo_path post_comment.user[:photo_path]
        end
      end
    end
    json.current_user_id @current_user[:id]
  end
end
