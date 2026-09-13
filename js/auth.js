/**
 * auth.js
 * Handles core session management, mock data initialization, and route protection.
 */

const DEMO_ACCOUNT = {
    accountNumber: "1234567890",
    pin: "1234",
    name: "Jude",
    balance: 25000.00
};

// Initialize mock database in localStorage if it doesn't exist
function initDatabase() {
    // Force update demo account for the new name changes
    const users = JSON.parse(localStorage.getItem('atm_users')) || {};
    users[DEMO_ACCOUNT.accountNumber] = DEMO_ACCOUNT;
    localStorage.setItem('atm_users', JSON.stringify(users));
    
    if (!localStorage.getItem('atm_transactions') || JSON.parse(localStorage.getItem('atm_transactions')).length === 0) {
        const dummyTxs = [
            { id: 'TXN10293', date: new Date(Date.now() - 86400000 * 1).toISOString(), description: 'Salary Credit', type: 'deposit', amount: 35000 },
            { id: 'TXN10294', date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Grocery Store', type: 'withdrawal', amount: 2500 },
            { id: 'TXN10295', date: new Date(Date.now() - 86400000 * 3).toISOString(), description: 'Electricity Bill', type: 'withdrawal', amount: 1200 },
            { id: 'TXN10296', date: new Date(Date.now() - 86400000 * 4).toISOString(), description: 'Transfer to Friend', type: 'transfer', amount: 5000 },
            { id: 'TXN10297', date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Cash Deposit', type: 'deposit', amount: 10000 }
        ];
        localStorage.setItem('atm_transactions', JSON.stringify(dummyTxs));
    }
}

// Check if user is logged in
function isAuthenticated() {
    return localStorage.getItem('atm_active_session') !== null;
}

// Protect routes that require login (e.g., dashboard, withdrawal)
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

// Redirect away from login if already authenticated
function redirectIfAuth() {
    if (isAuthenticated()) {
        window.location.href = 'dashboard.html';
    }
}

// Get current active user details
function getActiveUser() {
    const sessionAcc = localStorage.getItem('atm_active_session');
    if (!sessionAcc) return null;
    
    const users = JSON.parse(localStorage.getItem('atm_users'));
    return users[sessionAcc];
}

// Update user in database
function updateUser(user) {
    const users = JSON.parse(localStorage.getItem('atm_users'));
    users[user.accountNumber] = user;
    localStorage.setItem('atm_users', JSON.stringify(users));
}

// Logout functionality
function logout() {
    localStorage.removeItem('atm_active_session');
    window.location.href = 'index.html';
}

// Run initialization on every page load
initDatabase();
