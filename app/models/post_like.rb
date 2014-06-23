class PostLike < ActiveRecord::Base
	belongs_to :post, counter_cache: true
	belongs_to :user

	validates :post_id,
		presence: true,
		numericality: true
	validates :user_id,
		presence: true,
		numericality: true

	class << self
		def check_and_create(post_like_params)
			return false if self.exists?(post_like_params)
			self.create(post_like_params) ? true : false
		end

		def check_and_destroy(param_hash)
			return false unless self.exists?(param_hash)
			post_like = self.find_by(param_hash)
			post_like.destroy ? true : false
		end
	end
end
