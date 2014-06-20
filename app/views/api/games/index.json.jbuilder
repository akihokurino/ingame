json.games do |json|
  json.array!(@games) do |game|
  	json.id game[:id]
  	json.title game[:title]
  end
end