# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

%w(
	気になった
	買った
	遊んでいる
	遊び終わった
	積んでる
).each_with_index do |status, index|
	Status.create(name: status)
end
