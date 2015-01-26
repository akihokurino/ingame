class GameGametag < ActiveRecord::Base
  belongs_to :game
  belongs_to :gametag

  validates :game_id,
    presence: true,
    numericality: true
  validates :gametag_id,
    presence: true,
    numericality: true
end
