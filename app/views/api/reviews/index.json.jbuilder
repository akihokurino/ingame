json.reviews do |json|
  json.array!(@reviews) do |review|
    json.extract! review, :id, :title, :review_likes_count, :review_comments_count, :view_count, :created_at

    json.game do |json|
      json.extract! review.game, :id, :title, :photo_url, :photo_path, :device
    end
    json.user do |json|
      json.extract! review.user, :id, :username, :photo_path
    end
    json.status do |json|
      json.id   review.log.status[:id]
      json.name review.log.status[:name]
    end
    json.rate review.log[:rate]
    json.is_my_review @current_user[:id] == review.user[:id]
  end
end
