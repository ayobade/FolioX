# FolioX - Crypto Portfolio Dashboard

A modern, responsive cryptocurrency portfolio management dashboard built with React and Firebase.

## 🚀 Features

### Portfolio Management
- **Multiple Portfolios**: Create and manage multiple crypto portfolios
- **Persistent Storage**: Firebase Firestore integration with local caching
- **Real-time Data**: Live cryptocurrency prices and market data
- **Transaction History**: Complete buy/sell/transfer transaction tracking

### Visual Analytics
- **Performance Charts**: Interactive charts showing portfolio value over time
- **Asset Allocation**: Visual pie charts showing portfolio distribution
- **Profit/Loss Tracking**: Real-time P&L calculations with percentage changes
- **Historical Data**: 90-day price history with hourly/daily granularity

### User Experience
- **Coin Search**: Live search functionality with CoinGecko API
- **Coin Logos**: Beautiful cryptocurrency logos throughout the interface
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Modern UI with professional styling

### Technical Features
- **Rate Limiting**: Optimized API calls with caching and throttling
- **Error Handling**: Graceful fallbacks and error recovery
- **Authentication**: Firebase Auth integration
- **Local Caching**: Fast loading with localStorage optimization

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Styled Components
- **Backend**: Firebase Firestore, Firebase Auth
- **APIs**: CoinGecko API for cryptocurrency data
- **Charts**: Recharts, Chart.js
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FolioX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_COINGECKO_API_KEY=your_coingecko_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── contexts/
│   ├── AuthContext.jsx      # Firebase authentication
│   ├── PortfolioContext.jsx # Portfolio and transaction management
│   └── PriceProvider.jsx    # Real-time price data and caching
├── pages/
│   ├── dashboard.jsx        # Main dashboard layout
│   ├── overview.jsx         # Portfolio overview and charts
│   ├── Sidebar.jsx          # Navigation and portfolio list
│   ├── AddCoinModal.jsx     # Add transaction modal
│   └── CreatePortfolioModal.jsx # Create new portfolio
├── utils/
│   └── storage.js           # Local storage utilities
└── firebase.js              # Firebase configuration
```

## 🔧 Key Components

### Portfolio Management
- **PortfolioContext**: Manages portfolios, transactions, and Firestore operations
- **PriceProvider**: Handles real-time price data with caching and rate limiting
- **AuthContext**: Firebase authentication state management

### UI Components
- **Overview**: Main dashboard with charts, stats, and asset tables
- **Sidebar**: Portfolio navigation with real-time values
- **AddCoinModal**: Transaction entry with coin search and historical prices
- **CreatePortfolioModal**: Portfolio creation with custom icons

## 📊 API Integration

### CoinGecko API
- **Real-time Prices**: `/simple/price` endpoint for current prices
- **Historical Data**: `/market_chart` endpoint for price history
- **Coin Search**: `/search` endpoint for finding cryptocurrencies
- **Coin Images**: Automatic logo fetching and display

### Firebase Firestore
- **Users**: `users/{userId}` collection
- **Portfolios**: `users/{userId}/portfolios/{portfolioId}`
- **Transactions**: `users/{userId}/portfolios/{portfolioId}/transactions/{transactionId}`

## 🎯 Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Create Portfolio**: Add your first portfolio with a custom name and icon
3. **Add Transactions**: Search for coins and add buy/sell/transfer transactions
4. **Track Performance**: View real-time portfolio value, P&L, and allocation
5. **Monitor Trends**: Analyze historical performance with interactive charts

## 🔒 Security

- **Environment Variables**: API keys stored securely in `.env`
- **Firebase Rules**: Proper Firestore security rules
- **User Isolation**: Each user's data is completely isolated
- **Rate Limiting**: API calls are throttled to prevent abuse

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel**: `npm run build` and deploy
- **Netlify**: Connect your GitHub repository
- **Firebase Hosting**: `firebase deploy`

