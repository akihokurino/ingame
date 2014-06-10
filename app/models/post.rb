class Post < ActiveRecord::Base
	belongs_to :user, counter_cache: true
	belongs_to :game

	validates :user_id,
		presense: true,
		numericality: true
	validates :game_id,
		presense: true,
		numericality: true
	validates :text,
		presense: true
end
