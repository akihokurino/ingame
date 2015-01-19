class Gametag < ActiveRecord::Base
  has_many :game_gametags
  has_many :games, :through => :game_gametags

  validates :name,
    presence: true,
    uniqueness: true,
    length: {maximum: 255}
end
