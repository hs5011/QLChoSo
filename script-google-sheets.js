// Configuration - Thay đổi URL này sau khi setup Google Sheets
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycby7WMjgyEu-usvZn-knJGJHWMGp9uh0M_nwmRCCrOJmAiQzFlRTPq-KMg4oaSb05J4H/exec';

// Global variables
let currentUser = null;
let isAdmin = false;
let currentNumber = 100;
let users = [];
let numberHistory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showLoginForm();
    loadDataFromGoogleSheets();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('login').addEventListener('submit', handleUserLogin);
    document.getElementById('adminLogin').addEventListener('submit', handleAdminLogin);
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
}

// Google Sheets API functions
async function callGoogleSheetsAPI(action, data = {}) {
    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: action,
                ...data
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.status === 'error') {
            throw new Error(result.message);
        }

        return result;
    } catch (error) {
        console.error('Google Sheets API Error:', error);
        throw error;
    }
}

// Data management functions
async function loadDataFromGoogleSheets() {
    const connectionStatus = document.getElementById('connectionStatus');
    
    try {
        connectionStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang kết nối với Google Sheets...';
        connectionStatus.className = 'connection-status';
        
        // Load users
        const usersResult = await callGoogleSheetsAPI('getUsers');
        users = usersResult.data || [];

        // Load number history
        const numbersResult = await callGoogleSheetsAPI('getNumbers');
        numberHistory = numbersResult.data || [];

        // Load config
        const configResult = await callGoogleSheetsAPI('getConfig');
        currentNumber = configResult.data.currentNumber || 100;

        // Update connection status
        connectionStatus.innerHTML = '<i class="fas fa-check-circle"></i> Đã kết nối với Google Sheets';
        connectionStatus.className = 'connection-status connected';
        
        console.log('Data loaded successfully from Google Sheets');
    } catch (error) {
        console.error('Failed to load data from Google Sheets:', error);
        
        // Update connection status
        connectionStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Không thể kết nối với Google Sheets. Vui lòng kiểm tra cấu hình.';
        connectionStatus.className = 'connection-status error';
        
        // Fallback to default data
        if (users.length === 0) {
            users = [
                {
                    name: 'Admin',
                    username: 'admin',
                    password: 'admin123',
                    isAdmin: true
                }
            ];
        }
    }
}

async function saveUserToGoogleSheets(user) {
    try {
        await callGoogleSheetsAPI('addUser', { user });
        return true;
    } catch (error) {
        console.error('Failed to save user:', error);
        return false;
    }
}

async function deleteUserFromGoogleSheets(username) {
    try {
        await callGoogleSheetsAPI('deleteUser', { username });
        return true;
    } catch (error) {
        console.error('Failed to delete user:', error);
        return false;
    }
}

async function saveNumberToGoogleSheets(numberRecord) {
    try {
        await callGoogleSheetsAPI('addNumber', { number: numberRecord });
        return true;
    } catch (error) {
        console.error('Failed to save number:', error);
        return false;
    }
}

async function updateConfigInGoogleSheets() {
    try {
        await callGoogleSheetsAPI('updateConfig', { 
            config: { currentNumber: currentNumber } 
        });
        return true;
    } catch (error) {
        console.error('Failed to update config:', error);
        return false;
    }
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
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('userDashboard').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
    
    document.getElementById('userDisplayName').textContent = currentUser.name;
    loadUserHistory();
}

function showAdminDashboard() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('adminLoginForm').classList.add('hidden');
    document.getElementById('userDashboard').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
    
    loadAdminData();
}

// Authentication functions
function handleUserLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password && !u.isAdmin);
    
    if (user) {
        currentUser = user;
        isAdmin = false;
        showUserDashboard();
        clearLoginForm();
    } else {
        alert('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
}

function handleAdminLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    const admin = users.find(u => u.username === username && u.password === password && u.isAdmin);
    
    if (admin) {
        currentUser = admin;
        isAdmin = true;
        showAdminDashboard();
        clearAdminLoginForm();
    } else {
        alert('Thông tin đăng nhập admin không đúng!');
    }
}

function clearLoginForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

function clearAdminLoginForm() {
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
}

function logout() {
    currentUser = null;
    isAdmin = false;
    showLoginForm();
}

// User functions
async function getNumber() {
    const content = document.getElementById('content').value.trim();
    
    if (!content) {
        alert('Vui lòng nhập nội dung lấy số!');
        return;
    }
    
    // Get current number and increment
    const numberToGive = currentNumber;
    currentNumber++;
    
    // Save the number record
    const numberRecord = {
        number: numberToGive,
        content: content,
        userName: currentUser.name,
        timestamp: new Date().toLocaleString('vi-VN'),
        dateTime: new Date().toISOString()
    };
    
    // Save to Google Sheets
    const saved = await saveNumberToGoogleSheets(numberRecord);
    if (!saved) {
        alert('Lỗi khi lưu số. Vui lòng thử lại!');
        return;
    }
    
    // Update local data
    numberHistory.push(numberRecord);
    
    // Update config in Google Sheets
    await updateConfigInGoogleSheets();
    
    // Update UI
    displayCurrentNumber(numberRecord);
    loadUserHistory();
    
    // Clear form
    document.getElementById('content').value = '';
    
    alert(`Bạn đã lấy số: ${numberToGive}`);
}

function displayCurrentNumber(numberRecord) {
    const numberDisplay = document.getElementById('currentNumber');
    const numberInfo = document.getElementById('numberInfo');
    
    numberDisplay.querySelector('.number').textContent = numberRecord.number;
    document.getElementById('numberContent').textContent = numberRecord.content;
    document.getElementById('numberTime').textContent = numberRecord.timestamp;
    
    numberInfo.classList.remove('hidden');
}

function loadUserHistory() {
    const historyContainer = document.getElementById('numberHistory');
    const userHistory = numberHistory.filter(record => record.userName === currentUser.name);
    
    historyContainer.innerHTML = '';
    
    if (userHistory.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: #666;">Chưa có lịch sử lấy số</p>';
        return;
    }
    
    userHistory.reverse().forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="number">${record.number}</div>
            <div class="info">
                <div class="content">${record.content}</div>
                <div class="time">${record.timestamp}</div>
            </div>
        `;
        historyContainer.appendChild(historyItem);
    });
}

// Admin functions
function loadAdminData() {
    // Load current number configuration
    document.getElementById('currentConfigNumber').textContent = currentNumber;
    document.getElementById('startNumber').value = currentNumber;
    
    // Load user list
    loadUserList();
    
    // Load all number history
    loadAllNumberHistory();
}

async function updateStartNumber() {
    const startNumberInput = document.getElementById('startNumber');
    const newNumber = parseInt(startNumberInput.value);
    
    if (isNaN(newNumber) || newNumber < 1) {
        alert('Vui lòng nhập số hợp lệ (lớn hơn 0)!');
        startNumberInput.focus();
        return;
    }
    
    currentNumber = newNumber;
    
    // Update in Google Sheets
    const updated = await updateConfigInGoogleSheets();
    if (!updated) {
        alert('Lỗi khi cập nhật cấu hình. Vui lòng thử lại!');
        return;
    }
    
    document.getElementById('currentConfigNumber').textContent = currentNumber;
    
    // Clear the input after successful update
    startNumberInput.value = '';
    
    alert(`Đã cập nhật số bắt đầu thành công! Số hiện tại: ${currentNumber}`);
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
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return;
    }
    
    // Add new user
    const newUser = {
        name: name,
        username: username,
        password: password,
        isAdmin: false
    };
    
    // Save to Google Sheets
    const saved = await saveUserToGoogleSheets(newUser);
    if (!saved) {
        alert('Lỗi khi thêm người dùng. Vui lòng thử lại!');
        return;
    }
    
    // Update local data
    users.push(newUser);
    loadUserList();
    closeAddUserModal();
    
    alert('Đã thêm người dùng thành công!');
}

function loadUserList() {
    const userList = document.getElementById('userList');
    const regularUsers = users.filter(user => !user.isAdmin);
    
    userList.innerHTML = '';
    
    if (regularUsers.length === 0) {
        userList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Chưa có người dùng nào</p>';
        return;
    }
    
    regularUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.innerHTML = `
            <div class="user-info">
                <div class="name">${user.name}</div>
                <div class="username">${user.username}</div>
            </div>
            <button onclick="deleteUser('${user.username}')" class="btn-secondary" style="background: #dc3545;">
                <i class="fas fa-trash"></i> Xóa
            </button>
        `;
        userList.appendChild(userItem);
    });
}

async function deleteUser(username) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        // Delete from Google Sheets
        const deleted = await deleteUserFromGoogleSheets(username);
        if (!deleted) {
            alert('Lỗi khi xóa người dùng. Vui lòng thử lại!');
            return;
        }
        
        // Update local data
        users = users.filter(user => user.username !== username);
        loadUserList();
        alert('Đã xóa người dùng thành công!');
    }
}

function loadAllNumberHistory() {
    const historyContainer = document.getElementById('allNumberHistory');
    
    historyContainer.innerHTML = '';
    
    if (numberHistory.length === 0) {
        historyContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Chưa có lịch sử lấy số</p>';
        return;
    }
    
    numberHistory.reverse().forEach(record => {
        const historyItem = document.createElement('div');
        historyItem.className = 'number-item';
        historyItem.innerHTML = `
            <div class="number">${record.number}</div>
            <div class="details">
                <div class="content">${record.content}</div>
                <div class="user-time">${record.userName} - ${record.timestamp}</div>
            </div>
        `;
        historyContainer.appendChild(historyItem);
    });
}

// Export functions
function exportUserData() {
    const regularUsers = users.filter(user => !user.isAdmin);
    
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

// Refresh data function
async function refreshData() {
    try {
        await loadDataFromGoogleSheets();
        
        if (isAdmin) {
            loadAdminData();
        } else if (currentUser) {
            loadUserHistory();
        }
        
        alert('Đã làm mới dữ liệu thành công!');
    } catch (error) {
        alert('Lỗi khi làm mới dữ liệu: ' + error.message);
    }
} 