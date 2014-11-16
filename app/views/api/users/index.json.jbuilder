json.users do |json|
  json.array!(@users) do |user|
    json.id user[:id]
    json.username user[:username]
    json.introduction user[:introduction]
    json.photo_path user[:photo_path]
    json.place user[:place]
    json.i_followed user.i_followed
  end
end