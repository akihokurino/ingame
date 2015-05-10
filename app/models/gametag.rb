class Gametag < ActiveRecord::Base
  has_many :game_gametags
  has_many :games, :through => :game_gametags

  validates :name,
    presence: true,
    uniqueness: true,
    length: {maximum: 255}

  class << self
    def get_ranking
      week_num = 4

      gametags = []
      fetch_recent_tags = Proc.new do |start_week, last_week|
        Log.where(created_at: start_week..last_week).select(:game_id).group_by { |log| log[:game_id] }.values.sort { |a, b| a.length <= b.length }.reverse.map do |logs|

          gametags += logs[0].game.gametags.pluck(:name)
        end

        gametags.uniq
      end

      loop do
      end
    end
  end
end
