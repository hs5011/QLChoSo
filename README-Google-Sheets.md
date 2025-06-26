# Hệ Thống Quản Lý Lấy Số - Google Sheets Version

Ứng dụng web quản lý việc lấy số với lưu trữ dữ liệu trên Google Sheets thay vì localStorage.

## 🚀 Tính Năng Mới

### Lưu Trữ Dữ Liệu
- ✅ **Google Sheets**: Tất cả dữ liệu được lưu trữ trên Google Sheets
- ✅ **Đồng bộ real-time**: Dữ liệu được cập nhật ngay lập tức
- ✅ **Backup tự động**: Dữ liệu được backup trên Google Drive
- ✅ **Truy cập từ mọi nơi**: Có thể xem dữ liệu từ bất kỳ đâu

### Cải Tiến Hệ Thống
- ✅ **Connection Status**: Hiển thị trạng thái kết nối với Google Sheets
- ✅ **Refresh Data**: Nút làm mới dữ liệu từ Google Sheets
- ✅ **Error Handling**: Xử lý lỗi kết nối tốt hơn
- ✅ **Fallback Mode**: Hoạt động offline khi không kết nối được

## 📋 Cách Setup

### Bước 1: Tạo Google Sheet
1. Mở [Google Sheets](https://sheets.google.com)
2. Tạo sheet mới với tên "Hệ Thống Lấy Số"
3. Tạo 3 sheet con:
   - **Users**: Lưu thông tin người dùng
   - **Numbers**: Lưu lịch sử lấy số
   - **Config**: Lưu cấu hình hệ thống

### Bước 2: Cấu hình Google Apps Script
1. Trong Google Sheet, chọn **Extensions > Apps Script**
2. Copy code từ file `google-sheets-setup.html`
3. Deploy thành Web App với quyền "Anyone"

### Bước 3: Cập nhật URL
1. Mở file `script-google-sheets.js`
2. Thay đổi `GOOGLE_SHEETS_URL` thành URL Web App của bạn

### Bước 4: Sử dụng
1. Mở file `index-google-sheets.html`
2. Hệ thống sẽ tự động kết nối với Google Sheets

## 📊 Cấu Trúc Dữ Liệu

### Sheet "Users"
| Name | Username | Password | IsAdmin |
|------|----------|----------|---------|
| Admin | admin | admin123 | TRUE |
| Nguyễn Văn A | user1 | password1 | FALSE |

### Sheet "Numbers"
| Number | Content | UserName | Timestamp | DateTime |
|--------|---------|----------|-----------|----------|
| 100 | Lấy số khám bệnh | Nguyễn Văn A | 01/01/2024 09:00 | 2024-01-01T09:00:00Z |

### Sheet "Config"
| CurrentNumber |
|---------------|
| 101 |

## 🔧 Cấu Hình

### File cần thiết:
- `index-google-sheets.html` - Trang web chính
- `script-google-sheets.js` - Logic xử lý
- `styles.css` - Giao diện
- `google-sheets-setup.html` - Hướng dẫn setup

### Biến cấu hình:
```javascript
const GOOGLE_SHEETS_URL = 'YOUR_WEB_APP_URL_HERE';
```

## 🎯 Lợi Ích

### So với localStorage:
- ✅ **Bảo mật cao hơn**: Dữ liệu không lưu trên máy local
- ✅ **Đồng bộ đa thiết bị**: Cùng dữ liệu trên mọi thiết bị
- ✅ **Backup tự động**: Google Drive backup
- ✅ **Quản lý dễ dàng**: Có thể chỉnh sửa trực tiếp trên Google Sheets
- ✅ **Không mất dữ liệu**: Dữ liệu không bị mất khi xóa cache

### So với database:
- ✅ **Dễ setup**: Không cần server
- ✅ **Miễn phí**: Google Sheets miễn phí
- ✅ **Giao diện quen thuộc**: Excel-like interface
- ✅ **Tích hợp sẵn**: API có sẵn

## 🚨 Lưu Ý Quan Trọng

### Bảo Mật
- Google Sheet phải được chia sẻ với quyền "Anyone with the link can edit"
- Web App phải được deploy với quyền "Anyone"
- Mật khẩu được lưu dưới dạng plain text (cần cải thiện cho production)

### Hiệu Suất
- Có thể chậm hơn localStorage do network request
- Cần internet để hoạt động
- Rate limit của Google Apps Script

### Troubleshooting
1. **Không kết nối được**: Kiểm tra URL Web App
2. **Lỗi CORS**: Đảm bảo Web App được deploy đúng
3. **Dữ liệu không cập nhật**: Click "Làm Mới Dữ Liệu"

## 📱 Sử Dụng

### Cho Người Dùng:
1. Đăng nhập với tài khoản được tạo
2. Nhập nội dung và lấy số
3. Xem lịch sử lấy số của mình

### Cho Admin:
1. Đăng nhập với tài khoản admin
2. Quản lý người dùng và cấu hình số
3. Xuất dữ liệu ra Excel
4. Làm mới dữ liệu từ Google Sheets

## 🔄 Migration từ localStorage

Nếu bạn đang sử dụng phiên bản localStorage:

1. **Backup dữ liệu**: Xuất dữ liệu từ localStorage
2. **Setup Google Sheets**: Làm theo hướng dẫn setup
3. **Import dữ liệu**: Copy dữ liệu vào Google Sheets
4. **Chuyển đổi**: Sử dụng file `index-google-sheets.html`

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser để xem lỗi
2. Đảm bảo Google Sheets được setup đúng
3. Kiểm tra kết nối internet
4. Thử refresh trang và làm mới dữ liệu

## 🆕 Phiên Bản

- **Version**: 2.0.0 (Google Sheets)
- **Ngày cập nhật**: 2024
- **Tác giả**: Hệ thống quản lý lấy số
- **License**: MIT 