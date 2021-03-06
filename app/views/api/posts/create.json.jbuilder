unless @last_post.nil?
  json.last_post do |json|
    json.id @last_post[:id]
    json.text @last_post[:text]
    json.i_liked @last_post.i_liked
    json.created_at @last_post.datetime
    json.post_likes_count @last_post[:post_likes_count]
    json.post_comments_count @last_post[:post_comments_count]
    json.game do |json|
      json.id @last_post.game[:id]
      json.title @last_post.game[:title]
      json.photo_url @last_post.game[:photo_url]
      json.photo_path @last_post.game[:photo_path]
      json.device @last_post.game[:device]
    end
    json.user do |json|
      json.id @last_post.user[:id]
      json.username @last_post.user[:username]
      json.photo_path @last_post.user[:photo_path]
    end
    json.status do |json|
      json.id @last_post.log.status[:id]
      json.name @last_post.log.status[:name]
    end
    json.post_photos do |json|
      json.array!(@last_post.post_photos) do |post_photo|
        json.id post_photo[:id]
        json.photo_path post_photo[:photo_path]
      end
    end
    json.post_comments do |json|
      json.array!(@last_post.post_comments) do |post_comment|
        json.id post_comment[:id]
        json.text post_comment[:text]
        json.comment_likes_count post_comment[:post_comment_likes_count]
        json.i_liked post_comment.i_liked
        json.created_at post_comment.datetime
        json.user do |json|
          json.id post_comment.user[:id]
          json.username post_comment.user[:username]
          json.photo_path post_comment.user[:photo_path]
        end
      end
    end
    json.post_urls do |json|
      json.array!(@last_post.post_urls) do |post_url|
        json.id post_url[:id]
        json.title post_url[:title]
        json.description post_url[:description]
        json.thumbnail post_url[:thumbnail]
        json.url post_url[:url]
      end
    end
    json.current_user_id @current_user[:id]
  end
end

unless @error.nil?
  json.error @error
end