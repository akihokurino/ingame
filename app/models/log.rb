class Log < ActiveRecord::Base
	include PostTwitter
	include PostFacebook

	belongs_to :game
	belongs_to :status
	belongs_to :user, counter_cache: true
	has_many :posts, dependent: :destroy
	has_one :review, dependent: :destroy

	validates :game_id,
		presence: true,
		numericality: true
	validates :user_id,
		presence: true,
		numericality: true
	validates :status_id,
		presence: true,
		numericality: true

	def facebook(current_user)
		if user_provider = current_user.user_providers.find_by(service_name: "facebook")
			return unless user_provider[:share_log_status]

			self.post_facebook user_provider
		end
	end

	def twitter(current_user)
		if user_provider = current_user.user_providers.find_by(service_name: "twitter")
			return unless user_provider[:share_log_status]

			text = "【#{self.status[:name]}】- #{self.game[:title]} http://gamr.jp/games/#{self.game[:id]}#all #gamr"
			self.post_twitter user_provider, text
		end
	end

	class << self
		def create_with(result, current_user)
			game = Game.find_or_create_by! result
			log  = self.create({game_id: game[:id], user_id: current_user[:id], status_id: 1})
		end
	end
end
