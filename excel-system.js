// Firestore System for Number Management
class ExcelSystem {
    constructor() {
        this.usersCollection = 'users';
        this.numbersCollection = 'numbers';
        this.configCollection = 'config';
        this.users = [];
        this.numberHistory = [];
        this.currentNumber = 100;
    }

    // Load data from Firestore
    async loadData() {
        try {
            await this.loadUsers();
            await this.loadNumbers();
            await this.loadConfig();
            console.log('✅ Data loaded successfully from Firestore');
            return true;
        } catch (error) {
            console.error('❌ Error loading data:', error);
            // Fallback to default data
            if (this.users.length === 0) {
                this.users = [
                    {
                        name: 'Admin',
                        username: 'admin',
                        password: 'admin123',
                        isAdmin: true
                    }
                ];
            }
            return false;
        }
    }

    // Load users from Firestore
    async loadUsers() {
        try {
            const snapshot = await db.collection(this.usersCollection).get();
            this.users = snapshot.docs.map(doc => doc.data());
            console.log('Loaded users:', this.users);
        } catch (error) {
            console.error('Error loading users:', error);
            throw error;
        }
    }

    // Load numbers from Firestore
    async loadNumbers() {
        try {
            const snapshot = await db.collection(this.numbersCollection).orderBy('number').get();
            this.numberHistory = snapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error loading numbers:', error);
            throw error;
        }
    }

    // Load config from Firestore
    async loadConfig() {
        try {
            const doc = await db.collection(this.configCollection).doc('current').get();
            if (doc.exists) {
                this.currentNumber = doc.data().currentNumber || 100;
            }
        } catch (error) {
            console.error('Error loading config:', error);
            throw error;
        }
    }

    // Save users to Firestore
    async saveUsers() {
        try {
            const batch = db.batch();
            const usersRef = db.collection(this.usersCollection);
            // Xóa hết users cũ
            const snapshot = await usersRef.get();
            snapshot.forEach(doc => batch.delete(doc.ref));
            // Thêm lại users mới
            this.users.forEach(user => {
                const docRef = usersRef.doc(user.username);
                batch.set(docRef, user);
            });
            await batch.commit();
            console.log('✅ Users saved to Firestore');
            return true;
        } catch (error) {
            console.error('Error saving users:', error);
            return false;
        }
    }

    // Save numbers to Firestore
    async saveNumbers() {
        try {
            const batch = db.batch();
            const numbersRef = db.collection(this.numbersCollection);
            // Xóa hết numbers cũ
            const snapshot = await numbersRef.get();
            snapshot.forEach(doc => batch.delete(doc.ref));
            // Thêm lại numbers mới
            this.numberHistory.forEach(record => {
                const docRef = numbersRef.doc(record.number.toString());
                batch.set(docRef, record);
            });
            await batch.commit();
            console.log('✅ Numbers saved to Firestore');
            return true;
        } catch (error) {
            console.error('Error saving numbers:', error);
            return false;
        }
    }

    // Save config to Firestore
    async saveConfig() {
        try {
            console.log('[saveConfig] Lưu currentNumber lên Firestore:', this.currentNumber);
            await db.collection(this.configCollection).doc('current').set({ currentNumber: this.currentNumber });
            console.log('✅ Config saved to Firestore');
            return true;
        } catch (error) {
            console.error('[saveConfig] Error saving config:', error);
            return false;
        }
    }

    // Add new user
    async addUser(user) {
        this.users.push(user);
        return await this.saveUsers();
    }

    // Delete user
    async deleteUser(username) {
        this.users = this.users.filter(user => user.username !== username);
        return await this.saveUsers();
    }

    // Add new number record
    async addNumber(numberRecord) {
        this.numberHistory.push(numberRecord);
        this.currentNumber = numberRecord.number + 1;
        const savedNumbers = await this.saveNumbers();
        const savedConfig = await this.saveConfig();
        return savedNumbers && savedConfig;
    }

    // Update current number
    async updateCurrentNumber(newNumber) {
        console.log('[updateCurrentNumber] Gọi với newNumber:', newNumber);
        this.currentNumber = newNumber;
        const result = await this.saveConfig();
        console.log('[updateCurrentNumber] Kết quả saveConfig:', result);
        return result;
    }

    // Get user by credentials
    getUser(username, password) {
        username = (username || '').trim().toLowerCase();
        password = (password || '').trim();
        for (const user of this.users) {
            if (
                user.username.trim().toLowerCase() === username &&
                user.password.trim() === password
            ) {
                return user;
            }
        }
        return null;
    }

    // Get admin user
    getAdmin(username, password) {
        return this.users.find(user => 
            user.username === username && 
            user.password === password && 
            user.isAdmin
        );
    }

    // Get user history
    getUserHistory(userName) {
        return this.numberHistory.filter(record => record.userName === userName);
    }

    // Export data to Excel
    exportUserData() {
        const regularUsers = this.users.filter(user => !user.isAdmin);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(regularUsers.map(user => ({
            'Họ và tên': user.name,
            'Tên đăng nhập': user.username,
            'Mật khẩu': user.password
        })));
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách người dùng');
        XLSX.writeFile(workbook, 'danh_sach_nguoi_dung_export.xlsx');
        return true;
    }

    exportNumberData() {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(this.numberHistory.map(record => ({
            'Số cần lấy': record.number,
            'Nội dung': record.content,
            'Ngày giờ lấy': record.timestamp,
            'Họ tên người lấy': record.userName
        })));
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách lấy số');
        XLSX.writeFile(workbook, 'danh_sach_lay_so_export.xlsx');
        return true;
    }
}

// Global Excel system instance
const excelSystem = new ExcelSystem();

async function login(event) {
    console.log('Đã vào hàm login');
    event.preventDefault();
    // ...
    const user = excelSystem.getUser(username, password);
    // ...
} 