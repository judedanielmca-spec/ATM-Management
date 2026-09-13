# State Bank of India (SBI) - ATM Management System Frontend

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

A premium, interactive frontend simulation of an ATM Management System. Built with **Vanilla HTML, CSS, and JavaScript**, this project features a modern State Bank of India (SBI) theme, glassmorphism UI, interactive transactions, and data visualization.

## ✨ Features

- **Secure Login Simulation:** Validates 10-digit account numbers and 4-digit PINs.
- **Interactive Dashboard:** Dynamic date/time, masked account numbers, and quick-action grid.
- **Core Banking Operations:**
  - Cash Withdrawals & Deposits (with balance validation)
  - Fund Transfers
  - Balance Enquiry
  - PIN Change
- **Transaction Analytics:** Visual breakdown of Income (Deposits) vs. Expenses (Withdrawals/Transfers) using **Chart.js**.
- **Mini Statement:** Tabular history of recent transactions with unique IDs.
- **State Management:** Fully functional local persistence using browser `localStorage` (refresh without losing data).
- **Premium UI/UX:** Responsive design, animated backgrounds, custom toast notifications, and modern glassmorphism aesthetics.

## 🚀 Getting Started

This is a pure frontend project. No build tools or bundlers are required!

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atm-management-system.git
   ```
2. **Run the project**
   - Simply open `index.html` in any modern web browser.
   - Alternatively, serve it locally using any static server (e.g., `npx serve`).

## 🔐 Demo Credentials

Use the following credentials to access the simulation:

- **Account Number:** `1234567890`
- **PIN:** `1234`

## 📂 Folder Structure

```
├── assets/         # (Optional) Icons and images
├── css/            
│   └── style.css   # Premium SBI Theme & Layouts
├── js/             
│   ├── auth.js         # Session and localStorage management
│   ├── login.js        # Login validation logic
│   ├── dashboard.js    # Dashboard UI interactions
│   └── transactions.js # Logic for deposits, withdrawals, transfers, and charts
├── index.html      # Login Page
├── dashboard.html  # Main Menu
├── balance.html
├── withdrawal.html
├── deposit.html
├── transfer.html
├── statement.html
├── analysis.html   # Chart.js Analytics
└── change-pin.html
```

## ⚠️ Disclaimer
This is an educational frontend simulation project. It is **not** connected to any real banking APIs, backend databases, or financial services. All data is mocked and stored locally in your browser.
