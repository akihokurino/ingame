class PostPhoto < ActiveRecord::Base
	belongs_to :post

	validates :post_id,
		presense: true,
		numericality: true
	validates :photo_path,
		presense: true,
		length: {maximum: 255}
end
