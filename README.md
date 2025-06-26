# Hệ Thống Quản Lý Lấy Số

Ứng dụng web quản lý việc lấy số với giao diện hiện đại và dễ sử dụng.

## Tính Năng

### Cho Người Dùng
- **Đăng nhập**: Hệ thống xác thực người dùng
- **Lấy số**: Nhập nội dung và lấy số tự động tăng
- **Xem lịch sử**: Theo dõi các lần lấy số của mình
- **Giao diện thân thiện**: Thiết kế responsive, dễ sử dụng

### Cho Admin
- **Quản lý số**: Cấu hình số bắt đầu cho hệ thống
- **Quản lý người dùng**: Thêm, xóa tài khoản người dùng
- **Xuất dữ liệu**: Xuất file Excel danh sách người dùng và lịch sử lấy số
- **Theo dõi toàn bộ**: Xem tất cả hoạt động lấy số trong hệ thống

## Cách Sử Dụng

### Khởi động
1. Mở file `index.html` trong trình duyệt web
2. Hệ thống sẽ tự động khởi tạo với tài khoản admin mặc định

### Tài khoản Admin mặc định
- **Tên đăng nhập**: `admin`
- **Mật khẩu**: `admin123`

### Đăng nhập Admin
1. Trên trang đăng nhập, click "Đăng nhập Admin"
2. Nhập thông tin tài khoản admin
3. Truy cập vào bảng điều khiển admin

### Thêm người dùng mới
1. Đăng nhập với tài khoản admin
2. Trong phần "Quản lý tài khoản", click "Thêm Người Dùng"
3. Điền thông tin: Họ tên, tên đăng nhập, mật khẩu
4. Click "Thêm Người Dùng"

### Cấu hình số bắt đầu
1. Trong bảng điều khiển admin, phần "Cấu hình số"
2. Nhập số bắt đầu mong muốn (ví dụ: 100, 200)
3. Click "Cập Nhật"
4. Số sẽ tự động tăng từ số này

### Lấy số (cho người dùng)
1. Đăng nhập với tài khoản người dùng
2. Nhập nội dung cần lấy số
3. Click "Lấy Số"
4. Hệ thống sẽ hiển thị số và lưu vào lịch sử

### Xuất dữ liệu
1. Trong bảng điều khiển admin
2. **Xuất danh sách người dùng**: Click "Xuất Danh Sách Người Dùng"
3. **Xuất danh sách lấy số**: Click "Xuất Danh Sách Lấy Số"
4. File Excel sẽ được tải về máy

## Cấu Trúc Dữ Liệu

### File Excel - Danh sách người dùng
- Họ và tên
- Tên đăng nhập
- Mật khẩu

### File Excel - Danh sách lấy số
- Số cần lấy
- Nội dung
- Ngày giờ lấy
- Họ tên người lấy

## Lưu Trữ Dữ Liệu

Hệ thống sử dụng **localStorage** của trình duyệt để lưu trữ:
- Thông tin người dùng
- Lịch sử lấy số
- Cấu hình số hiện tại

## Tính Năng Kỹ Thuật

- **Responsive Design**: Hoạt động tốt trên mọi thiết bị
- **Local Storage**: Lưu trữ dữ liệu cục bộ
- **Excel Export**: Xuất dữ liệu ra file Excel
- **Real-time Updates**: Cập nhật giao diện ngay lập tức
- **User Authentication**: Xác thực người dùng an toàn

## Yêu Cầu Hệ Thống

- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Kết nối internet để tải thư viện Font Awesome và SheetJS
- JavaScript được bật

## Bảo Mật

- Mật khẩu được lưu trữ dưới dạng plain text (cho mục đích demo)
- Dữ liệu được lưu trong localStorage của trình duyệt
- Khuyến nghị sử dụng HTTPS trong môi trường production

## Hỗ Trợ

Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng:
1. Kiểm tra console của trình duyệt để xem lỗi
2. Đảm bảo JavaScript được bật
3. Thử làm mới trang web

## Phiên Bản

- **Version**: 1.0.0
- **Ngày cập nhật**: 2024
- **Tác giả**: Hệ thống quản lý lấy số 