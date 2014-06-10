class PostLike < ActiveRecord::Base
	belongs_to :post, counter_cache: true
	belongs_to :user

	validates :post_id,
		presence: true,
		numericality: true
	validates :user_id,
		presence: true,
		numericality: true
end
