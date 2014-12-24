class Admin::GameUrlsController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin

  def destroy
    game_url = GameUrl.find params[:id]
    game_url.destroy
    redirect_to edit_admin_game_path(game_url.game), notice: "公式URLを削除しました。"
  end
end
