# PayStash

**PayStash** is a secure, offline-capable digital wallet designed entirely with a strict glassmorphism and matrix-inspired dark-mode aesthetic (`#000000` & `#121212`). Built during the Enyata Hackathon, it aims to solve the problem of unreliable internet connectivity during financial transactions by allowing users to securely stash funds, and seamlessly send and receive money even without an active internet connection through encrypted, time-sensitive QR codes.

### 🔗 Backend Integration
PayStash relies on the Enyata Hackathon Pure Backend for online synchronizations.
- **Production Render URL**: [https://paystash-enyata-hackathon-pure-backend.onrender.com/](https://paystash-enyata-hackathon-pure-backend.onrender.com/)
- **Backend Repository**: [https://github.com/adelukapelumi/PAYSTASH-ENYATA-HACKATHON-PURE-BACKEND](https://github.com/adelukapelumi/PAYSTASH-ENYATA-HACKATHON-PURE-BACKEND)

---

## 🚀 Features & Project Scope
- **KYC Identity Verification**: A multi-step Registration Wizard with progress tracking, requiring BVN and NIN validation.
- **Wallet Operations**: Stashing (Add Funds) via simulated API interactions, and Withdrawals mimicking internal secure peer transfers.
- **Offline Encrypted Transactions**: Generation of expiring QR Codes with a strict 5-Minute Time-To-Live (TTL).
- **Instant Admin Bypass**: A hidden "ADMIN PASS" mode for quick presentation and testing without registration.
- **High-Fidelity Dashboard**: A completely overhauled dark mode UI featuring a Wallet Balance Card, quick actions (Savings, Withdraw, Deposit), and a real-time transaction history with red/green arrows.

## 🛠️ Tech Stack
- **Framework**: React Native with Expo (Cross-platform compatibility for iOS, Android, and Web)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Local Database**: Expo SQLite for persistent, offline-first wallet balances
- **Routing**: Custom React State-based Stack Navigator
- **Cryptography**: Expo Crypto (SHA-256 Hashing) & `react-native-qrcode-svg` for secure payload generation

## 📁 Code Overview
The codebase follows a modular, feature-first structure:
- `src/ui/screens/` — Contains all the high-fidelity UI constraints. Key screens include `DashboardScreen`, `GeneratedQRScreen` (with its standalone TTL timer), and the `SignUp`/`SignIn` wizard flow.
- `src/database/` — The `DatabaseService.ts` and `VaultDAO.ts` handle the SQLite tables. All balance modifications are performed here using AES-inspired integrity hashes to prevent tampering.
- `src/api/` — `mockApi.ts` perfectly simulates network latency, async verifications, and external REST API payloads (specifically for top-ups, KYC verifications, and withdrawals).
- `src/context/` — The global `AppContext.tsx` propagates the local wallet balance, authentication status, and offline synchronization states across all screens automatically.
- `App.tsx` — The main entry point, injecting the global React Context providers and housing the custom `RootNavigator` to manage transitions between authenticated and unauthenticated states.
