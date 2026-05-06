<div align="center">
  <img src="./public/logo.png" alt="RTDB Inspector Logo" width="120" />

  # 🔍 RTDB Inspector

  <p align="center">
    <strong>A powerful, production-ready web tool to analyze, explore, and audit Firebase Realtime Databases.</strong>
  </p>

  <p align="center">
    <a href="http://rtdb-inspector.shapemysite.in/"><img src="https://img.shields.io/badge/Live_Demo-View_Now-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo" /></a>
  </p>

  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
  </p>
</div>

---

## ⚡ Overview

**RTDB Inspector** is a developer tool designed to help you quickly assess the security posture of any Firebase Realtime Database. Simply paste a Firebase URL, and the inspector will safely probe the database's read, write, update, and delete permissions. If the database is accessible, you can seamlessly explore the data using an optimized, interactive JSON tree viewer.

## ✨ Key Features

- 🛡️ **Security Analyzer**: Non-destructive testing of database permissions (Read, Write, Delete, Patch) and visibility of security rules.
- 🌳 **Interactive Data Explorer**: A powerful JSON tree viewer tailored for large datasets.
- 🚀 **High Performance**: Built-in pagination ("Load More") and intelligent key-filtering prevents browser freezes when dealing with massive databases.
- 💾 **Instant Exports**: One-click download of the complete database JSON structure.
- 🕒 **Smart History**: Automatically saves your recently analyzed database URLs via `localStorage` for lightning-fast re-access.
- 📱 **Fully Responsive**: A modern, sleek UI that looks and works great on both desktop and mobile devices.

## 🚀 Getting Started

First, clone the repository and install the dependencies:

```bash
git clone https://github.com/iamjaved026/rtdb-inspector.git
cd rtdb-inspector
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to launch the inspector.

## ⚠️ Disclaimer

> Use this tool responsibly. RTDB Inspector is intended for auditing your own databases or those you have explicit permission to test. Do not use this tool to exploit or maliciously interact with third-party databases.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/iamjaved026/rtdb-inspector/issues).

## 👨‍💻 Author

**Javed Hussain**
- GitHub: [@iamjaved026](https://github.com/iamjaved026)

---
<div align="center">
  Made with ❤️ By Javed Hussain
</div>
