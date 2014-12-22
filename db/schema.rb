# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141206051700) do

  create_table "admins", force: true do |t|
    t.string   "username"
    t.string   "password"
    t.integer  "salt"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "comment_likes", force: true do |t|
    t.integer  "post_comment_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "follows", force: true do |t|
    t.integer  "from_user_id"
    t.integer  "to_user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "game_gametags", force: true do |t|
    t.integer  "game_id"
    t.integer  "gametag_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "game_gametags", ["game_id"], name: "index_game_gametags_on_game_id", using: :btree
  add_index "game_gametags", ["gametag_id"], name: "index_game_gametags_on_gametag_id", using: :btree

  create_table "game_likes", force: true do |t|
    t.integer  "game_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", force: true do |t|
    t.string   "title"
    t.string   "photo_url"
    t.string   "photo_path"
    t.string   "maker"
    t.text     "wiki"
    t.string   "price"
    t.date     "release_day"
    t.string   "device"
    t.string   "provider"
    t.integer  "provider_id"
    t.string   "provider_url"
    t.string   "amazon_url"
    t.string   "game_url"
    t.text     "game_html",        limit: 2147483647
    t.integer  "game_likes_count",                    default: 0
    t.integer  "posts_count",                         default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "gametags", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "logs", force: true do |t|
    t.text     "text"
    t.integer  "rate"
    t.integer  "game_id"
    t.integer  "status_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "notification_types", force: true do |t|
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "notifications", force: true do |t|
    t.integer  "from_user_id"
    t.integer  "to_user_id"
    t.integer  "notification_type_id"
    t.boolean  "is_read",              default: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "post_comments", force: true do |t|
    t.integer  "user_id"
    t.integer  "post_id"
    t.integer  "comment_likes_count", default: 0
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "post_comments", ["post_id"], name: "index_post_comments_on_post_id", using: :btree
  add_index "post_comments", ["user_id"], name: "index_post_comments_on_user_id", using: :btree

  create_table "post_likes", force: true do |t|
    t.integer  "post_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "post_photos", force: true do |t|
    t.string   "photo_path"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "post_urls", force: true do |t|
    t.integer  "post_id"
    t.string   "title"
    t.text     "description"
    t.string   "thumbnail"
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", force: true do |t|
    t.text     "text"
    t.integer  "user_id"
    t.integer  "log_id"
    t.integer  "game_id"
    t.integer  "post_likes_count",    default: 0
    t.integer  "post_comments_count", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "statuses", force: true do |t|
    t.string   "name",       limit: 50
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "user_providers", force: true do |t|
    t.integer  "user_id"
    t.string   "uid"
    t.string   "username"
    t.string   "service_name"
    t.text     "token"
    t.text     "secret_token"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_providers", ["user_id"], name: "index_user_providers_on_user_id", using: :btree

  create_table "users", force: true do |t|
    t.string   "username",     limit: 100
    t.string   "password"
    t.integer  "salt"
    t.string   "introduction"
    t.string   "email"
    t.integer  "logs_count",               default: 0
    t.integer  "posts_count",              default: 0
    t.string   "photo_path",               default: "default.png"
    t.string   "place"
    t.boolean  "is_first",                 default: true
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
