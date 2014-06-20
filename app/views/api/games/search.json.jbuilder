json.results do |json|
  json.array!(@results) do |result|
  	json.id result[:id]
  	json.title result[:title]
    json.photo_path result[:photo_path]
    json.device result[:device]
    json.maker result[:maker]
  end
end