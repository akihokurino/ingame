class GameUrl < ActiveRecord::Base
  belongs_to :game

  validates :game_id,
    presence: true,
    numericality: true
  validates :text,
    presence: true
end
