# Be sure to restart your server when you modify this file.

#Ingame::Application.config.session_store :cookie_store, key: '_ingame_session'
#Ingame::Application.config.session_store :active_record_store

Ingame::Application.config.session_store :redis_store, expire_after: 7.days, servers: { 
  host: "localhost", 
  port: 6379, 
  namespace: "playdy-development"
}
