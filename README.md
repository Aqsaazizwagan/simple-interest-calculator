# Cyber Simple Interest Calculator ⚡

![Version](https://img.shields.io/badge/version-1.0.0-00ff88.svg?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-00f0ff.svg?style=for-the-badge)
![Stack](https://img.shields.io/badge/stack-Node.js%20%7C%20Express%20%7C%20TailwindCSS%20%7C%20Chart.js-8b00ff.svg?style=for-the-badge)
![Course](https://img.shields.io/badge/IBM-Git%20%26%20GitHub%20Final%20Project-ff007f.svg?style=for-the-badge)

A futuristic, full-stack Simple Interest Calculator web application engineered with a **cyberpunk/matrix dark-mode theme**, glassmorphism aesthetics, dynamic **Chart.js financial growth analytics**, and a robust **Node.js/Express REST API** backend.

---

## 📌 Project Overview

This repository provides both an **interactive full-stack web application** and a **standalone Bash shell script (`simple-interest.sh`)** for calculating simple interest, designed for the IBM Git & GitHub course final evaluation.

### ✨ Key Features
- **Matrix & Cyberpunk Aesthetic**: Real-time Matrix digital rain canvas, custom glowing range sliders, and glassmorphism panels.
- **Dynamic Real-Time Calculation**: Seamless two-way synchronized inputs with instant reactivity as you slide or type.
- **Financial Growth Analytics**: Interactive Chart.js visualizations featuring both cumulative growth curves (with neon gradient fills) and an asset allocation doughnut chart.
- **Multi-Currency Support**: Switch effortlessly between USD (`$`), PKR (`₨`), EUR (`€`), GBP (`£`), and INR (`₹`).
- **Yearly Amortization Schedule**: Complete breakdown of annual interest accrued, cumulative interest, and ending balances with **one-click CSV Export** and print capabilities.
- **Dual-Mode Computation**: Powered by an Express.js REST API with automatic client-side fallback if the network is interrupted.
- **Bash CLI Companion**: Includes a POSIX-compliant `simple-interest.sh` script matching academic submission requirements.

---

## 📐 Mathematical Formulation

Simple interest is calculated using the standard financial formula:

$$\text{Simple Interest (SI)} = \frac{P \times R \times T}{100}$$

Where:
- **$P$** = Principal initial amount (the capital invested or borrowed)
- **$R$** = Annual nominal interest rate (in percentage)
- **$T$** = Time horizon / period (in years)

### Total Maturity Value ($A$):
$$A = P + \text{SI}$$

### Monthly Yield ($M$):
$$M = \frac{\text{SI}}{T \times 12}$$

---

## 🛠️ Tech Stack

- **Frontend**:
  - HTML5 & CSS3 with custom Cyberpunk animations & scanlines
  - [Tailwind CSS](https://tailwindcss.com/) (Modern utility-first styling)
  - [Chart.js](https://www.chartjs.org/) (Interactive data visualizations)
  - [Lucide Icons](https://lucide.dev/) (Futuristic vector iconography)
  - Web Audio API (Synthetic micro-interaction sound cues)
- **Backend**:
  - [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) (REST API)
  - [CORS](https://www.npmjs.com/package/cors) (Cross-Origin Resource Sharing)
- **Shell**:
  - Bash (`bc` / `awk` compatible)

---

## 📁 Repository Structure

```text
simple-interest-calculator/
├── public/
│   ├── index.html        # Main Cyberpunk glassmorphism web interface
│   ├── style.css         # Custom animations, matrix grid & cyber sliders
│   └── app.js            # Frontend logic, Chart.js engine & matrix canvas
├── server.js             # Node.js/Express backend REST API server
├── simple-interest.sh    # Standalone Bash shell script (IBM assignment)
├── package.json          # Node project metadata and dependencies
├── .gitignore            # Git ignore specification
└── README.md             # Comprehensive project documentation
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [Git](https://git-scm.com/)
- Bash shell (Linux, macOS, or Git Bash / WSL on Windows)

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/simple-interest-calculator.git
cd simple-interest-calculator
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch the Application
```bash
npm start
```
The application will launch at:
👉 **`http://localhost:3000`**

---

## 📡 REST API Documentation

### `POST /api/calculate`
Calculates simple interest, maturity totals, and generates a yearly accrual schedule.

#### Request Body
```json
{
  "principal": 10000,
  "rate": 7.5,
  "time": 5,
  "currency": "USD"
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "inputs": {
      "principal": 10000,
      "annualRatePercent": 7.5,
      "timeYears": 5,
      "currency": "USD"
    },
    "results": {
      "simpleInterest": 3750,
      "totalAmount": 13750,
      "annualInterest": 750,
      "monthlyInterest": 62.5,
      "principalPercentage": 72.7,
      "interestPercentage": 27.3,
      "formatted": {
        "principal": "$10,000.00",
        "simpleInterest": "$3,750.00",
        "totalAmount": "$13,750.00",
        "monthlyInterest": "$62.50",
        "annualInterest": "$750.00"
      }
    },
    "schedule": [
      {
        "year": 1,
        "periodLabel": "Year 1",
        "interestEarnedPeriod": 750,
        "cumulativeInterest": 750,
        "balance": 10750,
        "formattedBalance": "$10,750.00",
        "formattedInterest": "$750.00"
      }
    ]
  }
}
```

---

## 💻 Running the Bash Shell Script

To run the standalone command-line script:

```bash
chmod +x simple-interest.sh
./simple-interest.sh
```

**Interactive Example:**
```text
==========================================================
         CYBER SIMPLE INTEREST CALCULATOR (BASH CLI)      
         Author: Aqsa Aziz Wagan (2K23/CSM/21)            
==========================================================
Enter principal amount (p): 10000
Enter annual rate of interest in % (r): 7.5
Enter time period in years (t): 5
----------------------------------------------------------
RESULTS SUMMARY:
Principal Amount (p) : 10000
Annual Interest Rate : 7.5%
Time Horizon (years) : 5
Simple Interest (SI) : 3750.00
Total Maturity Value : 13750.00
==========================================================
```

---

## 👩‍💻 Author Information

| Field | Details |
|---|---|
| **Author** | **Aqsa Aziz Wagan** |
| **Roll Number** | **2K23/CSM/21** |
| **Institute** | Institute of Mathematics & Computer Science (IMCS) |
| **University** | University of Sindh, Jamshoro |
| **Program** | BS Computer Science |
| **Course** | IBM Getting Started with Git and GitHub Final Project |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
