// Global variables
let currentUser = null;
let isAdmin = false;
let currentNumber = 100; // Default starting number
let users = [];
let numberHistory = [];

// Initialize the application
async function init() {
    try {
        // Load data từ Firestore
        await excelSystem.loadData();

        // Đọc lại trạng thái đăng nhập
        const savedUser = localStorage.getItem('currentUser');
        const savedIsAdmin = localStorage.getItem('isAdmin');
        if (savedUser && savedIsAdmin) {
            currentUser = JSON.parse(savedUser);
            isAdmin = savedIsAdmin === '1';
            if (isAdmin) {
                showAdminDashboard();
            } else {
                showUserDashboard();
            }
        } else {
            showLoginForm();
        }

        updateCurrentNumberDisplay();
        updateAdminCurrentNumberDisplay();

        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing application:', error);
        // Không hiển thị showError nữa
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    document.getElementById('login').addEventListener('submit', handleLogin);
    document.getElementById('adminLogin').addEventListener('submit', handleAdminLogin);
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
}

// Data management functions
function loadData() {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // Initialize with default admin user
        users = [
            {
                name: 'Admin',
                username: 'admin',
                password: 'admin123',
                isAdmin: true
            }
        ];
        saveUsers();
    }

    // Load number history
    const savedHistory = localStorage.getItem('numberHistory');
    if (savedHistory) {
        numberHistory = JSON.parse(savedHistory);
    }

    // Load current number
    const savedNumber = localStorage.getItem('currentNumber');
    if (savedNumber) {
        currentNumber = parseInt(savedNumber);
    }
}

function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveNumberHistory() {
    localStorage.setItem('numberHistory', JSON.stringify(numberHistory));
}

function saveCurrentNumber() {
    localStorage.setItem('currentNumber', currentNumber.toString());
}

// UI Navigation functions
function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('userDashboard').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showAdminLogin() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.remove('hidden');
    document.getElementById('userDashboard').classList.add('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

function showUserLogin() {
    showLoginForm();
}

function showUserDashboard() {
    document.getElementById('loginForm').classList.add('hidden');
    if (document.getElementById('adminLoginForm')) document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('userDashboard').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    
    var userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName && currentUser) {
        userDisplayName.textContent = currentUser.name;
    }
    loadUserHistory();
}

function showAdminDashboard() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.classList.add('hidden');

    const userDashboard = document.getElementById('userDashboard');
    if (userDashboard) userDashboard.classList.add('hidden');

    const adminDashboard = document.getElementById('adminDashboard');
    if (adminDashboard) adminDashboard.classList.remove('hidden');
    
    loadAdminData();
}

// Authentication functions
async function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Input:', username, password);
    console.log('All users:', excelSystem.users);

    // Tìm user bất kỳ (admin hoặc thường)
    const user = excelSystem.users.find(u =>
        u.username === username &&
        u.password === password
    );

    if (user) {
        currentUser = user;
        isAdmin = !!user.isAdmin;
        // Lưu vào localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isAdmin', isAdmin ? '1' : '0');
        if (isAdmin) {
            showAdminDashboard();
        } else {
            showUserDashboard();
        }
        clearLoginForm();
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Input:', username, password);
    console.log('All users:', excelSystem.users);
    
    const user = excelSystem.users.find(u => u.username === username && u.password === password && u.isAdmin);
    
    if (user) {
        currentUser = user;
        isAdmin = true;
        showAdminDashboard();
        clearLoginForm();
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

function clearLoginForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function logout() {
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    // Clear forms
    document.getElementById('login').reset();
    document.getElementById('getNumberForm').reset();
    document.getElementById('addUserForm').reset();
    document.getElementById('updateNumberForm').reset();
    // Show login form
    showLoginForm();
    showSuccess('Đã đăng xuất thành công!');
    // Đảm bảo ẩn dashboard bằng style trực tiếp
    var adminDash = document.getElementById('adminDashboard');
    var userDash = document.getElementById('userDashboard');
    if (adminDash) adminDash.style.display = 'none';
    if (userDash) userDash.style.display = 'none';
}

// User functions
async function getNumber(e) {
    e.preventDefault();
    const content = document.getElementById('content').value.trim();
    if (!content) {
        alert('Vui lòng nhập nội dung lấy số!');
        return;
    }
    // Transaction Firestore để lấy số mới an toàn
    let numberToGive = 0;
    await db.runTransaction(async (transaction) => {
        const configRef = db.collection('config').doc('current');
        const configDoc = await transaction.get(configRef);
        let currentNumber = 100;
        if (configDoc.exists) {
            currentNumber = configDoc.data().currentNumber || 100;
        }
        numberToGive = currentNumber;
        // Tăng số tiếp theo
        transaction.set(configRef, { currentNumber: currentNumber + 1 });
        // Lưu lịch sử số
        const numbersRef = db.collection('numbers').doc(currentNumber.toString());
        transaction.set(numbersRef, {
            number: currentNumber,
            content: content,
            userName: currentUser.name,
            timestamp: new Date().toLocaleString('vi-VN'),
            dateTime: new Date().toISOString()
        });
    });
    // Sau khi transaction thành công, load lại dữ liệu và cập nhật giao diện
    await excelSystem.loadNumbers();
    await excelSystem.loadConfig();
    displayCurrentNumber({
        number: numberToGive,
        content: content,
        userName: currentUser.name,
        timestamp: new Date().toLocaleString('vi-VN'),
        dateTime: new Date().toISOString()
    });
    loadUserHistory();
    document.getElementById('content').value = '';
    alert(`Bạn đã lấy số: ${numberToGive}`);
}

function displayCurrentNumber(numberRecord) {
    const numberDisplay = document.getElementById('currentNumber');
    if (numberDisplay) {
        // Nếu là dashboard user: chỉ là <span id="currentNumber">
        if (numberDisplay.tagName === 'SPAN') {
            numberDisplay.textContent = numberRecord.number;
        } else {
            // Nếu là dashboard admin: có thể là div hoặc phần tử khác
            const numberSpan = numberDisplay.querySelector('.number');
            if (numberSpan) numberSpan.textContent = numberRecord.number;
        }
    }
    // Các phần tử chi tiết chỉ có ở dashboard admin
    const numberContent = document.getElementById('numberContent');
    if (numberContent) numberContent.textContent = numberRecord.content;
    const numberTime = document.getElementById('numberTime');
    if (numberTime) numberTime.textContent = numberRecord.timestamp;
    const numberInfo = document.getElementById('numberInfo');
    if (numberInfo) numberInfo.classList.remove('hidden');
}

function loadUserHistory() {
    if (!currentUser) return;
    const history = excelSystem.getUserHistory(currentUser.name);
    const historyContainer = document.getElementById('userHistory');
    if (!historyContainer) return;
    if (history.length === 0) {
        historyContainer.innerHTML = '<p class="no-data">Chưa có lịch sử lấy số</p>';
        return;
    }
    const historyHTML = history.map(record => `
        <div class="history-item">
            <div class="history-number">Số: ${record.number}</div>
            <div class="history-content">Nội dung: ${record.content}</div>
            <div class="history-time">Thời gian: ${record.timestamp}</div>
        </div>
    `).join('');
    historyContainer.innerHTML = historyHTML;
}

// Admin functions
function loadAdminData() {
    if (!isAdmin) return;
    // Cập nhật tên admin
    const adminName = document.getElementById('adminName');
    if (adminName && currentUser) adminName.textContent = `Admin: ${currentUser.name}`;
    // Load users list
    loadUsersList();
    // Load all number history
    loadAllNumberHistory();
}

async function updateCurrentNumber(e) {
    e.preventDefault();
    const newNumber = parseInt(document.getElementById('newNumber').value);
    if (newNumber < 1) {
        showError('Số phải lớn hơn 0!');
        return;
    }
    try {
        const success = await excelSystem.updateCurrentNumber(newNumber);
        await excelSystem.loadConfig();
        if (success) {
            updateCurrentNumberDisplay();
            updateAdminCurrentNumberDisplay();
            document.getElementById('newNumber').value = '';
            showSuccess(`Đã cập nhật số thành công! Số hiện tại: ${excelSystem.currentNumber}`);
        } else {
            showError('Không thể cập nhật số. Vui lòng thử lại!');
        }
    } catch (error) {
        console.error('Update number error:', error);
        showError('Lỗi khi cập nhật số. Vui lòng thử lại!');
    }
}

function showAddUserForm() {
    document.getElementById('addUserModal').classList.remove('hidden');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.add('hidden');
    document.getElementById('addUserForm').reset();
}

async function handleAddUser(e) {
    e.preventDefault();
    const name = document.getElementById('newUserName').value.trim();
    const username = document.getElementById('newUserUsername').value.trim();
    const password = document.getElementById('newUserPassword').value;
    if (!name || !username || !password) {
        alert('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    if (excelSystem.users.find(u => u.username === username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
    }
    const newUser = {
        name: name,
        username: username,
        password: password,
        isAdmin: false
    };
    await excelSystem.addUser(newUser);
    await excelSystem.loadUsers();
    loadUserList();
    closeAddUserModal();
}

function loadUserList() {
    const usersContainer = document.getElementById('usersList');
    if (!usersContainer) return;
    const regularUsers = excelSystem.users.filter(user => !user.isAdmin);
    if (regularUsers.length === 0) {
        usersContainer.innerHTML = '<p class="no-data">Chưa có người dùng nào</p>';
        return;
    }
    const usersHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Họ và tên</th>
                    <th>Tên đăng nhập</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                ${regularUsers.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.username}</td>
                        <td>
                            <button onclick="deleteUser('${user.username}')" class="btn btn-danger btn-sm">Xóa</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    usersContainer.innerHTML = usersHTML;
}

function deleteUser(username) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        excelSystem.users = excelSystem.users.filter(user => user.username !== username);
        saveUsers();
        loadUserList();
        alert('Đã xóa người dùng thành công!');
    }
}

function loadAllNumberHistory() {
    const historyContainer = document.getElementById('adminHistory');
    if (!historyContainer) return;
    if (excelSystem.numberHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-data">Chưa có lịch sử lấy số</p>';
        return;
    }
    const historyHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Số</th>
                    <th>Nội dung</th>
                    <th>Người lấy</th>
                    <th>Thời gian</th>
                </tr>
            </thead>
            <tbody>
                ${excelSystem.numberHistory.map(record => `
                    <tr>
                        <td>${record.number}</td>
                        <td>${record.content}</td>
                        <td>${record.userName}</td>
                        <td>${record.timestamp}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    historyContainer.innerHTML = historyHTML;
}

// Export functions
function exportUserData() {
    const regularUsers = excelSystem.users.filter(user => !user.isAdmin);
    
    if (regularUsers.length === 0) {
        alert('Không có dữ liệu người dùng để xuất!');
        return;
    }
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(regularUsers.map(user => ({
        'Họ và tên': user.name,
        'Tên đăng nhập': user.username,
        'Mật khẩu': user.password
    })));
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách người dùng');
    XLSX.writeFile(workbook, 'danh_sach_nguoi_dung.xlsx');
    
    alert('Đã xuất danh sách người dùng thành công!');
}

function exportNumberData() {
    if (numberHistory.length === 0) {
        alert('Không có dữ liệu lấy số để xuất!');
        return;
    }
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(numberHistory.map(record => ({
        'Số cần lấy': record.number,
        'Nội dung': record.content,
        'Ngày giờ lấy': record.timestamp,
        'Họ tên người lấy': record.userName
    })));
    
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách lấy số');
    XLSX.writeFile(workbook, 'danh_sach_lay_so.xlsx');
    
    alert('Đã xuất danh sách lấy số thành công!');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addUserModal');
    if (event.target === modal) {
        closeAddUserModal();
    }
}

// Update current number display
function updateCurrentNumberDisplay() {
    const currentNumberElement = document.getElementById('currentNumber');
    if (currentNumberElement) {
        currentNumberElement.textContent = excelSystem.currentNumber;
    }
}

// Update admin current number display
function updateAdminCurrentNumberDisplay() {
    const adminCurrentNumberElement = document.getElementById('adminCurrentNumber');
    if (adminCurrentNumberElement) {
        adminCurrentNumberElement.textContent = excelSystem.currentNumber;
    }
}

// Show success modal
function showSuccess(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
}

// Show error modal
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorModal').classList.remove('hidden');
}

// Close modal
function closeModal() {
    document.getElementById('successModal').classList.add('hidden');
    document.getElementById('errorModal').classList.add('hidden');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ gọi init và gắn event listener, không kiểm tra localStorage ở đây
    init();

    // Login form
    const loginForm = document.getElementById('login');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Nếu có form đăng nhập admin riêng, gắn sự kiện cho nó:
    const adminLoginForm = document.getElementById('adminLogin');
    if (adminLoginForm) adminLoginForm.addEventListener('submit', handleAdminLogin);

    // Get number form
    const getNumberForm = document.getElementById('getNumberForm');
    if (getNumberForm) getNumberForm.addEventListener('submit', getNumber);

    // Update number form (Admin)
    const updateNumberForm = document.getElementById('updateNumberForm');
    if (updateNumberForm) updateNumberForm.addEventListener('submit', updateCurrentNumber);

    // Add user form (Admin)
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) addUserForm.addEventListener('submit', handleAddUser);

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const successModal = document.getElementById('successModal');
        const errorModal = document.getElementById('errorModal');

        if (event.target === successModal) {
            successModal.classList.add('hidden');
        }
        if (event.target === errorModal) {
            errorModal.classList.add('hidden');
        }
    });
});

function checkLogin(username, password, isAdmin) {
    return excelSystem.users.find(u =>
        u.username === username &&
        u.password === password &&
        u.isAdmin === isAdmin
    );
}

// Add new user (Admin only)
async function addUser(event) {
    event.preventDefault();
    
    if (!isAdmin) {
        showError('Chỉ Admin mới có quyền thêm người dùng!');
        return;
    }
    
    const name = document.getElementById('newUserName').value.trim();
    const username = document.getElementById('newUserUsername').value.trim();
    const password = document.getElementById('newUserPassword').value;
    
    if (!name || !username || !password) {
        showError('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    
    // Check if username already exists
    const existingUser = excelSystem.users.find(user => user.username === username);
    if (existingUser) {
        showError('Tên đăng nhập đã tồn tại!');
        return;
    }
    
    try {
        const newUser = {
            name: name,
            username: username,
            password: password,
            isAdmin: false
        };
        
        const success = await excelSystem.addUser(newUser);
        
        if (success) {
            // Update admin data
            loadAdminData();
            // Clear form
            document.getElementById('addUserForm').reset();
            showSuccess(`Đã thêm người dùng thành công: ${name}`);
        } else {
            showError('Không thể thêm người dùng. Vui lòng thử lại!');
        }
    } catch (error) {
        console.error('Add user error:', error);
        showError('Lỗi khi thêm người dùng. Vui lòng thử lại!');
    }
}

// Load users list
function loadUsersList() {
    const usersContainer = document.getElementById('usersList');
    if (!usersContainer) return;
    const regularUsers = excelSystem.users.filter(user => !user.isAdmin);
    if (regularUsers.length === 0) {
        usersContainer.innerHTML = '<p class="no-data">Chưa có người dùng nào</p>';
        return;
    }
    const usersHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Họ và tên</th>
                    <th>Tên đăng nhập</th>
                    <th>Thao tác</th>
                </tr>
            </thead>
            <tbody>
                ${regularUsers.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.username}</td>
                        <td>
                            <button onclick="deleteUser('${user.username}')" class="btn btn-danger btn-sm">Xóa</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    usersContainer.innerHTML = usersHTML;
}


