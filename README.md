# PayStash

**PayStash** is a secure, offline-capable digital wallet designed entirely with a strict glassmorphism and matrix-inspired dark-mode aesthetic. It allows users to securely stash funds, seamlessly send and receive money even without an active internet connection through encrypted QR codes, and manages user identity verification with high-fidelity UI constraints.

This mobile and web-compatible React Native application features complete wallet flows including:
- KYC Identity Verification 
- Stashing (Add Funds) via simulated Mock API interactions
- Withdrawals and internal secure peer transfers
- Offline Encrypted Transaction Generation via expiring QR Codes

### Backend Integration
PayStash relies on the Enyata Hackathon Pure Backend. 
- **Production Render URL**: [https://paystash-enyata-hackathon-pure-backend.onrender.com/](https://paystash-enyata-hackathon-pure-backend.onrender.com/)
- **Backend Repository**: [https://github.com/adelukapelumi/PAYSTASH-ENYATA-HACKATHON-PURE-BACKEND](https://github.com/adelukapelumi/PAYSTASH-ENYATA-HACKATHON-PURE-BACKEND)

### Features Implemented
- Completely overhauled dark mode UI (`#000000` & `#121212`)
- Multi-step Registration Wizard with progress tracking
- Instant Admin Bypass mode
- AES-256 encrypted SQLite local vault operations
- 5-Minute strict Time-To-Live (TTL) on generated transaction QR Codes

---

> Built during the Enyata Hackathon with React Native Expo, NativeWind (Tailwind CSS), and Expo SQLite.
