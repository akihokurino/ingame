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

ActiveRecord::Schema.define(version: 20140611125940) do

  create_table "follows", force: true do |t|
    t.integer  "from_user_id", limit: 8
    t.integer  "to_user_id",   limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "game_likes", force: true do |t|
    t.integer  "game_id",    limit: 8
    t.integer  "user_id",    limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", force: true do |t|
    t.string   "title"
    t.string   "photo_path"
    t.string   "device"
    t.integer  "price"
    t.string   "maker"
    t.datetime "release_day"
    t.integer  "game_likes_count", default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "logs", force: true do |t|
    t.integer  "game_id",    limit: 8
    t.integer  "status_id"
    t.integer  "user_id",    limit: 8
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "post_likes", force: true do |t|
    t.integer  "post_id",    limit: 8
    t.integer  "user_id",    limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "post_photos", force: true do |t|
    t.integer  "post_id",    limit: 8
    t.string   "photo_path"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", force: true do |t|
    t.integer  "user_id",          limit: 8
    t.integer  "game_id",          limit: 8
    t.text     "text"
    t.integer  "post_likes_count",           default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "sessions", force: true do |t|
    t.string   "session_id", null: false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], name: "index_sessions_on_session_id", unique: true, using: :btree
  add_index "sessions", ["updated_at"], name: "index_sessions_on_updated_at", using: :btree

  create_table "statuses", force: true do |t|
    t.string   "name",       limit: 50
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.string   "username",     limit: 100
    t.string   "introduction"
    t.integer  "logs_count",   limit: 8,   default: 0
    t.integer  "posts_count",  limit: 8,   default: 0
    t.string   "photo_path"
    t.string   "place"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "provider"
    t.string   "uid"
  end

end
