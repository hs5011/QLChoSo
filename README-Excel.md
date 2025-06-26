# 🎫 Hệ Thống Quản Lý Lấy Số - Lưu Trữ Excel

## 📋 Mô Tả

Hệ thống quản lý lấy số với khả năng lưu trữ dữ liệu trực tiếp vào file Excel. Hệ thống không cần internet và hoạt động hoàn toàn offline.

## ✨ Tính Năng

### 👤 Người Dùng
- ✅ Đăng nhập với tài khoản riêng
- ✅ Lấy số tự động tăng
- ✅ Xem lịch sử lấy số cá nhân
- ✅ Giao diện thân thiện, dễ sử dụng

### ⚙️ Admin
- ✅ Quản lý số hiện tại
- ✅ Thêm/xóa người dùng
- ✅ Xem tất cả lịch sử lấy số
- ✅ Xuất dữ liệu ra file Excel
- ✅ Quản lý toàn bộ hệ thống

### 💾 Lưu Trữ
- ✅ Dữ liệu lưu trong file Excel
- ✅ Không cần cơ sở dữ liệu
- ✅ Backup tự động
- ✅ Hoạt động offline

## 🚀 Cách Sử Dụng

### Bước 1: Tạo File Excel Mẫu

1. Mở file `create-excel-files.html` trong trình duyệt
2. Click nút **"📁 Tạo Tất Cả File"** để tạo 3 file Excel:
   - `users.xlsx` - Chứa thông tin người dùng
   - `numbers.xlsx` - Chứa lịch sử lấy số
   - `config.xlsx` - Chứa cấu hình hệ thống

### Bước 2: Chạy Hệ Thống

1. Mở file `index.html` trong trình duyệt
2. Đăng nhập với tài khoản Admin:
   - **Tên đăng nhập:** `admin`
   - **Mật khẩu:** `admin123`

### Bước 3: Sử Dụng

#### Đăng nhập Admin:
- Quản lý số hiện tại
- Thêm người dùng mới
- Xem tất cả lịch sử
- Xuất dữ liệu

#### Đăng nhập Người dùng:
- Lấy số mới
- Xem lịch sử cá nhân

## 📁 Cấu Trúc File

```
QLChoSo1/
├── index.html                 # Trang chính
├── create-excel-files.html    # Tạo file Excel mẫu
├── excel-system.js           # Hệ thống đọc/ghi Excel
├── script.js                 # Logic chính
├── styles.css                # Giao diện
├── users.xlsx                # Dữ liệu người dùng
├── numbers.xlsx              # Lịch sử lấy số
├── config.xlsx               # Cấu hình hệ thống
└── README-Excel.md           # Hướng dẫn này
```

## 📊 Cấu Trúc Dữ Liệu Excel

### File `users.xlsx`
| Name | Username | Password | IsAdmin |
|------|----------|----------|---------|
| Admin | admin | admin123 | TRUE |
| Nguyễn Văn A | user1 | pass123 | FALSE |

### File `numbers.xlsx`
| Number | Content | UserName | Timestamp | DateTime |
|--------|---------|----------|-----------|----------|
| 100 | Làm thủ tục | Nguyễn Văn A | 01/01/2024 09:00 | 2024-01-01T09:00:00 |

### File `config.xlsx`
| CurrentNumber |
|---------------|
| 101 |

## 🔧 Cấu Hình

### Thay Đổi Số Bắt Đầu
1. Đăng nhập Admin
2. Vào phần "Quản Lý Số"
3. Nhập số mới và click "Cập nhật"

### Thêm Người Dùng Mới
1. Đăng nhập Admin
2. Vào phần "Quản Lý Người Dùng"
3. Điền thông tin và click "Thêm người dùng"

### Xuất Dữ Liệu
1. Đăng nhập Admin
2. Click nút xuất tương ứng:
   - "📋 Xuất danh sách người dùng"
   - "📊 Xuất lịch sử lấy số"

## ⚠️ Lưu Ý Quan Trọng

### 🔒 Bảo Mật
- Không chia sẻ file Excel chứa mật khẩu
- Backup file Excel thường xuyên
- Đổi mật khẩu Admin sau khi cài đặt

### 💾 Lưu Trữ
- Không mở file Excel khi hệ thống đang chạy
- Đảm bảo file Excel không bị khóa
- Backup dữ liệu định kỳ

### 🖥️ Hệ Thống
- Chạy trên web server để tránh lỗi CORS
- Sử dụng trình duyệt hiện đại
- Đảm bảo JavaScript được bật

## 🛠️ Khắc Phục Sự Cố

### Lỗi "Failed to fetch"
- Chạy file qua web server (Live Server, Python HTTP server)
- Kiểm tra file Excel có tồn tại không
- Đảm bảo file Excel không bị mở bởi ứng dụng khác

### Lỗi "Cannot read file"
- Kiểm tra quyền truy cập file
- Đảm bảo file Excel đúng định dạng
- Tạo lại file Excel mẫu nếu cần

### Lỗi "User not found"
- Kiểm tra file `users.xlsx`
- Đảm bảo tên đăng nhập và mật khẩu đúng
- Tạo lại tài khoản Admin nếu cần

## 📞 Hỗ Trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console của trình duyệt (F12)
2. File Excel có đúng định dạng không
3. Quyền truy cập file
4. Web server có hoạt động không

## 🔄 Cập Nhật

### Phiên Bản 1.0
- ✅ Hệ thống đăng nhập
- ✅ Quản lý lấy số
- ✅ Lưu trữ Excel
- ✅ Giao diện responsive
- ✅ Xuất dữ liệu

---

**🎉 Chúc bạn sử dụng hệ thống hiệu quả!** 