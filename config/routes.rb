Ingame::Application.routes.draw do
  match '/*path' => 'application#cors_preflight_check', :via => :options
  resources :users, only: ["show", "edit", "update"] do
    collection do
      get "login"
      get "logout"
    end
    member do
      get "setting"
      get "search_game_or_user"
    end
  end
  resources :posts, only: ["index", "new"]
  resources :logs, only: ["index", "create"]
  resources :games, only: ["show"]

  namespace :api do
    resources :logs, only: ["index", "create", "update", "destroy"], format: "json" do
      member do
        put "update_status_or_rate"
      end
    end
    resources :statuses, only: ["index"], format: "json"
    resources :posts, only: ["index", "create", "destroy"], format: "json" do
      collection do
        get "index_of_game"
      end
    end
    resources :games, only: ["index", "show", "create"], format: "json" do
      collection do
        get "search"
      end
    end
    resources :post_likes, only: ["create", "destroy"], format: "json"
    resources :game_likes, only: ["create", "destroy"], format: "json"
    resources :users, only: ["update"], format: "json" do
      collection do
        get "search"
      end
    end
    resources :follows, only: ["create", "destroy"], format: "json"
    resources :post_comments, only: ["create", "destory"], format: "json"
    resources :notifications, only: ["index"], format: "json" do
      collection do
        get "count"
      end
    end
  end

  match "/auth/:provider/callback", to: "sessions#callback", via: :get
  match "/logout", to: "sessions#destroy", :as => :logout, via: :get


  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
