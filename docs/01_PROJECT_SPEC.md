Version: 1.0



Project Name (Working Title):



《CỔ ĐẠO》 (tên tạm)



Genre



Story RPG

Adventure RPG

Cultivation RPG

Single Player Online

Data Driven RPG



Platform



Web

Desktop (Electron sau này)

Mobile (PWA sau này)

1\. PROJECT VISION

1.1 Tầm nhìn



Mục tiêu của dự án không phải tạo ra một game idle, cũng không phải một game MMORPG khổng lồ ngay từ đầu.



Mục tiêu là xây dựng một Story-driven RPG lấy cảm hứng từ dòng tiểu thuyết tiên hiệp và cổ trùng, trong đó:



Cốt truyện là trung tâm.

Người chơi phát triển thông qua hệ thống tu luyện và Cổ Trùng.

Mỗi lựa chọn đều có ảnh hưởng đến diễn biến về sau.

Thế giới game có tính liên tục và có khả năng mở rộng trong nhiều năm.



Đây là một dự án hướng đến kiến trúc chuẩn, có thể phát triển dần từ phiên bản Alpha đến Production mà không cần thiết kế lại toàn bộ hệ thống.



1.2 Triết lý thiết kế



Dự án tuân theo các nguyên tắc sau:



Story First



Mọi hệ thống đều phục vụ cốt truyện.



Không tồn tại việc người chơi chỉ farm quái vô tận mà không có mục tiêu.



Chu kỳ gameplay luôn là:



Khám phá



↓



Hội thoại



↓



Nhận nhiệm vụ



↓



Chiến đấu



↓



Nhận thưởng



↓



Tu luyện



↓



Mở chương truyện mới

Gameplay before Graphics



Ưu tiên gameplay.



Không cần hiệu ứng đẹp.



Không cần animation phức tạp.



Placeholder hoàn toàn chấp nhận được.



Một hệ thống gameplay tốt sẽ tồn tại lâu hơn một hiệu ứng đẹp.



Data Driven



Toàn bộ dữ liệu game phải được cấu hình thông qua Database hoặc JSON.



Không hardcode.



Ví dụ:



Monster



Boss



NPC



Dialogue



Quest



Item



Skill



Gu



Drop



Craft



Shop



đều phải nằm trong dữ liệu.



Modular



Mỗi hệ thống phải độc lập.



Ví dụ



Combat



không được phụ thuộc



Quest.



Quest



không được phụ thuộc



Inventory.



Inventory



không được phụ thuộc



Dialogue.



Mọi giao tiếp giữa các module thông qua Event hoặc Service.



2\. CORE GAMEPLAY



Gameplay Loop chính



Đăng nhập



↓



Đọc Story



↓



Đi gặp NPC



↓



Nhận Quest



↓



Khám phá Map



↓



Đánh Monster



↓



Thu thập tài nguyên



↓



Luyện chế



↓



Đột phá Chuyển



↓



Đánh Boss



↓



Mở Chapter



↓



Tiếp tục Story



Đây là vòng lặp xuyên suốt toàn bộ game.



3\. CORE FEATURES



Game sẽ có các hệ thống chính:



Story System

Dialogue System

Quest System

Cultivation System

Gu System

Equipment System

Enhancement System

Evolution System

Crafting System

NPC System

Monster AI

Boss AI

Save System

Inventory

Shop

World Map

Achievement

Mail

Encyclopedia (Bách Khoa Cổ Trùng, Quái vật, NPC)

4\. THẾ GIỚI



Thế giới được chia thành năm đại vực.



Bắc Nguyên



Địa hình băng tuyết.



Quái thiên về phòng thủ.



Boss thiên về khống chế.



Nam Cương



Rừng nguyên sinh.



Độc.



Cổ Trùng.



Bí cảnh.



Tây Mạc



Sa mạc.



Quái tốc độ cao.



Boss sử dụng cát và lửa.



Đông Hải



Hải vực.



Đảo.



Thủy hệ.



Boss triệu hồi.



Trung Châu



Trung tâm thế giới.



Các đại tông môn.



Nơi diễn ra phần lớn cốt truyện cuối game.



5\. HỆ THỐNG TU LUYỆN



Game không sử dụng Level truyền thống.



Thay vào đó là hệ thống Chuyển.



1 Chuyển



↓



2 Chuyển



↓



3 Chuyển



↓



4 Chuyển



↓



5 Chuyển



↓



6 Chuyển



↓



7 Chuyển



↓



8 Chuyển



↓



9 Chuyển

Ý nghĩa của Chuyển



Mỗi lần đột phá sẽ:



tăng toàn bộ chỉ số cơ bản.

mở thêm slot Cổ Trùng.

mở khu vực mới.

mở Boss mới.

mở kỹ năng mới.

mở chương truyện mới.

mở công thức luyện chế mới.

6\. HỆ THỐNG ĐẠẠO (DAO PATH)



Ngoài Chuyển, mỗi nhân vật sẽ chọn một Đạo Chủ Tu.



Ví dụ:



Kiếm Đạo

Hỏa Đạo

Thủy Đạo

Phong Đạo

Lôi Đạo

Độc Đạo

Huyết Đạo

Mộc Đạo

Không Gian Đạo

Thời Gian Đạo

Linh Hồn Đạo



Đạo không khóa hoàn toàn cách chơi, nhưng mang lại:



cộng hưởng với một số Cổ Trùng;

mở kỹ năng riêng;

mở nhánh cốt truyện;

ảnh hưởng đến một số NPC và phe phái.



Điều này tạo ra giá trị chơi lại cao mà không ép người chơi đi theo một khuôn mẫu duy nhất.



7\. HỆ THỐNG CỔ TRÙNG (GU SYSTEM)



Đây là hệ thống cốt lõi của game.



Không Khiếu



Mỗi người chơi sở hữu một Không Khiếu.



Không Khiếu là nơi chứa Cổ Trùng.



Số slot phụ thuộc vào Chuyển:



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



Người chơi phải lựa chọn bộ Cổ phù hợp với lối chơi của mình.



Phân loại Cổ

Phàm Cổ

1 Chuyển

2 Chuyển

3 Chuyển

4 Chuyển

5 Chuyển



Có thể nhận từ:



Quái

Boss

Shop

Quest

Dungeon

Giao dịch

Tiên Cổ

6 Chuyển

7 Chuyển

8 Chuyển

9 Chuyển



Không rơi từ quái.



Không bán trong shop.



Không thưởng nhiệm vụ.



Chỉ có thể tạo bằng Luyện Chế Tiên Cổ.



Tiên Cổ duy nhất



Mỗi Tiên Cổ chỉ tồn tại một bản duy nhất trên toàn server.



Ví dụ:



Tiên Cổ Sinh Mệnh

Tiên Cổ Không Gian

Tiên Cổ Thời Gian



Nếu đã có người sở hữu, người khác không thể luyện thành.



Hệ thống backend phải sử dụng transaction và ràng buộc dữ liệu để đảm bảo tính duy nhất tuyệt đối.



Thuộc tính của Cổ Trùng



Mỗi Cổ Trùng đều có:



Tên

Chuyển

Vai trò (Tấn công, Phòng thủ, Hỗ trợ, Khống chế, Triệu hồi)

Thuộc tính

Chỉ số cơ bản (HP, ATK, DEF, SPD, Crit, ...)

Kỹ năng chủ động (0 hoặc nhiều)

Kỹ năng bị động (0 hoặc nhiều)

Hiệu ứng cộng hưởng (Synergy)

Cấp cường hóa

Trạng thái tiến hóa



Cổ càng cao Chuyển thì chỉ số cơ bản càng mạnh, nhưng người chơi vẫn phải cân nhắc vì số slot Không Khiếu luôn bị giới hạn.



Cộng hưởng (Synergy)



Một số Cổ khi đi cùng nhau sẽ kích hoạt hiệu ứng đặc biệt.



Ví dụ:



Hỏa Cổ + Phong Cổ → tăng sát thương cháy lan.

Huyết Cổ + Độc Cổ → gây hiệu ứng "Độc Huyết", vừa mất máu theo thời gian vừa giảm hồi phục.

Thủy Cổ + Băng Cổ → đóng băng mục tiêu lâu hơn.



Hệ thống này khuyến khích xây dựng nhiều hướng build khác nhau thay vì chỉ chọn Cổ có chỉ số cao nhất.

8. CORE PLAYER PROGRESSION
Mục tiêu thiết kế

Một lỗi rất phổ biến của RPG là:

Level ↑

↓

Damage ↑

↓

Đánh quái mạnh hơn

↓

Level ↑

Gameplay trở nên lặp lại.

Game này không đi theo hướng đó.

Sự phát triển của người chơi gồm 5 lớp độc lập:

Story Progress

↓

Cultivation (Chuyển)

↓

Gu Build

↓

Equipment

↓

Player Skill

Có nghĩa là:

Một người chơi 5 Chuyển

vẫn có thể thua

một người chơi 4 Chuyển

nếu Build Gu tốt hơn.

9. HỆ THỐNG SỨC MẠNH

Sức mạnh người chơi KHÔNG chỉ đến từ Chuyển.

Nguồn sức mạnh gồm:

Chuyển

+

Đạo

+

Gu

+

Equipment

+

Enhancement

+

Synergy

+

Story Reward

+

Player Skill

Không có hệ thống nào được phép mạnh tuyệt đối.

Ví dụ

Không được phép:

Chỉ cần nhiều tiền

↓

Mạnh.

Hoặc

Chỉ cần farm

↓

Mạnh.

Người chơi phải đầu tư chiến thuật.

10. THUỘC TÍNH NHÂN VẬT
Chỉ số cơ bản
HP

Mana

Attack

Defense

Attack Speed

Movement Speed

Critical Chance

Critical Damage

Accuracy

Dodge

Life Steal

Shield

Cooldown Reduction

Status Resistance

Healing Bonus
Chỉ số mở rộng
Fire Damage

Water Damage

Wind Damage

Lightning Damage

Poison Damage

Blood Damage

Soul Damage

Space Damage

Time Damage

Đây là các loại sát thương cao cấp.

Sau này có thể mở rộng.

11. HỆ THỐNG CHỈ SỐ

Mỗi chỉ số sẽ có:

Base

+

Equipment

+

Gu

+

Passive

+

Buff

+

Story Bonus

=

Final Value

Ví dụ

HP

1000

+

300

+

500

+

20%

=

2160

Không được cộng dồn trực tiếp.

Tất cả đều thông qua Stat Calculator.

12. STAT CALCULATOR

Toàn bộ game chỉ tồn tại

một

Stat Calculator.

Không được tính chỉ số ở nhiều nơi.

Ví dụ

Sai

Monster tính HP.

Player tính HP.

Equipment tính HP.

Đúng

Stat Calculator

↓

Player

Monster

Boss

NPC

Điều này giúp cân bằng game dễ dàng.

13. HỆ THỐNG GU

Đây là gameplay quan trọng nhất.

Mỗi Gu gồm

Basic Stats

+

Passive

+

Active

+

Synergy

+

Enhancement

+

Evolution

Ví dụ

Hỏa Cổ

HP

+250

ATK

+80

Passive

+10% Fire Damage

Skill

Fire Ball

Synergy

Hỏa + Phong

↓

Fire Storm
14. ROLE CỦA GU

Mỗi Gu sẽ thuộc một Role.

Ví dụ

Tank

Support

Damage

Assassin

Control

Summoner

Utility

Economic

Story

Ví dụ

Treasure Gu

Không tăng Damage.

Nhưng

+20%

Drop Rate
Merchant Gu
Shop

-10%
Lucky Gu
Critical

+

Drop

+

Craft Success

Như vậy

không phải Gu nào cũng để đánh nhau.

15. BUILD SYSTEM

Đây là phần tạo replay value.

Ví dụ

Tank Build

Shield Gu

Stone Gu

Life Gu

Earth Gu

Poison Build

Poison Gu

Blood Gu

Spider Gu

Curse Gu

Summoner

Wolf Gu

Spirit Gu

Ghost Gu

Command Gu

Speed Build

Wind Gu

Flash Gu

Lightning Gu

Merchant Build

Treasure Gu

Lucky Gu

Trade Gu

Có thể kiếm tiền tốt hơn.

16. ENHANCEMENT SYSTEM

Không chỉ Equipment.

Gu cũng cường hóa.

Ví dụ

+0

↓

+1

HP

+

ATK

↓

+3

Passive

+

5%

↓

+5

Unlock Passive

↓

+8

Skill Level +1

↓

+10

Unlock Hidden Attribute

↓

+15

Evolution Ready

↓

+20

Evolution

Equipment

cũng tương tự.

Nhưng

Equipment

và

Gu

dùng

hai hệ thống Enhancement

khác nhau.

17. EVOLUTION

Đây KHÔNG phải Enhancement.

Ví dụ

Little Fire Gu

↓

Fire Gu

↓

Blazing Fire Gu

↓

Heaven Fire Gu

↓

Immortal Fire Gu

Evolution

thay đổi

Sprite

Skill

Passive

Stats

Lore
18. IMMORTAL GU

Đây là endgame.

Ví dụ

Immortal Space Gu

Database

Unique = TRUE

Nếu đã tồn tại.

Không ai khác tạo được.

Immortal Gu

không chỉ mạnh.

Mà còn

thay đổi gameplay.

Ví dụ

Time Gu

Skill

Reset Cooldown
Space Gu
Teleport
Life Gu
Revive
Dream Gu
Enter Dream Realm

Đây là các Gu có khả năng mở khóa cơ chế mới, không chỉ tăng chỉ số.

19. HỆ THỐNG CRAFTING

Crafting chia thành

4 nhánh.

Equipment
Potion
Gu
Immortal Gu
Luyện Gu

Muốn tạo Gu.

Cần

Recipe

+

Materials

+

Spirit Stone

+

Craft Level
Luyện Tiên Cổ

Muốn tạo

Immortal Gu

cần

Recipe

+

Rare Materials

+

Boss Heart

+

Heaven Crystal

+

World Event

+

Unique Check

+

Transaction Lock

Nếu

Unique Check

=

Fail

thì

không thể luyện.

20. CRAFT FAILURE

Craft

không phải

100%.

Ví dụ

Equipment

95%
Rare Equipment

80%
Immortal Gu

5%

Có thể tăng

Craft Level

Lucky Gu

Craft Buff

NPC Master
21. NGUYÊN TẮC THIẾT KẾ QUAN TRỌNG
Không có vật phẩm vô dụng

Mỗi vật phẩm đều có ít nhất một công dụng:

Cường hóa
Luyện chế
Nhiệm vụ
Giao dịch
Nâng cấp
Mở khóa cốt truyện

Không nên tồn tại "rác" chỉ để bán.

Không có build hoàn hảo

Mọi build đều có điểm mạnh và điểm yếu.

Ví dụ:

Build tốc độ rất cơ động nhưng phòng thủ thấp.
Build triệu hồi mạnh ở giao tranh kéo dài nhưng yếu khi bị áp sát.
Build độc gây sát thương theo thời gian cao nhưng dồn sát thương ban đầu thấp.
Cốt truyện luôn dẫn dắt gameplay

Người chơi không nên bị "thả" vào thế giới để tự farm vô định. Mỗi chương truyện cần giới thiệu cơ chế mới, NPC mới hoặc mục tiêu mới để tạo động lực khám phá.

22. WORLD DESIGN PHILOSOPHY
Thế giới phải "sống"

Đây KHÔNG phải map.

Đây là một thế giới.

Ví dụ.

Sai.

NPC đứng yên.

24/24.

Đúng.

6h

↓

NPC mở cửa hàng.

↓

12h

↓

đi ăn.

↓

18h

↓

về nhà.

↓

22h

↓

ngủ.

Người chơi quay lại ban đêm.

Shop đóng cửa.

NPC nhớ người chơi

Ví dụ.

Bạn cứu NPC.

NPC sẽ nhớ.

Sau này gặp lại.

Lời thoại khác.

Nếu giết người thân NPC.

NPC ghét bạn.

Không bán đồ nữa.

Mọi quyết định đều được lưu.

Ví dụ.

Save Flag

npc_merchant_saved = true

boss_1_dead = true

chapter_2_complete = true

betray_faction = false

Toàn bộ cốt truyện sẽ đọc từ đây.

23. STORY ARCHITECTURE

Story không viết theo Quest.

Story viết theo Chapter.

Ví dụ

Chapter 1

↓

Quest

↓

Dialogue

↓

Boss

↓

Cutscene

↓

Unlock Chapter 2

Mỗi Chapter gồm

Opening

Conflict

Twist

Dungeon

Boss

Ending

Reward

Không được phép

Quest

↓

Quest

↓

Quest

↓

Quest

rất nhàm chán.

24. QUEST DESIGN

Quest chia thành

Main Quest

Đẩy Story.

Side Quest

Mở rộng thế giới.

Hidden Quest

Không hiện.

Tự khám phá.

Chain Quest

Nhiều phần.

Reputation Quest

Theo phe phái.

World Quest

Toàn server.

Legendary Quest

Mở Immortal Gu.

25. DIALOGUE SYSTEM

Dialogue

không chỉ là text.

Mỗi đoạn hội thoại có

Speaker

Portrait

Emotion

Voice

Background

Music

Animation

Choices

Ví dụ

NPC

Ngươi muốn cứu hắn?

① Cứu

② Bỏ mặc

③ Giết luôn

Lựa chọn

không chỉ đổi lời thoại.

Mà đổi

Story.

26. STORY FLAGS

Đây là thứ quan trọng nhất.

Ví dụ

SaveFlag

saved_child

killed_merchant

join_fire_sect

join_water_sect

trust_npc

romance_npc

Toàn bộ Story

đọc từ đây.

Không dùng

if chapter == 3
27. NPC SYSTEM

Hiện asset có

char_2

↓

char_10

sẽ là NPC.

Nhưng hệ thống phải hỗ trợ

1000+

NPC.

Mỗi NPC

ID

Name

Age

Gender

Race

Faction

Profession

Personality

Relationship

Friendship

Affinity

Schedule

Dialogue

Quest

Shop

Animation

Voice

AI

Ví dụ

NPC

Lâm lão đầu

Sáng

đi câu cá.

Trưa

về làng.

Tối

uống rượu.

Nếu

Boss

tấn công.

NPC

bỏ chạy.

28. FACTION SYSTEM

Game có nhiều phe.

Ví dụ

Thiên Kiếm Môn

↓

Huyết Giáo

↓

Vạn Độc Cốc

↓

Thiên Cơ Các

↓

Thương Minh

↓

Ma Đạo

Gia nhập

một phe.

Sẽ mất

một số Quest

phe khác.

Ví dụ

Bạn gia nhập

Ma Đạo

Thì

Chính Đạo

không tin bạn.

29. RELATIONSHIP

Mỗi NPC

đều có

Affinity

Ví dụ

-100

Enemy
0

Neutral
100

Best Friend

Có NPC

còn có

Love

Không bắt buộc.

30. REPUTATION

Danh tiếng

không phải

Affinity.

Ví dụ.

Bạn

giết Boss.

Toàn vùng

đều biết.

Danh tiếng tăng.

Bạn

cướp NPC.

Danh tiếng giảm.

NPC

đọc Reputation.

không đọc

Quest.

31. WORLD EVENT

Mỗi ngày

Server

sẽ sinh Event.

Ví dụ

Thiên Kiếp

Boss mạnh hơn.

Mưa lớn

Thủy hệ

+20%.

Động đất

Map thay đổi.

Bí cảnh mở.

Portal xuất hiện.

Điều này khiến

thế giới

luôn thay đổi.

32. WEATHER

Weather

không chỉ để đẹp.

Ví dụ

Rain

Fire

-20%.

Water

+20%.

Snow

Move Speed

-10%.

Storm

Lightning

+40%.

33. DAY NIGHT

Ban ngày

NPC khác.

Ban đêm

Monster mạnh hơn.

Một số Quest

chỉ mở

22h.

Boss

chỉ xuất hiện

3h sáng.

34. DUNGEON

Dungeon

không random hoàn toàn.

Mỗi Dungeon

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

Không chỉ

đánh quái.

35. SECRET AREA

Map

có

Hidden Area.

Ví dụ

Đập vỡ tảng đá.

↓

Lộ mật thất.

Có

100+

bí mật.

36. PLAYER CHOICE

Đây là nguyên tắc lớn nhất.

Game

không ép.

Ví dụ.

Boss

Giết.

↓

Tha.

↓

Thu phục.

Ba lựa chọn.

Ba Story.

37. MULTIPLE ENDING

Game

không có

một Ending.

Ví dụ

Immortal Ending
Demon Ending
King Ending
Destroy World Ending
Peace Ending

Mỗi Ending

đọc

Story Flags.

Không đọc

Chapter.