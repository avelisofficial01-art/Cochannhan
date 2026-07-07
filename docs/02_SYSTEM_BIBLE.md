MỤC LỤC
1. Gameplay Philosophy

2. Player System

3. Cultivation System

4. Dao System

5. Gu System

6. Equipment System

7. Enhancement System

8. Combat System

9. Skill System

10. Monster AI

11. Boss AI

12. NPC System

13. Story System

14. Quest System

15. Economy System

16. Craft System

17. World System

18. Save System

19. Balance System
1. GAMEPLAY PHILOSOPHY

Đây là tài liệu định nghĩa toàn bộ gameplay.

Mọi code.

Mọi Database.

Mọi UI.

Đều phải tuân theo tài liệu này.

Nếu code khác tài liệu.

Code sai.

Không sửa tài liệu theo code.

Phải sửa code.

2. CORE GAMEPLAY LOOP

Đây là gameplay loop duy nhất.

Story

↓

Dialogue

↓

Quest

↓

Explore

↓

Combat

↓

Loot

↓

Craft

↓

Cultivation

↓

Unlock Story

↓

Story

Lặp lại.

Không được tạo gameplay loop khác.

3. PLAYER SYSTEM

Player KHÔNG phải nguồn sức mạnh.

Player chỉ là

"vật chứa".

Sức mạnh đến từ

Cultivation

+

Dao

+

Gu

+

Equipment

+

Knowledge

+

Player Skill

Điều này giúp game không bị pay-to-win.

PLAYER DATA

Một Player gồm

ID

Account

Name

Avatar

Realm

Dao

HP

Mana

Stats

Inventory

Equipment

Gu

Story

Quest

Achievement

Save Data

Không lưu dữ liệu gameplay ở nhiều nơi.

Player chỉ lưu trạng thái.

4. CULTIVATION SYSTEM

Đây là hệ thống tiến trình chính.

Không có Level 999.

Không có EXP vô hạn.

Chỉ có

1 Chuyển

↓

2

↓

3

↓

4

↓

5

↓

6

↓

7

↓

8

↓

9
Đột phá

Muốn lên Chuyển.

Phải đạt đủ

Tu Vi

+

Điều kiện cốt truyện

+

Boss

+

Nguyên liệu

+

Thiên Kiếp

Không thể farm đủ điểm là lên.

Ví dụ:

Để lên 3 Chuyển, người chơi phải hoàn thành chương truyện tương ứng, đánh bại Boss canh giữ và vượt qua Thiên Kiếp. Điều này giúp việc đột phá trở thành một cột mốc đáng nhớ thay vì chỉ là một lần tăng cấp.

5. KHÔNG KHIẾU

Không Khiếu là tài nguyên quý giá nhất của người chơi.

Mỗi Chuyển tăng thêm 1 ô chứa Cổ Trùng.

Chuyển	Slot
1	1
2	2
3	3
4	4
5	5
6	6
7	7
8	8
9	9

Mỗi ô đều có giá trị chiến thuật.

Người chơi không thể mang tất cả Cổ Trùng, vì vậy phải xây dựng Build phù hợp.

6. THẬP TUYỆT THỂ SYSTEM (Body Constitution)

Thập Tuyệt Thể thay thế khái niệm Tộc (Race) cũ.

Đây là lựa chọn duy nhất khi tạo nhân vật. Không thể thay đổi.

Mỗi Thể không chỉ là bộ chỉ số mà là CƠ CHẾ GAMEPLAY KHÁC NHAU HOÀN TOÀN.

---

DANH SÁCH 10 THỂ

| ID | Tên | Cơ chế chính | Stat đặc biệt | Passive |
|----|-----|-------------|--------------|---------|
| 1 | Xuân Thu Nguyệt Lão Thể | Hồi phục liên tục, x3 khi HP<30% | +HP Regen, +Max HP | Trường Xuân Bất Tử: bất tử 2s khi HP=1 (cd 120s) |
| 2 | Tiên Mộng Cốc Thể | Cứ 5 đòn tự Stun địch | +Mana, +CDR | Mộng Huyễn: 15% né hoàn toàn khi bị đánh |
| 3 | Vu Gia Thể | Stack Curse → xuyên giáp khi ≥3 Curse | +Element DMG (Độc/Huyết), +Status Duration | Lão Vu Thứ Khẩu: xuyên giáp 100% khi địch có ≥3 Curse |
| 4 | Vạn Biến Thể | Đổi hình thái 30s (Hỏa/Thủy/Phong) | +All Stats nhỏ, +1 element ngẫu nhiên | Vô Cực Biến: khi đổi hình thái hồi 20% HP + xóa 1 debuff |
| 5 | Thiên Khuyết Thể | ATK x2 khi HP<50%, Bạo Tẩu khi HP<20% | +ATK, +Crit Rate, +Crit DMG | Khuyết Đạo: HP<20% → ATK Speed x2, Dodge +30% |
| 6 | Đồng Thai Thể | Dùng Active Skill → triệu Phân Thân 5s | +Summon Power, +ATK Speed | Song Đồng: Phân Thân clone 50% Gu Skill |
| 7 | Nhân Quả Thể | Tích 10 Nhân → bùng nổ Quả tổng sát thương | +Skill Multiplier, +Accuracy | Nhân Quả Luân Hồi: chết khi có ≥5 Nhân → hồi sinh 30% HP (1 lần/map) |
| 8 | Cốc Thần Thể | Drop +50%, "Phú Quý" khi nhặt ≥100 vàng → +20% all stats | +Drop Rate, +Gold, +Craft Speed | Thần Khố: +2 slot Gu lưu trữ (không chiến đấu) |
| 9 | Huyết Chiến Thể | Nhận sát thương → tích Huyết Hận (max 10 lớp, tăng ATK+Crit) | +Life Steal, +Counter DMG | Huyết Chiến Vô Hoàn: duy trì combat >3s → hồi 1% HP/s |
| 10 | Không Thể (Vô Thể) | Không có stat cố định. Học thêm Passive từ Thể khác qua Quest ẩn | +1% All Stats | Vô Cực: mỗi Quest Legendary → nhận ngẫu nhiên 1 skill Thể khác (tối đa 3) |

---

THIẾT KẾ DATABASE

Bảng: body_constitutions
- id (int 1-10)
- name (string)
- description (string)
- passive_id (ref → passive_skills)
- base_stat_modifiers (JSON)
- mechanic_config (JSON) — thông số cơ chế (vd: "stack_count": 10, "hp_threshold": 0.3)

Cột trong bảng players:
- constitution_id (FK → body_constitutions)

---

QUY TẮC THIẾT KẾ

Thể không quyết định sức mạnh tuyệt đối.
Thể tạo ra cách chơi khác nhau.
Một số Gu đạt tối đa sức mạnh khi người dùng có Thể tương thích (Constitution Synergy).
Không Thể (Thể 10) là Thể khó nhất nhưng linh hoạt nhất.

---

6b. DAO SYSTEM

Dao (Đạo) không phải Class.

Player không bị khóa.

Có thể đổi Dao. Nhưng chi phí rất lớn.

Ví dụ: Fire Dao → Lightning Dao cần Quest + NPC + Rare Item.

Không cho phép đổi tự do để giữ ý nghĩa của lựa chọn ban đầu.

Tác dụng của Dao:

Cộng hưởng với một số Cổ Trùng.
Mở kỹ năng riêng.
Mở nhánh cốt truyện.
Tương tác với NPC và phe phái.
Một số điều kiện luyện chế.

Dao không thay thế Cổ Trùng, mà hoạt động song song để tạo nhiều hướng xây dựng nhân vật.

7. GU SYSTEM

Đây là trái tim của game.

Mọi hệ thống khác

đều xoay quanh

Gu.

Một Gu gồm
ID

Name

Rank

Role

Type

Element

Stats

Skill

Passive

Cooldown

Evolution

Enhancement

Craft

Drop

Lore
Vai trò
Damage

Tank

Support

Control

Summon

Utility

Economic

Một Gu

có thể

2 Role.

Ví dụ

Support

+

Damage
Chỉ số cơ bản

Gu sẽ cộng trực tiếp vào nhân vật:

HP

Mana

Attack

Defense

Move Speed

Attack Speed

Critical

Critical Damage

Accuracy

Dodge

Element Damage

Life Steal

Shield

Cooldown Reduction

Gu Chuyển càng cao thì chỉ số nền càng lớn, nhưng yêu cầu người chơi cũng phải đạt Chuyển tương ứng mới sử dụng được.

Kỹ năng của Gu

Mỗi Gu có thể sở hữu:

Active Skill: Người chơi chủ động kích hoạt.
Passive Skill: Luôn có hiệu lực.
Aura: Ảnh hưởng bản thân hoặc đồng minh.
Trigger Skill: Tự động kích hoạt khi thỏa điều kiện (ví dụ khi HP dưới 30%).

Nhờ vậy, cùng một Cổ Trùng có thể mang nhiều giá trị chiến thuật chứ không chỉ tăng chỉ số.

8. COMBAT SYSTEM
Thiết kế

Combat theo thời gian thực (Real-time).

Không khóa mục tiêu.

Người chơi phải tự di chuyển, né đòn và sử dụng kỹ năng.

Gameplay giống:

Diablo
Path of Exile
Hades
Combat Loop
Phát hiện mục tiêu
↓

Di chuyển
↓

Đánh thường / Dùng Gu Skill
↓

Tính sát thương

↓

Buff / Debuff

↓

Kiểm tra tử vong

↓

Drop

↓

Nhận thưởng
Damage Formula
Final Damage =
(Base Attack
+ Equipment
+ Gu Stats)
× Skill Multiplier
× Critical
× Element Bonus
× Synergy Bonus
- Defense

Sau này tất cả công thức sẽ nằm trong CombatCalculator, không tính rải rác.

Damage Type

Có 3 nhóm:

Physical
Kiếm
Đấm
Cung
Element
Hỏa
Thủy
Lôi
Phong
Mộc
Thổ
Dao
Độc
Huyết
Linh Hồn
Không Gian
Thời Gian
Status Effect

Game hỗ trợ:

Burn
Freeze
Poison
Bleeding
Stun
Slow
Silence
Blind
Fear
Curse

Tất cả Status đều dùng chung một StatusSystem, không viết riêng cho từng kỹ năng.

9. EQUIPMENT SYSTEM
Loại trang bị

Hiện tại chỉ có:

Weapon
Armor
Accessory

Sau này mở rộng:

Ring
Necklace
Artifact
Relic
Quality
Hạ Phẩm
Phổ Thông
Thượng Tốt
Tuyệt Luân

Sau này mở:

Linh Khí
Địa Khí
Thiên Khí
Tiên Khí
Thần Khí
Random Stat

Mỗi trang bị khi rơi sẽ có chỉ số ngẫu nhiên trong một khoảng.

Ví dụ:

Kiếm

ATK

20~30

Không phải thanh kiếm nào cũng giống nhau.

10. ENHANCEMENT SYSTEM

Có hai hệ thống độc lập:

Equipment Enhancement
Gu Enhancement

Không dùng chung.

Equipment Enhancement

Giới hạn:

+0

↓

+20

Mỗi cấp tăng:

ATK
DEF
HP

Mốc đặc biệt:

Mốc	Hiệu ứng
+5	Thêm chỉ số phụ
+10	Mở Socket
+15	Thêm Passive
+20	Đổi hiệu ứng phát sáng
Gu Enhancement

Gu không chỉ tăng chỉ số.

Gu sẽ mở khóa sức mạnh mới.

Mốc	Hiệu ứng
+3	Tăng Passive
+5	Passive mới
+10	Active mạnh hơn
+15	Mở thuộc tính ẩn
+20	Có thể Tiến Hóa
11. EVOLUTION SYSTEM

Đây KHÔNG phải cường hóa.

Ví dụ:

Hỏa Cổ

↓

Viêm Cổ

↓

Thiên Hỏa Cổ

↓

Tiên Hỏa Cổ

Tiến hóa sẽ thay đổi:

Sprite
Chỉ số
Kỹ năng
Lore
Giá trị

Một Gu sau tiến hóa vẫn giữ lịch sử cường hóa.

12. SYNERGY SYSTEM

Đây là điểm khác biệt lớn của game.

Một Gu không mạnh vì đứng một mình.

Mạnh vì kết hợp.

Ví dụ:

Hỏa Cổ

+

Phong Cổ

=

Hỏa Phong Bạo

Hoặc

Độc Cổ

+

Huyết Cổ

=

Độc Huyết

Synergy được định nghĩa trong Database.

Không hardcode.

13. BUILD SYSTEM

Người chơi không có Class.

Class được tạo bởi Build.

Ví dụ:

Tank
Stone Gu
Shield Gu
Life Gu
Assassin
Shadow Gu
Wind Gu
Poison Gu
Mage
Fire Gu
Thunder Gu
Ice Gu
Merchant
Lucky Gu
Treasure Gu
Trade Gu
Summoner
Wolf Gu
Beast Gu
Spirit Gu

=> Một người chơi 9 Chuyển có thể tạo hàng trăm Build khác nhau.

14. DESIGN RULES

Đây là luật bất biến của game.

✅ Không có Gu vô dụng.

✅ Không có trang bị vô dụng.

✅ Không có Build mạnh tuyệt đối.

✅ Không có Boss bất khả chiến bại.

✅ Mọi hệ thống đều phải có cách mở rộng.

15. NPC SYSTEM
Thiết kế

NPC không phải vật trang trí.

NPC là trung tâm của Story.

Mỗi NPC đều có:

ID
Tên
Sprite
Phe phái
Nghề nghiệp
Quan hệ
Độ hảo cảm
Lịch trình
Hội thoại
Quest
Shop
Hảo cảm

Giá trị

-100 → 100

Mỗi mốc sẽ mở:

Hội thoại mới
Quest mới
Giảm giá Shop
Tiết lộ bí mật
Kết thúc khác
Lịch trình

Ví dụ

06:00

Thức dậy

↓

08:00

Mở Shop

↓

12:00

Nghỉ

↓

18:00

Đóng Shop

↓

22:00

Đi ngủ

NPC không đứng yên cả ngày.

16. STORY SYSTEM

Story chia thành

Chapter

↓

Act

↓

Quest

↓

Dialogue

↓

Cutscene
Chapter

Ví dụ

Chapter 1

Người Phàm

↓

Boss

↓

Chapter 2

↓

Nam Cương

↓

Chapter 3


---

Story phải điều khiển:

- mở map
- mở NPC
- mở Boss
- mở Gu
- mở tính năng

Không được để người chơi farm rồi tự mở.

---

## Story Flag

Ví dụ

```text
SavedVillage

True

↓

NPC khác sẽ biết.

Story luôn đọc Story Flag.

17. QUEST SYSTEM

Có

Main

Side

Hidden

Daily

Legendary

Faction

Quest gồm

Điều kiện

↓

Mục tiêu

↓

Tiến trình

↓

Thưởng

↓

Story Flag

Không viết logic Quest trong code.

Toàn bộ điều kiện nằm Database.

18. ECONOMY SYSTEM

Tiền tệ chính

Linh Thạch

Tiền phụ

Vàng

Tài nguyên

Khoáng

Linh Thảo

Tinh Hoa

Boss Material

Gu Material

Không để Inflation.

Monster

không rơi quá nhiều tiền.

Tiền chủ yếu đến từ

Quest

Trade

Craft

Boss.

19. CRAFT SYSTEM

Craft gồm

Equipment

↓

Potion

↓

Gu

↓

Immortal Gu

Muốn Craft

cần

Recipe

+

Material

+

Spirit Stone

Tiên Cổ

cần thêm

Unique Check

Transaction Lock

World Event

Boss Core
20. WORLD SYSTEM

Game có

5 Đại Vực

Mỗi map gồm

NPC

Monster

Boss

Dungeon

Portal

Treasure

Hidden Area

Map

không load toàn bộ.

Chỉ load

Current Map.

Portal

Portal

mở khi

Story

hoặc

Quest

cho phép.

Dungeon

Dungeon

gồm

Puzzle

↓

Monster

↓

Mini Boss

↓

Treasure

↓

Boss
21. WORLD EVENT

World Event

là Event toàn server.

Ví dụ

Thiên Kiếp

↓

Boss mạnh hơn.
Mưa

↓

Fire yếu

Water mạnh.
Bí cảnh mở.

↓

Boss đặc biệt xuất hiện.

22. SAVE SYSTEM

Có

Auto Save

và

Manual Save

Save

không lưu

mọi object.

Chỉ lưu

Player

Story Flag

Quest

Inventory

Equipment

Gu

Map

NPC State

Mọi dữ liệu tĩnh đọc lại từ Database.

23. BALANCE RULES

Đây là luật bất biến.

Không có vật phẩm rác

Mọi Item

đều có ít nhất

1 công dụng.

Không có Gu vô dụng

Gu yếu

phải có

Passive

hoặc

Craft Value.

Không có Build mạnh tuyệt đối

Build A

thắng

Build B

nhưng

thua

Build C.

Không Pay To Win

Shop

không bán

Gu mạnh.

Không bán

Tiên Cổ.

Không bán

trang bị endgame.

24. EXPANSION RULES

Sau này

có thể thêm

PvP

Guild

Raid

Pet

Mount

Auction

Cross Server

New Realm

New Gu

New Dao

New Map

Không phải sửa Engine.

25. ENGINE RULES

Gameplay

không phụ thuộc

Asset.

Không phụ thuộc

Animation.

Không phụ thuộc

Sprite.

Có thể thay Asset

mà không sửa code.

26. SYSTEM DESIGN PRINCIPLES

Mỗi hệ thống phải tuân thủ:

Data-driven: Dữ liệu nằm trong Database, không hardcode.
Modular: Có thể thay thế hoặc mở rộng độc lập.
Event-driven: Các hệ thống giao tiếp qua sự kiện, giảm phụ thuộc trực tiếp.
Single Responsibility: Mỗi module chỉ đảm nhiệm một chức năng.
Server Authority: Các thao tác quan trọng (craft Tiên Cổ, giao dịch, phần thưởng...) được xác thực ở backend.