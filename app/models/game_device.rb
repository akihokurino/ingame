class GameDevice < ActiveRecord::Base
  belongs_to :game
  belongs_to :device
end
