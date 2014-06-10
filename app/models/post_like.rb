class PostLike < ActiveRecord::Base
	belongs_to :post, counter_cache: true
	belongs_to :user

	validates :post_id,
		presense: true,
		numericality: true
	validates :user_id,
		presense: true,
		numericality: true
end
