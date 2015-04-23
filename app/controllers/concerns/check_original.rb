module CheckOriginal
  extend ActiveSupport::Concern

  def original?
    !params[:is_original].blank? && params[:is_original] == "true"
  end
end