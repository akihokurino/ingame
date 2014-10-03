module EscapeLike
  extend ActiveSupport::Concern

  module ClassMethods
    def escape(string)
      string.gsub(/[\\%_]/){|m| "\\#{m}"}
    end
  end
end