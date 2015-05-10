class Gametag < ActiveRecord::Base
  has_many :game_gametags
  has_many :games, :through => :game_gametags

  validates :name,
    presence: true,
    uniqueness: true,
    length: {maximum: 255}

  class << self
    def custom_query(type)
      case type
      when "ranking"
        self.get_ranking
      else
        self.none
      end
    end

    def get_ranking
      limit     = 20
      offset    = 0
      gametags  = []
      result    = []

      fetch_recent_tags = Proc.new do |limit, offset|
        Log.includes(:game).order("created_at DESC").offset(offset).limit(limit).select(:game_id).group_by { |log| log[:game_id] }.values.sort { |a, b| a.length <=> b.length }.reverse.map do |logs|

          gametags += logs[0].game.gametags.pluck(:id, :name)
        end

        gametags.uniq
      end

      result = loop do
        if result.length > 15
          break result[0, 15]
        else
          result = fetch_recent_tags.call limit, offset
        end

        limit  += 20
        offset += 20
      end

      result.map {|tag| {id: tag[0], name: tag[1]} }
    end
  end
end
