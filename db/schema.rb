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

ActiveRecord::Schema.define(version: 20140610121927) do

  create_table "follows", id: false, force: true do |t|
    t.integer  "id",           limit: 8
    t.integer  "from_user_id", limit: 8
    t.integer  "to_user_id",   limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "game_likes", id: false, force: true do |t|
    t.integer  "id",         limit: 8
    t.integer  "game_id",    limit: 8
    t.integer  "user_id",    limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "games", id: false, force: true do |t|
    t.integer  "id",               limit: 8
    t.string   "title"
    t.string   "photo_path"
    t.string   "device"
    t.integer  "price"
    t.string   "maker"
    t.datetime "release_day"
    t.integer  "game_likes_count",           default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "logs", id: false, force: true do |t|
    t.integer  "id",         limit: 8
    t.integer  "game_id",    limit: 8
    t.integer  "status_id"
    t.integer  "user_id",    limit: 8
    t.text     "text"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "post_likes", id: false, force: true do |t|
    t.integer  "id",         limit: 8
    t.integer  "post_id",    limit: 8
    t.integer  "user_id",    limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "post_photos", id: false, force: true do |t|
    t.integer  "id",         limit: 8
    t.integer  "post_id",    limit: 8
    t.string   "photo_path"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "posts", id: false, force: true do |t|
    t.integer  "id",               limit: 8
    t.integer  "user_id",          limit: 8
    t.integer  "game_id",          limit: 8
    t.text     "text"
    t.integer  "post_likes_count",           default: 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "statuses", id: false, force: true do |t|
    t.integer  "id",         limit: 8
    t.string   "name",       limit: 50
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", id: false, force: true do |t|
    t.integer  "id",           limit: 8
    t.string   "username",     limit: 100
    t.string   "introduction"
    t.integer  "logs_count",   limit: 8,   default: 0
    t.integer  "posts_count",  limit: 8,   default: 0
    t.string   "photo_path"
    t.string   "place"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
