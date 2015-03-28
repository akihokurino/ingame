json.notifications do |json|
  json.array!(@notifications) do |notification|
    json.id notification[:id]
    json.to_user do |json|
      json.id notification.to_user[:id]
      json.username notification.to_user[:username]
      json.photo_path notification.to_user[:photo_path]
    end
    json.from_user do |json|
      json.id notification.from_user[:id]
      json.username notification.from_user[:username]
      json.photo_path notification.from_user[:photo_path]
    end
    json.text notification.notification_type.value
    json.post_id notification[:post_id]
  end
end