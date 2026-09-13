/**
 * login.js
 * Handles login form validation and authentication logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, go straight to dashboard
    redirectIfAuth();

    const loginForm = document.getElementById('loginForm');
    const accountInput = document.getElementById('accountNumber');
    const pinInput = document.getElementById('pin');
    const accountError = document.getElementById('accountError');
    const pinError = document.getElementById('pinError');

    // Restrict inputs to numbers only
    const restrictToNumbers = (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
    };
    
    accountInput.addEventListener('input', restrictToNumbers);
    pinInput.addEventListener('input', restrictToNumbers);

    function showError(element, message) {
        element.textContent = message;
        element.classList.add('visible');
        // Remove animation class so it can trigger again on next failure
        setTimeout(() => element.classList.remove('visible'), 400);
        element.style.display = 'block';
    }

    function hideErrors() {
        accountError.style.display = 'none';
        pinError.style.display = 'none';
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideErrors();

        const accountVal = accountInput.value.trim();
        const pinVal = pinInput.value.trim();
        let isValid = true;

        if (accountVal.length < 10) {
            showError(accountError, 'Please enter a valid 10-digit account number.');
            isValid = false;
        }

        if (pinVal.length !== 4) {
            showError(pinError, 'Please enter your 4-digit PIN.');
            isValid = false;
        }

        if (!isValid) return;

        // Fetch users from local storage to validate
        const users = JSON.parse(localStorage.getItem('atm_users'));
        const user = users[accountVal];

        if (!user) {
            showError(accountError, 'Account not found. Please verify the account number.');
            return;
        }

        if (user.pin !== pinVal) {
            showError(pinError, 'Incorrect PIN. Please try again.');
            return;
        }

        // Login successful
        localStorage.setItem('atm_active_session', accountVal);
        window.location.href = 'dashboard.html';
    });
});
