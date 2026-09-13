/**
 * transactions.js
 * Handles logic for all transaction pages (withdraw, deposit, transfer, statement, pin change)
 */

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    const user = getActiveUser();
    if (!user) return;

    // Toast Utility
    const toast = document.getElementById('toast');
    function showToast(message, type = 'success') {
        if (!toast) return;
        toast.textContent = message;
        toast.className = `show ${type}`;
        setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
    }

    // Helper: format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }

    // Helper: add transaction record
    const addTransaction = (desc, type, amount) => {
        const txs = JSON.parse(localStorage.getItem('atm_transactions') || '[]');
        const newTx = {
            id: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toISOString(),
            description: desc,
            type: type,
            amount: amount
        };
        txs.unshift(newTx); // Add to beginning
        localStorage.setItem('atm_transactions', JSON.stringify(txs));
    }

    // --- BALANCE PAGE ---
    const balanceDisplay = document.getElementById('balanceDisplay');
    if (balanceDisplay) {
        balanceDisplay.textContent = formatCurrency(user.balance);
    }

    // --- WITHDRAWAL PAGE ---
    const withdrawalForm = document.getElementById('withdrawalForm');
    if (withdrawalForm) {
        const amountInput = document.getElementById('amount');
        const quickBtns = document.querySelectorAll('.quick-btn');

        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                amountInput.value = btn.dataset.amount;
            });
        });

        withdrawalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(amountInput.value);
            
            if (isNaN(amount) || amount <= 0 || amount % 100 !== 0) {
                showToast('Please enter a valid multiple of 100.', 'error');
                return;
            }

            if (amount > user.balance) {
                showToast('Insufficient funds.', 'error');
                return;
            }

            if (confirm(`Are you sure you want to withdraw ${formatCurrency(amount)}?`)) {
                user.balance -= amount;
                updateUser(user);
                addTransaction('Cash Withdrawal', 'withdrawal', amount);
                showToast('Withdrawal Successful!', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
            }
        });
    }

    // --- DEPOSIT PAGE ---
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        const depositAmountInput = document.getElementById('depositAmount');

        depositForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const amount = parseFloat(depositAmountInput.value);
            
            if (isNaN(amount) || amount <= 0 || amount % 100 !== 0) {
                showToast('Please enter a valid multiple of 100.', 'error');
                return;
            }

            user.balance += amount;
            updateUser(user);
            addTransaction('Cash Deposit', 'deposit', amount);
            showToast('Deposit Successful!', 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
        });
    }

    // --- TRANSFER PAGE ---
    const transferForm = document.getElementById('transferForm');
    if (transferForm) {
        const transferAcct = document.getElementById('transferAccount');
        const transferAmt = document.getElementById('transferAmount');

        transferForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const account = transferAcct.value.trim();
            const amount = parseFloat(transferAmt.value);

            if (account.length < 10) {
                showToast('Please enter a valid 10-digit beneficiary account.', 'error');
                return;
            }

            if (account === user.accountNumber) {
                showToast('Cannot transfer to the same account.', 'error');
                return;
            }

            if (isNaN(amount) || amount <= 0) {
                showToast('Please enter a valid amount.', 'error');
                return;
            }

            if (amount > user.balance) {
                showToast('Insufficient funds for transfer.', 'error');
                return;
            }

            if (confirm(`Transfer ${formatCurrency(amount)} to account ${account}?`)) {
                user.balance -= amount;
                updateUser(user);
                addTransaction(`Transfer to ${account}`, 'transfer', amount);
                showToast('Transfer Successful!', 'success');
                setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
            }
        });
    }

    // --- STATEMENT PAGE ---
    const statementTableBody = document.getElementById('statementBody');
    if (statementTableBody) {
        const txs = JSON.parse(localStorage.getItem('atm_transactions') || '[]');
        if (txs.length === 0) {
            statementTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No recent transactions.</td></tr>`;
        } else {
            txs.slice(0, 10).forEach(tx => {
                const dateObj = new Date(tx.date);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td>${tx.description}<br><small style="color:var(--text-muted);font-size:0.7rem;">ID: ${tx.id}</small></td>
                    <td style="text-transform: capitalize;" class="type-${tx.type}">${tx.type}</td>
                    <td class="type-${tx.type}">${tx.type === 'deposit' ? '+' : '-'}${formatCurrency(tx.amount)}</td>
                `;
                statementTableBody.appendChild(row);
            });
        }
    }

    // --- CHANGE PIN PAGE ---
    const pinForm = document.getElementById('pinForm');
    if (pinForm) {
        const currentPin = document.getElementById('currentPin');
        const newPin = document.getElementById('newPin');
        const confirmPin = document.getElementById('confirmPin');

        pinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currVal = currentPin.value.trim();
            const newVal = newPin.value.trim();
            const confVal = confirmPin.value.trim();

            if (currVal !== user.pin) {
                showToast('Current PIN is incorrect.', 'error');
                return;
            }

            if (newVal.length !== 4) {
                showToast('New PIN must be exactly 4 digits.', 'error');
                return;
            }

            if (newVal === currVal) {
                showToast('New PIN must be different from current PIN.', 'error');
                return;
            }

            if (newVal !== confVal) {
                showToast('New PINs do not match.', 'error');
                return;
            }

            user.pin = newVal;
            updateUser(user);
            showToast('PIN successfully changed!', 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
        });
    }

    // --- ANALYSIS PAGE ---
    const analyticsChartCanvas = document.getElementById('analyticsChart');
    if (analyticsChartCanvas) {
        const txs = JSON.parse(localStorage.getItem('atm_transactions') || '[]');
        
        let totalDeposits = 0;
        let totalSpent = 0;

        txs.forEach(tx => {
            if (tx.type === 'deposit') {
                totalDeposits += tx.amount;
            } else if (tx.type === 'withdrawal' || tx.type === 'transfer') {
                totalSpent += tx.amount;
            }
        });

        document.getElementById('totalDeposits').textContent = formatCurrency(totalDeposits);
        document.getElementById('totalSpent').textContent = formatCurrency(totalSpent);

        // Render Chart.js doughnut chart
        new Chart(analyticsChartCanvas, {
            type: 'doughnut',
            data: {
                labels: ['Deposits (Income)', 'Spent (Withdrawals/Transfers)'],
                datasets: [{
                    data: [totalDeposits, totalSpent],
                    backgroundColor: [
                        '#28c76f', // Success green
                        '#ff4d4f'  // Error red
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#a0c4e0', // text-muted
                            font: { family: 'Inter', size: 12 }
                        }
                    }
                }
            }
        });
    }

});
