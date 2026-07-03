# AGENTS.md

# Gu World Development Rules

## Project

Đây là dự án game RPG Web lấy cảm hứng từ Cổ Chân Nhân.

Mục tiêu là xây dựng một game có kiến trúc rõ ràng, dễ mở rộng và toàn bộ gameplay được điều khiển bằng dữ liệu (Data Driven).

---

# Source of Truth

Khi có mâu thuẫn giữa code và tài liệu, luôn ưu tiên theo thứ tự:

1. docs/02_SYSTEM_BIBLE.md
2. docs/03_DATABASE_DESIGN.md
3. docs/04_BACKEND_ARCHITECTURE.md
4. docs/05_API_SPEC.md
5. content/

Không được tự ý thay đổi các tài liệu này.

---

# AI Rules

Không tự ý:

- thay đổi gameplay
- thay đổi lore
- thay đổi cốt truyện
- đổi database schema
- đổi API
- đổi tên file
- đổi tên thư mục

Nếu phát hiện bất hợp lý phải báo lại thay vì tự sửa.

---

# Coding Principles

- TypeScript Strict Mode
- Clean Architecture
- SOLID
- DRY
- KISS
- Server Authority
- Data Driven Design

Không Hardcode gameplay.

Gameplay phải lấy từ Database hoặc Config.

---

# Database

Không sửa trực tiếp Schema.

Chỉ tạo Migration.

Không xóa dữ liệu.

Không sửa ID.

---

# API

Không đổi Request hoặc Response.

Nếu cần thay đổi phải cập nhật API_SPEC trước.

---

# Combat

Combat phải tuân theo:

docs/02_SYSTEM_BIBLE.md

content/07_GU_BIBLE.md

Không tự thêm skill.

Không tự thêm hiệu ứng.

---

# Story

Story phải tuân theo:

content/01_WORLD.md

content/02_FACTIONS.md

Không tự thêm NPC.

Không tự thêm Boss.

Không tự viết lore mới.

---

# Before coding

Nếu làm Backend

đọc:

docs/02_SYSTEM_BIBLE.md

docs/03_DATABASE_DESIGN.md

docs/04_BACKEND_ARCHITECTURE.md

docs/05_API_SPEC.md

---

Nếu làm Combat

đọc:

docs/02_SYSTEM_BIBLE.md

content/07_GU_BIBLE.md

---

Nếu làm Database

đọc:

docs/03_DATABASE_DESIGN.md

docs/05_API_SPEC.md

---

Nếu làm Story

đọc:

content/01_WORLD.md

content/02_FACTIONS.md

---

# Commit Rules

Mỗi lần chỉ thực hiện MỘT chức năng.

Ví dụ:

✔ Inventory

✔ Combat

✔ Quest

Không sửa nhiều module trong cùng một lần nếu không được yêu cầu.

---

# Khi thiếu thông tin

Không được đoán.

Không tự thiết kế.

Hãy dừng và yêu cầu người dùng bổ sung.

---

# Code Quality

Không dùng any.

Không để TODO.

Không để console.log.

Không để code chết.

Luôn xử lý Error.

Viết code dễ đọc.

Ưu tiên maintainability hơn tối ưu sớm.

---

# Goal

Mục tiêu cuối cùng là xây dựng một game có kiến trúc ổn định, dễ mở rộng và bám sát toàn bộ tài liệu trong thư mục docs và content.

# Mandatory Workflow

Every session MUST follow this order:

1. Read PROJECT_STATUS.md
2. Read GAME_BUILD_PLAN.md
3. Read CHANGELOG.md
4. Read required docs
5. Complete current sprint
6. Build
7. Run lint
8. Run typecheck
9. Run tests
10. Update documentation
11. Stop


# Definition of Done

Một task chỉ được coi là hoàn thành khi:

- Code compile thành công
- Không có TypeScript Error
- Không có ESLint Error
- Test pass
- Build pass
- Docker pass
- API hoạt động
- Documentation được cập nhật
- PROJECT_STATUS.md được cập nhật
- CHANGELOG.md được cập nhật

Nếu chưa đạt đủ điều kiện thì KHÔNG được đánh dấu Completed.

# Asset Rules

Asset nằm trong thư mục:

assets/

AI phải sử dụng asset có sẵn.

Không tự tạo asset.

Không đổi tên file.

Nếu thiếu asset:

- dùng placeholder
- tiếp tục phát triển gameplay
- không dừng Sprint vì thiếu hình ảnh

Toàn bộ đường dẫn asset phải được cấu hình trong code, không hardcode trực tiếp.

# Asset Policy

The current project uses placeholder assets.

Never stop development because an asset is missing.

If an asset is unavailable:

- use placeholder assets
- keep filenames configurable
- never hardcode asset paths
- never generate replacement art
- continue implementing gameplay