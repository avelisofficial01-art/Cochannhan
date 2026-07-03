1. API DESIGN PRINCIPLES
REST dùng cho dữ liệu và thao tác không yêu cầu thời gian thực.
Socket.IO dùng cho gameplay thời gian thực.
Mọi API trả về cùng một định dạng.
Không trả về HTML.
2. RESPONSE FORMAT

Thành công:

{
  "success": true,
  "data": {}
}

Lỗi:

{
  "success": false,
  "code": "PLAYER_NOT_FOUND",
  "message": "Player does not exist."
}
3. AUTH API
POST /api/auth/register

Tạo tài khoản.

Request

{
  "email": "",
  "username": "",
  "password": ""
}

Response

{
  "success": true
}
POST /api/auth/login

Response

{
  "token": "",
  "refreshToken": "",
  "player": {}
}
POST /api/auth/refresh

Trả về Access Token mới.

POST /api/auth/logout

Đăng xuất.

4. PLAYER API
GET /api/player/profile

Thông tin nhân vật.

GET /api/player/stats

Chỉ số cuối cùng sau khi tính:

Realm
Gu
Trang bị
Buff
POST /api/player/breakthrough

Đột phá Chuyển.

Backend kiểm tra:

Tu Vi
Điều kiện
Boss
Story
Thiên Kiếp
5. INVENTORY API
GET /api/inventory

Lấy toàn bộ túi đồ.

POST /api/inventory/sort

Sắp xếp.

POST /api/inventory/use

Sử dụng vật phẩm.

6. EQUIPMENT API
GET /api/equipment

Danh sách trang bị.

POST /api/equipment/equip

Trang bị.

POST /api/equipment/unequip

Gỡ trang bị.

POST /api/equipment/enhance

Cường hóa.

7. GU API
GET /api/gu

Danh sách Cổ Trùng.

POST /api/gu/equip

Trang bị Cổ Trùng.

POST /api/gu/unequip

Gỡ Cổ Trùng.

POST /api/gu/enhance

Cường hóa.

POST /api/gu/evolve

Tiến hóa.

POST /api/gu/craft

Luyện Cổ.

POST /api/gu/craft-immortal

Luyện Tiên Cổ.

Backend sẽ:

Kiểm tra Unique.
Transaction.
Ghi log.
8. QUEST API
GET /api/quest

Quest hiện tại.

POST /api/quest/accept

Nhận nhiệm vụ.

POST /api/quest/complete

Hoàn thành.

9. STORY API
GET /api/story/chapter

Chapter hiện tại.

GET /api/story/dialogue

Lấy hội thoại.

POST /api/story/choice

Chọn đáp án.

10. SHOP API
GET /api/shop/:npcId

Danh sách vật phẩm.

POST /api/shop/buy

Mua.

POST /api/shop/sell

Bán.

11. CRAFT API
GET /api/craft/recipes

Danh sách công thức.

POST /api/craft

Luyện chế.

12. WORLD API
GET /api/world/maps

Danh sách bản đồ đã mở.

POST /api/world/teleport

Dịch chuyển.

GET /api/world/events

World Event đang diễn ra.

13. SOCKET EVENTS
Client → Server
player:move
player:attack
player:skill
player:interact
player:pickup
player:portal
Server → Client
player:update
monster:spawn
monster:update
monster:dead
boss:spawn
boss:update
boss:dead
item:drop
quest:update
story:update
world:event
notification
14. ERROR CODES

Một số mã lỗi chuẩn:

INVALID_TOKEN
PLAYER_NOT_FOUND
ITEM_NOT_FOUND
GU_SLOT_FULL
REALM_TOO_LOW
NOT_ENOUGH_MATERIAL
IMMORTAL_GU_EXISTS
INVENTORY_FULL
QUEST_LOCKED
STORY_LOCKED
15. SECURITY
JWT cho xác thực.
Refresh Token có thời hạn.
Rate Limit cho API đăng nhập.
Mọi API gameplay yêu cầu Access Token hợp lệ.
Không tin dữ liệu gửi từ client; server luôn xác thực lại.