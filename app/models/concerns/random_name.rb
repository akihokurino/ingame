module RandomName
  extend ActiveSupport::Concern

  module ClassMethods
    def generate(type = "alphabet", size = 8)
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