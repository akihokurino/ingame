class Post < ActiveRecord::Base
  belongs_to :user, counter_cache: true
  belongs_to :game, counter_cache: true
  belongs_to :log
  has_many :post_likes
  has_many :post_photos
  has_many :post_comments

  validates :user_id,
    presence: true,
    numericality: true
  validates :game_id,
    presence: true,
    numericality: true
  validates :text,
    presence: true

  attr_accessor :i_liked

  LIMIT = 20

  scope :all_include, -> {
    includes(:game).includes(:log).includes(:user).includes(:post_likes).includes(:post_photos).includes(:post_comments)
  }

  def save_files(files)
    files.each do |file|
      case file
      when /png/
        extname = ".png"
      when /jpg|jpeg/
        extname = ".jpg"
      when /gif/
        extname = ".gif"
      end

      name = self.class.generate_random_name("alphabet", 10)
      filename = "#{name}#{extname}"
      File.open("public/post_photos/#{filename}", "wb") do |f|
        file = file.sub(/^.*,/, '')
        f.write(Base64.decode64(file))
      end
      PostPhoto.create!(post_id: self[:id], photo_path: filename)
    end
  end

  class << self
    def get_all_posts(current_user_id, page)
      offset       = (page - 1) * LIMIT
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      follower_ids << current_user_id
      posts        = self.where(user_id: follower_ids).all_include.order("created_at DESC").offset(offset).limit(LIMIT)
      posts        = self.i_like?(posts, current_user_id)
    end

    def get_all_posts_of_game(current_user_id, game_id)
      posts = self.where(game_id: game_id).all_include
      posts = self.i_like?(posts, current_user_id)
    end

    def get_follower_posts_of_game(current_user_id, game_id)
      follower_ids = Follow.where(from_user_id: current_user_id).pluck(:to_user_id)
      posts        = self.where(game_id: game_id, user_id: follower_ids).all_include
      posts        = self.i_like?(posts, current_user_id)
    end

    def i_like?(post_args, current_user_id)
      post_args.map do |post|
        post.i_liked = post.post_likes.pluck(:user_id).include?(current_user_id) ? true : false
        post
      end
    end

    def generate_random_name(type = "alphabet", size = 8)
      char_list_str = []
      char_list_str = ("a".."z").to_a if type == "alphabet"
      char_list_str = (0..9).to_a if type == "number"

      return false if size < 1

      if size == 1
        char_list_str.sample
      else
        char_list_str.sort_by{rand}.take(size).join("")
      end
    end
  end
end
