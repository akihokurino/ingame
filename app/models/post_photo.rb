class PostPhoto < ActiveRecord::Base
	belongs_to :post

	validates :post_id,
		presence: true,
		numericality: true
	validates :photo_path,
		presence: true,
		length: {maximum: 255}

  ROOT_DIR = File.expand_path "../../../", __FILE__

  after_destroy :destroy_resources

  private
  def destroy_resources
    system "rm #{ROOT_DIR}/public/post_photos/#{self[:photo_path]}" unless self[:photo_path].nil?
  end
end
