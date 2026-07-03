Tech Stack
PostgreSQL 17

Redis (Cache)

Drizzle ORM

NodeJS

ExpressJS

Socket.io
DATABASE ARCHITECTURE

Database chia thành 7 nhóm.

Account

Player

World

Story

Combat

Economy

System

Không để tất cả table trong một nhóm.

ACCOUNT MODULE
accounts
id

email

username

password_hash

status

created_at

updated_at
account_sessions
id

account_id

refresh_token

expired_at

created_at
PLAYER MODULE
players
id

account_id

name

realm (1~9)

dao_id

exp

hp

mana

gold

spirit_stone

current_map

current_x

current_y

created_at

Lưu ý:

Player không lưu Attack, Defense...

Các chỉ số này sẽ được tính động từ:

Trang bị
Cổ Trùng
Buff
Đạo
Chuyển

Điều này giúp tránh dữ liệu sai lệch.

PLAYER_STATS
player_id

hp_bonus

atk_bonus

def_bonus

crit_bonus

move_speed

...


Chỉ lưu bonus vĩnh viễn (ví dụ thưởng từ cốt truyện hoặc thành tựu), không lưu chỉ số cuối cùng.

DAO
dao_types
id

name

description

icon

element

Ví dụ

Fire Dao

Water Dao

Blood Dao

Poison Dao
GU MODULE

Đây là module lớn nhất game.

Không gom vào một table.

gu_templates

Định nghĩa Cổ.

id

name

rank

element

role

quality

description

sprite

is_immortal

unique_world

max_enhance

can_evolve
player_gu

Gu mà player sở hữu.

id

player_id

gu_template_id

level

enhancement

mastery

bond_level

is_equipped

created_at
gu_stats
gu_template_id

hp

atk

def

crit

crit_damage

move_speed

...
gu_skills
id

gu_template_id

skill_id

Một Gu

có thể nhiều Skill.

gu_synergy
gu_a

gu_b

result_skill

description

Ví dụ

Fire

+

Wind

↓

Fire Storm

Không hardcode trong code.

immortal_gu_registry

Đây là table quan trọng nhất.

gu_template_id

owner_player_id

crafted_at

Nếu đã tồn tại

=> không ai Craft được nữa.

EQUIPMENT MODULE
equipment_templates
id

name

type

quality

sprite

description
player_equipment
id

player_id

equipment_template_id

enhancement

is_equipped

random_seed

random_seed dùng để sinh chỉ số ngẫu nhiên nhưng vẫn tái tạo được khi cần.

equipment_stats
equipment_template_id

hp

atk

def

...
SKILL MODULE
skills
id

name

type

cooldown

mana_cost

animation

description
skill_effects
skill_id

effect_type

value

duration

chance

Ví dụ

Burn

10

5 sec

100%
COMBAT

Combat

không lưu Database.

Combat

xử lý RAM.

Chỉ lưu Log khi cần.

combat_logs
id

player_id

monster_id

damage

skill

time

Chỉ để phân tích.

Không phục vụ gameplay.

STORY MODULE
chapters
id
name
order_index
description
required_realm
unlock_condition

Ví dụ

Chapter 1

Người Phàm

↓

Chapter 2

Nam Cương
dialogues
id
chapter_id
npc_id
title
dialogue_lines
id
dialogue_id
speaker
content
emotion
next_line

Ví dụ

NPC

↓

Xin chào.

↓

Player

↓

Ta đến nhận nhiệm vụ.
dialogue_choices
id

dialogue_line_id

text

next_dialogue

story_flag

reward

Mọi lựa chọn đều nằm Database.

STORY FLAGS
story_flags
id

player_id

flag_key

flag_value

Ví dụ

saved_village

true

↓

join_fire_sect

false

↓

kill_boss_1

true
QUEST MODULE
quests
id

chapter_id

name

type

description

npc_id

reward_exp

reward_gold
quest_objectives
id

quest_id

type

target

count

Ví dụ

Kill

Monster 3

10 con
player_quests
player_id

quest_id

status

progress
NPC MODULE
npc_templates
id

name

sprite

profession

faction

map_id

x

y
npc_dialogues
npc_id

dialogue_id
npc_schedule
npc_id

hour

map

x

y

action

Ví dụ

08

Shop

↓

12

Eat

↓

22

Sleep
npc_relationship
player_id

npc_id

affinity
MAP MODULE
maps
id

name

background

music

level_min

level_max
portals
id

from_map

to_map

x

y

condition
hidden_area
id

map_id

condition

reward
MONSTER MODULE
monster_templates
id

name

sprite

realm

hp

atk

def

speed

ai_type

drop_table
boss_templates
id

name

realm

hp

atk

phase

drop_table

story_flag

Boss không lưu logic.

Boss chỉ lưu dữ liệu.

Logic dùng BossAI.

DROP SYSTEM
drop_tables
id

monster_id

item_id

rate

min

max

Ví dụ

Fire Gu

5%

↓

Spirit Stone

30%
INVENTORY
inventories
player_id

slot

item_id

quantity

Item stack

Database xử lý.

Không tạo

100 dòng

giống nhau.

ITEMS
item_templates
id

name

type

quality

icon

description

Type

Material

Potion

Quest

Craft

Currency

Misc
SHOP
shops
id

npc_id

name
shop_items
shop_id

item_id

price

stock

refresh_time
CRAFT
recipes
id

name

result_item

success_rate
recipe_materials
recipe_id

item_id

quantity
craft_logs
player

recipe

success

time
ACHIEVEMENT
achievements
id

name

description

reward
player_achievement
player

achievement

completed
MAIL
mails
id

player

title

content

reward

expired_at
CONFIG

Game có

config table.

game_configs
key

value

Ví dụ

MAX_REALM

9

↓

MAX_GU_SLOT

9

↓

MAX_ENHANCE

20

Không hardcode.

LOG TABLE

Game online

phải có Log.

item_logs
player

item

before

after

reason

time
currency_logs
player

gold

before

after

reason
gu_logs
player

gu

enhance

evolve

craft

time
ADMIN
gm_accounts
id

username

role
gm_logs
gm

action

target

time
DATABASE RULES

✅ Không lưu dữ liệu trùng.

✅ Không hardcode.

✅ Mọi gameplay đều chỉnh được từ Database.

✅ Tách Template và Player Data.

✅ Mọi giao dịch quan trọng dùng Transaction.

INDEX STRATEGY

Không phải table nào cũng index.

Chỉ index dữ liệu thường xuyên tìm kiếm.

Player
player_id

✅ Index

account_id

✅ Unique Index

player_name

✅ Unique Index

Gu
player_id

✅ Index

gu_template_id

✅ Index

(player_id,is_equipped)

✅ Composite Index

Quest
player_id

✅ Index

status

✅ Index

Story Flag
(player_id,flag_key)

✅ Unique Index

FOREIGN KEY RULES

Ví dụ

Player

↓

Inventory

↓

Item

Không cho phép

Inventory

trỏ tới

Item

không tồn tại.

Ví dụ

Player

↓

Gu

Nếu Player bị xóa

↓

Gu

cũng bị xóa.

(Cascade Delete)

TRANSACTION RULES

Đây là phần quan trọng nhất.

Có những thao tác

bắt buộc

Transaction.

Ví dụ

Craft Tiên Cổ
Kiểm tra Unique

↓

Trừ nguyên liệu

↓

Tạo Tiên Cổ

↓

Ghi Log

↓

Commit

Nếu lỗi

↓

Rollback toàn bộ.

Cường hóa
Kiểm tra tiền

↓

Trừ tiền

↓

Random

↓

Update Item

↓

Log

Không được cập nhật từng bước riêng lẻ.

Mua Shop
Kiểm tra tiền

↓

Kiểm tra kho

↓

Trừ tiền

↓

Thêm Item

↓

Commit
REDIS CACHE

Redis

không lưu

toàn bộ Database.

Chỉ cache

dữ liệu đọc nhiều.

Ví dụ

Player Profile
Leaderboard
NPC Dialogue
Game Config

Không cache

Inventory.

Không cache

Craft.

Không cache

Currency.

Đây là dữ liệu cần chính xác tuyệt đối.

DATABASE NAMING

Table

luôn

snake_case

Ví dụ

player_inventory

Không dùng

PlayerInventory

Column

created_at

updated_at

deleted_at

Thống nhất.

ID

id

Không dùng

playerID

playerId
DELETE STRATEGY

Không xóa thật.

Dùng

deleted_at

Soft Delete.

Ngoại lệ

logs

Không Soft Delete.

AUDIT LOG

Game online

phải truy được

mọi thay đổi.

Ví dụ

Player

↓

+1000 Gold

↓

Ai thêm?

↓

GM?

↓

Quest?

↓

Bug?

↓

Hack?

↓

Có Log.

GAME CONFIG

Toàn bộ gameplay

đọc từ Config.

Ví dụ

MAX_REALM=9

MAX_GU_SLOT=9

MAX_ENHANCE=20

PLAYER_SPEED=180

DROP_RATE=1.0

Không hardcode.

DATA IMPORT

Game phải hỗ trợ

Import.

Ví dụ

Designer

làm Excel.

↓

Import.

↓

Database.

Không cần sửa code.

DATA EXPORT

Cho phép

Export

thành

CSV

JSON

để cân bằng game.

MIGRATION

Database

không sửa tay.

Chỉ dùng

Migration.

Ví dụ

Migration 001

Create Player

↓

Migration 002

Create Gu

↓

Migration 003

Create Quest
VERSION

Database

phải có Version.

Ví dụ

v1.0

↓

v1.1

↓

v1.2

Backend

kiểm tra Version.

BACKUP

Hằng ngày

Backup.

Giữ

7 ngày

30 ngày

90 ngày
PERFORMANCE TARGET

Database

mục tiêu

Đăng nhập

<100ms
Load Player

<50ms
Inventory

<30ms
Craft

<150ms
Combat

Không đọc Database

Combat chỉ chạy trên RAM, cuối trận mới ghi dữ liệu cần thiết.

DATABASE DESIGN PRINCIPLE

Đây là luật cao nhất.

Database chỉ lưu dữ liệu. Không lưu logic.

Ví dụ:

❌ Sai

Fire Gu

Skill:

if HP <30%

heal()

Đây là logic.

✅ Đúng

Skill ID = 25

Backend đọc

Skill 25

↓

Combat Engine

xử lý.