json.post_comments do |json|
  json.array!(@post_comments) do |post_comment|
    json.extract! post_comment, :id, :post_id, :text, :updated_at
    json.i_liked post_comment.i_liked
    json.created_at post_comment.datetime
    json.comment_likes_count post_comment[:post_comment_likes_count]
    json.user do |json|
      json.extract! post_comment.user, :id, :username, :photo_path
    end
    json.current_user_id @current_user[:id]
  end
end
json.is_all @is_all