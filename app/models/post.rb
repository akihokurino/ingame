class Post < ActiveRecord::Base
	belongs_to :user, counter_cache: true
	belongs_to :game

	validates :user_id,
		presence: true,
		numericality: true
	validates :game_id,
		presence: true,
		numericality: true
	validates :text,
		presence: true
end
