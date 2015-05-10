Ingame::Application.routes.draw do
  root to: "posts#index"

  match "/*path" => "application#cors_preflight_check", :via => :options
  match "/auth/:provider/callback", to: "user_providers#create", via: :get
  match "/logout", to: "sessions#destroy", :as => :logout, via: :get
  match "/search", to: "search#index", via: :get

  resources :pages, only: [] do
    collection do
      get "term"
      get "privacy"
    end
  end

  resources :users, only: ["show", "edit", "update", "new", "destroy"] do
    collection do
      get "login"
      get "logout"
    end
    member do
      get "setting"
    end
  end
  resources :user_providers, only: ["index"]

  resources :posts, only: ["index", "new", "show"]

  resources :logs, only: ["index", "create"]

  resources :games, only: ["show"] do
    collection do
      get "devices"
    end
    resources :reviews, only: ["show", "new", "create"]
  end

  resources :gametags, only: ["index"]



  namespace :api do
    resources :reviews, only: ["index", "create", "update", "destroy"], format: "json"
    resources :review_comments, only: ["index", "create", "destroy"], format: "json"
    resources :review_likes, only: ["create", "destroy"], format: "json"
    resources :review_comment_likes, only: ["create", "destroy"], format: "json"

    resources :logs, only: ["index", "create", "update", "destroy"], format: "json" do
      member do
        put "update_status_or_rate"
      end
    end

    resources :statuses, only: ["index"], format: "json"

    resources :posts, only: ["index", "create", "destroy"], format: "json"
    resources :post_likes, only: ["create", "destroy"], format: "json"
    resources :post_comments, only: ["index", "create", "destroy"], format: "json"
    resources :post_comment_likes, only: ["create", "destroy"], format: "json"
    resources :post_urls, only: ["new"], format: "json"

    resources :games, only: ["index", "show"], format: "json" do
      collection do
        get "search"
        get "devices"
      end
    end
    resources :game_likes, only: ["create", "destroy"], format: "json"

    resources :users, only: ["index", "update", "create"], format: "json" do
      collection do
        get "search"
        post "tmp_upload"
        get "uniqueness"
      end
    end
    resources :user_providers, only: ["update"], format: "json"
    resources :user_log_orders, only: ["show", "create", "update"], format: "json"

    resources :follows, only: ["create", "destroy"], format: "json"

    resources :notifications, only: ["index"], format: "json" do
      collection do
        get "count"
      end
    end

    resources :sessions, only: ["create"], format: "json"

    resources :gametags, only: ["index"], format: "json"
  end

  namespace :admin do
    resources :dashboards, only: ["index"]

    resources :sessions, only: ["new", "create", "destroy"]

    resources :games
    resources :game_urls, only: ["destroy"]
    resources :game_gametags, only: ["destroy"]

    resources :users, only: ["index", "show"]

    namespace :api do
      resources :admins, only: ["create"], format: "json"
    end
  end
end
