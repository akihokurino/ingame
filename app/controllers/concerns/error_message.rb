module ErrorMessage
  extend ActiveSupport::Concern

  def set_error_message(e)
    case e.message
    when "wrong extname or too big"
      {type: "photo", message: "画像の拡張子が正しくないか、画像のサイズが大き過ぎます。"}
    else
      {type: "something", message: "不正なデータです。"}
    end
  end
end