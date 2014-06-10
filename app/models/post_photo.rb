class PostPhoto < ActiveRecord::Base
	belongs_to :post

	validates :post_id,
		presence: true,
		numericality: true
	validates :photo_path,
		presence: true,
		length: {maximum: 255}
end
