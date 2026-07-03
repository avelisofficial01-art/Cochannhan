1. TECH STACK
Frontend
React
TypeScript
PhaserJS
Vite
TailwindCSS
Zustand
TanStack Query
Backend
NodeJS

ExpressJS

TypeScript

Socket.IO

Drizzle ORM

PostgreSQL

Redis
Deploy
Docker

Nginx

PM2
2. ARCHITECTURE

Không dùng MVC.

Dùng

Modular Clean Architecture

Luồng xử lý:

Client

↓

Route

↓

Controller

↓

Service

↓

Repository

↓

Database

Không Controller gọi Database.

Không Route gọi Database.

3. PROJECT STRUCTURE
src/

 auth/

 player/

 combat/

 gu/

 equipment/

 npc/

 story/

 quest/

 world/

 shop/

 inventory/

 crafting/

 socket/

 middleware/

 database/

 utils/

 config/

 shared/

Mỗi module độc lập.

4. AUTH MODULE

Chức năng

Register

Login

Refresh Token

Logout

JWT

Password Hash

Không để gameplay trong Auth.

5. PLAYER MODULE

Quản lý

Player

Stats

Realm

Position

Profile

Save

Không xử lý Combat.

6. GU MODULE

Quản lý

Gu

Equip

Unequip

Enhancement

Evolution

Mastery

Bond

Craft

Gu không tự tính Damage.

Combat Engine sẽ làm.

7. EQUIPMENT MODULE

Quản lý

Equip

Unequip

Random Stat

Enhancement

Repair

Sell
8. INVENTORY MODULE

Chỉ làm

Add Item

Remove Item

Move Slot

Sort

Stack

Không xử lý Shop.

9. SHOP MODULE
Buy

Sell

Refresh

NPC Shop

Price

Không sửa Inventory trực tiếp.

Thông qua Inventory Service.

10. STORY MODULE

Quản lý

Chapter

Dialogue

Story Flag

Cutscene

Không xử lý Quest.

11. QUEST MODULE
Accept

Progress

Complete

Reward

Không tự mở Story.

Story quyết định.

12. NPC MODULE
Dialogue

Affinity

Schedule

AI

Shop

Quest
13. WORLD MODULE
Map

Portal

Dungeon

Weather

DayNight

World Event
14. CRAFT MODULE
Equipment

Potion

Gu

Immortal Gu

Tất cả đều dùng Transaction.

15. SOCKET MODULE

Socket chỉ dùng cho:

Player Move

Combat

World Event

Chat

Notification

Không dùng Socket cho Login.

16. GAME LOOP

Server Tick

20 Tick / second

Mỗi Tick

Update Player

↓

Update Monster

↓

Update Boss

↓

Projectile

↓

Status Effect

↓

Cooldown

↓

Sync Client

Combat không chờ Request API.

17. REST API

REST chỉ dùng cho dữ liệu.

Ví dụ

POST /login

GET /player

GET /inventory

POST /craft

GET /shop

GET /story

Combat

không dùng REST.

18. SOCKET EVENT

Ví dụ

player:move

player:attack

player:skill

monster:spawn

boss:spawn

item:drop

quest:update

story:update
19. COMBAT ENGINE

Combat Engine là module riêng.

Không nằm trong Player.

Không nằm trong Monster.

Không nằm trong Gu.

Combat Engine xử lý:

Damage

Critical

Status

Cooldown

Projectile

Death

Drop
20. EVENT BUS

Ví dụ

Boss chết

↓

Không gọi

Story.

Không gọi

Quest.

Boss chỉ phát Event.

BossDead

Story

nghe Event.

Quest

nghe Event.

Achievement

nghe Event.

Drop

nghe Event.

Đây là Event Driven Architecture.

21. CACHE

Redis cache

Config

NPC

Dialogue

Leaderboard

Story

Không cache

Inventory

Craft

Currency.

22. LOGGING

Có các log:

Login Log

Item Log

Currency Log

Craft Log

Combat Log

GM Log

Error Log
23. ERROR HANDLING

Tất cả Error trả theo format thống nhất:

{
  "success": false,
  "code": "ITEM_NOT_FOUND",
  "message": "Item does not exist."
}

Không trả chuỗi lỗi tự do.

24. ANTI-CHEAT

Server là nguồn dữ liệu duy nhất (Server Authority).

Client chỉ gửi yêu cầu:

Di chuyển.
Đánh.
Dùng kỹ năng.

Server sẽ kiểm tra:

Có đủ mana không?
Skill có hồi chiêu xong chưa?
Có ở đúng vị trí không?
Có đủ điều kiện sử dụng Cổ Trùng không?

Chỉ khi hợp lệ mới cập nhật trạng thái và gửi kết quả về client.

25. FILE STORAGE

Không lưu ảnh trong Database.

Cấu trúc:

/assets
/audio
/maps
/icons
/portraits
/effects

Database chỉ lưu đường dẫn.

26. ADMIN PANEL

Xây dựng một trang quản trị riêng để:

Quản lý người chơi.
Quản lý NPC.
Quản lý Quest.
Quản lý Story.
Quản lý Cổ Trùng.
Quản lý Drop Rate.
Quản lý Shop.
Theo dõi Log.

Mục tiêu là Designer có thể cập nhật nội dung mà không cần sửa code.

27. ROADMAP PHÁT TRIỂN

Không xây toàn bộ game cùng lúc.

Phase 1 (MVP)
Đăng nhập.
Di chuyển.
5 bản đồ.
NPC.
Quest.
Combat.
Gu.
Trang bị.
Save.
Phase 2
Crafting.
Enhancement.
Evolution.
Boss.
Story hoàn chỉnh.
Phase 3
Tiên Cổ.
World Event.
Reputation.
Faction.
Phase 4
Guild.
PvP.
Leaderboard.
Raid.