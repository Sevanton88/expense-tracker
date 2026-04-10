# Spend — iOS-Inspired Expense Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-5.0-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-3.0-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)

A sleek, modern expense tracking application inspired by iOS design principles. Built with vanilla JavaScript, this app provides an intuitive interface for managing personal finances, complete with interactive charts, category breakdowns, and persistent data storage.

## ✨ Features

- **📊 Interactive Charts**: Visualize your spending patterns over the last 7 days with a responsive bar chart powered by Chart.js.
- **🏷️ Category Management**: Organize transactions into predefined categories (Food, Transport, Shopping, Health, Entertainment, Income, Other) with color-coded icons.
- **💰 Financial Overview**: Real-time summary of total income, expenses, and net spending.
- **📱 Mobile-First Design**: Optimized for mobile devices with a clean, iOS-inspired UI featuring dark mode and smooth animations.
- **💾 Local Persistence**: All data is stored locally in the browser using LocalStorage — no accounts or servers required.
- **🔄 Real-Time Updates**: Instant rendering of changes as you add or remove transactions.
- **🎯 Smart Filtering**: Filter transactions by category to focus on specific spending areas.
- **🗑️ Easy Management**: Add, view, and delete transactions with a user-friendly bottom sheet modal.

## 🚀 Demo

Experience the app live: [Spend Expense Tracker Demo](https://your-github-username.github.io/spend-expense-tracker/) *(Replace with your actual GitHub Pages URL)*

### Screenshots

*(Add screenshots here after uploading to GitHub)*

- **Dashboard Overview**: Main screen showing balance, summary pills, and recent transactions.
- **Add Transaction Modal**: Bottom sheet for entering new expenses or income.
- **Category Breakdown**: Visual representation of spending by category.

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charting Library**: [Chart.js](https://www.chartjs.org/) (CDN)
- **Fonts**: [Google Fonts - DM Sans & DM Mono](https://fonts.google.com/)
- **Storage**: Browser LocalStorage API
- **Styling**: Custom CSS with CSS Variables for theming

## 📦 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies or build tools required

### Quick Start
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/spend-expense-tracker.git
   cd spend-expense-tracker
   ```

2. **Open the app**:
   - Open `index.html` in your web browser
   - Or serve it with a local server (optional):
     ```bash
     python -m http.server 8000
     ```
     Then navigate to `http://localhost:8000`

3. **Start tracking**:
   - Click the "+" button to add your first transaction
   - View your financial overview and charts instantly

## 📖 Usage

### Adding Transactions
1. Tap the "+" icon in the top-right corner
2. Fill in the transaction details:
   - **Description**: Brief note about the transaction
   - **Amount**: Dollar amount (supports decimals)
   - **Category**: Select from predefined categories
   - **Date**: Choose the transaction date
   - **Type**: Expense or Income
3. Tap "Add Transaction" to save

### Viewing Data
- **Dashboard**: See total spent, income, and expenses at a glance
- **Breakdown Chart**: Weekly spending visualization
- **Category Rings**: Proportional spending by category
- **Transaction List**: Chronological list of all transactions

### Managing Transactions
- **Filter**: Use category tabs to filter the transaction list
- **Delete**: Tap the "✕" button next to any transaction to remove it
- **Clear All**: Use the "Clear all" button to reset all data

## 🏗️ Project Structure

```
spend-expense-tracker/
├── index.html          # Main HTML structure
├── style.css           # CSS styles and themes
├── app.js              # Application logic and functionality
└── README.md           # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (ES6+ syntax, descriptive variable names)
- Test thoroughly across different browsers
- Ensure mobile responsiveness
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dušan** - *Web developer*

- GitHub: [@your-github-username](https://github.com/your-github-username)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

---

*Built with ❤️ using vanilla JavaScript. Inspired by iOS design for a seamless user experience.*