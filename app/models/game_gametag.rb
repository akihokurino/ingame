class GameGametag < ActiveRecord::Base
  belongs_to :game
  belongs_to :gametag
end
