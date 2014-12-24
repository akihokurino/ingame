class Admin::GameGametagsController < ApplicationController
  layout "application_admin"

  skip_before_action :auth
  before_action :auth_admin

  def destroy
    gametag = GameGametag.find_by gametag_id: params[:id], game_id: params[:game_id]
    gametag.destroy
    redirect_to edit_admin_game_path(params[:game_id]), notice: "タグを削除しました。"
  end
end
