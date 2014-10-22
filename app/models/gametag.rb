class Gametag < ActiveRecord::Base
  has_many :game_gametags
  has_many :games, :through => :game_gametags
end
