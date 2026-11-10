const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Currency formatter helper
 */
function formatCurrency(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * GET /api/info
 * Returns metadata and author information
 */
app.get('/api/info', (req, res) => {
  res.json({
    project: 'Cyber Simple Interest Calculator',
    version: '1.0.0',
    formula: 'SI = (P * R * T) / 100',
    description: 'A full-stack financial calculator with cyberpunk aesthetics, growth visualization, and real-time computation.',
    author: {
      name: 'Aqsa Aziz Wagan',
      rollNo: '2K23/CSM/21',
      institute: 'Institute of Mathematics and Computer Science (IMCS)',
      university: 'University of Sindh, Jamshoro',
    },
    status: 'online',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

/**
 * POST /api/calculate
 * Payload: { principal: number, rate: number, time: number, currency?: string }
 */
app.post('/api/calculate', (req, res) => {
  try {
    let { principal, rate, time, currency = 'USD' } = req.body;

    // Type coercion & sanitization
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    // Validation checks
    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input. Principal, rate, and time must be valid numbers.',
      });
    }

    if (p < 0 || r < 0 || t <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid values. Principal and rate must be >= 0, and time must be > 0.',
      });
    }

    if (p > 1e12 || r > 1000 || t > 100) {
      return res.status(400).json({
        success: false,
        error: 'Input values exceed maximum allowable simulation thresholds.',
      });
    }

    // Core Simple Interest Formula: SI = (P * R * T) / 100
    const simpleInterest = (p * r * t) / 100;
    const totalAmount = p + simpleInterest;
    const totalMonths = Math.max(1, Math.round(t * 12));
    const monthlyInterest = simpleInterest / totalMonths;
    const annualInterest = (p * r) / 100;

    // Yearly schedule breakdown
    const schedule = [];
    const fullYears = Math.ceil(t);

    for (let yr = 1; yr <= fullYears; yr++) {
      const timeInYears = yr > t ? t : yr;
      const interestEarnedTotal = (p * r * timeInYears) / 100;
      const prevTimeInYears = (yr - 1) > t ? t : (yr - 1);
      const prevInterestEarned = (p * r * prevTimeInYears) / 100;
      const interestForThisPeriod = interestEarnedTotal - prevInterestEarned;
      const endBalance = p + interestEarnedTotal;

      schedule.push({
        year: yr,
        periodLabel: yr > t ? `Year ${yr} (Final)` : `Year ${yr}`,
        interestEarnedPeriod: Number(interestForThisPeriod.toFixed(2)),
        cumulativeInterest: Number(interestEarnedTotal.toFixed(2)),
        balance: Number(endBalance.toFixed(2)),
        formattedBalance: formatCurrency(endBalance, currency),
        formattedInterest: formatCurrency(interestEarnedTotal, currency),
      });
    }

    // Percentage share
    const principalPercentage = totalAmount > 0 ? ((p / totalAmount) * 100).toFixed(1) : 100;
    const interestPercentage = totalAmount > 0 ? ((simpleInterest / totalAmount) * 100).toFixed(1) : 0;

    return res.json({
      success: true,
      data: {
        inputs: {
          principal: p,
          annualRatePercent: r,
          timeYears: t,
          currency: currency.toUpperCase(),
        },
        results: {
          simpleInterest: Number(simpleInterest.toFixed(2)),
          totalAmount: Number(totalAmount.toFixed(2)),
          annualInterest: Number(annualInterest.toFixed(2)),
          monthlyInterest: Number(monthlyInterest.toFixed(2)),
          principalPercentage: Number(principalPercentage),
          interestPercentage: Number(interestPercentage),
          formatted: {
            principal: formatCurrency(p, currency),
            simpleInterest: formatCurrency(simpleInterest, currency),
            totalAmount: formatCurrency(totalAmount, currency),
            monthlyInterest: formatCurrency(monthlyInterest, currency),
            annualInterest: formatCurrency(annualInterest, currency),
          },
        },
        schedule,
      },
    });
  } catch (err) {
    console.error('Calculation error:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected internal error occurred while processing calculation.',
    });
  }
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`[CYBER-SI] Server listening on http://localhost:${PORT}`);
});
