/**
 * dashboard.js
 * Handles dashboard data rendering and formatting
 */

document.addEventListener('DOMContentLoaded', () => {
    // Protect route
    requireAuth();

    const user = getActiveUser();
    if (!user) return; // Failsafe

    // DOM Elements
    const userNameEl = document.getElementById('userName');
    const maskedAccountEl = document.getElementById('maskedAccount');
    const balanceEl = document.getElementById('displayBalance');
    const dateTimeEl = document.getElementById('dateTime');
    const logoutBtn = document.getElementById('logoutBtn');

    // Display user details
    userNameEl.textContent = `Welcome, ${user.name.split(' ')[0]}`;
    
    // Mask account number (show only last 4 digits)
    const accStr = user.accountNumber;
    maskedAccountEl.textContent = `XXXX-XXXX-${accStr.slice(-4)}`;

    // Format balance in INR
    balanceEl.textContent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(user.balance);

    // Update Date and Time dynamically
    function updateTime() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        };
        dateTimeEl.textContent = now.toLocaleDateString('en-IN', options);
    }
    
    updateTime();
    setInterval(updateTime, 60000); // update every minute

    // Logout Event
    logoutBtn.addEventListener('click', () => {
        logout();
    });
});
