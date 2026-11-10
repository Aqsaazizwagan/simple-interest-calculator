/**
 * CYBER-SI // Simple Interest Calculator
 * Frontend Logic, Matrix Rain Engine & Chart Analytics
 * Author: Aqsa Aziz Wagan (2K23/CSM/21) - IMCS, University of Sindh
 */

// Global State
const state = {
  principal: 10000,
  rate: 7.5,
  timeYears: 5,
  timeUnit: 'years', // 'years' or 'months'
  currency: 'USD',
  chartType: 'line', // 'line' or 'bar'
  soundEnabled: false,
};

// Currency symbols mapping
const currencySymbols = {
  USD: '$',
  PKR: '₨',
  EUR: '€',
  GBP: '£',
  INR: '₹',
};

// Chart instances
let growthChartInstance = null;
let ratioChartInstance = null;

// Synthetic Web Audio Synthesizer for cyber sound feedback
const audioCtx = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext))
  ? new (window.AudioContext || window.webkitAudioContext)()
  : null;

function playCyberChirp(frequency = 880, duration = 0.08) {
  if (!state.soundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioCtx.currentTime + duration);

    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.debug('Audio chirp error:', e);
  }
}

// Format currency helper
function formatMoney(amount, currency = state.currency) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    const sym = currencySymbols[currency] || '$';
    return `${sym}${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Matrix Digital Rain Background Animation
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$€£₹%+-*/=<>#';
  const fontSize = 14;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(6, 9, 14, 0.08)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 50);
}

// Initialize Charts
function initCharts() {
  const growthCtx = document.getElementById('growthChart')?.getContext('2d');
  const ratioCtx = document.getElementById('ratioChart')?.getContext('2d');

  if (growthCtx) {
    growthChartInstance = new Chart(growthCtx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Total Balance (Maturity)',
            data: [],
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.15)',
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: '#00ff88',
            pointBorderColor: '#000',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Principal Baseline',
            data: [],
            borderColor: '#00f0ff',
            borderDash: [5, 5],
            borderWidth: 1.5,
            fill: false,
            pointRadius: 0,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#9ca3af',
              font: { family: '"JetBrains Mono"', size: 11 },
              boxWidth: 12,
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 16, 24, 0.95)',
            titleColor: '#00ff88',
            bodyColor: '#e5e7eb',
            borderColor: 'rgba(0, 255, 136, 0.4)',
            borderWidth: 1,
            padding: 10,
            titleFont: { family: '"Orbitron"' },
            bodyFont: { family: '"JetBrains Mono"' },
            callbacks: {
              label: function (context) {
                return ` ${context.dataset.label}: ${formatMoney(context.parsed.y)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#6b7280', font: { family: '"JetBrains Mono"', size: 10 } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#6b7280',
              font: { family: '"JetBrains Mono"', size: 10 },
              callback: (value) => formatMoney(value).split('.')[0]
            }
          }
        }
      }
    });
  }

  if (ratioCtx) {
    ratioChartInstance = new Chart(ratioCtx, {
      type: 'doughnut',
      data: {
        labels: ['Principal', 'Interest'],
        datasets: [{
          data: [10000, 3750],
          backgroundColor: ['#00f0ff', '#00ff88'],
          borderColor: '#0c121a',
          borderWidth: 3,
          hoverOffset: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(10, 16, 24, 0.95)',
            borderColor: 'rgba(0, 240, 255, 0.4)',
            borderWidth: 1,
            bodyFont: { family: '"JetBrains Mono"' },
            callbacks: {
              label: function (context) {
                return ` ${context.label}: ${formatMoney(context.parsed)}`;
              }
            }
          }
        }
      }
    });
  }
}

// Fallback pure-client calculate if backend server is unreachable
function calculateClientSide(p, r, t) {
  const simpleInterest = (p * r * t) / 100;
  const totalAmount = p + simpleInterest;
  const totalMonths = Math.max(1, Math.round(t * 12));
  const monthlyInterest = simpleInterest / totalMonths;
  const annualInterest = (p * r) / 100;

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
    });
  }

  return {
    inputs: { principal: p, annualRatePercent: r, timeYears: t, currency: state.currency },
    results: {
      simpleInterest,
      totalAmount,
      annualInterest,
      monthlyInterest,
      principalPercentage: ((p / totalAmount) * 100).toFixed(1),
      interestPercentage: ((simpleInterest / totalAmount) * 100).toFixed(1),
    },
    schedule,
  };
}

// Fetch calculation from server (with client fallback)
async function performCalculation() {
  playCyberChirp(920, 0.08);

  const p = parseFloat(state.principal);
  const r = parseFloat(state.rate);
  const t = parseFloat(state.timeYears);

  if (isNaN(p) || isNaN(r) || isNaN(t) || p < 0 || r < 0 || t <= 0) {
    alert('Please enter valid positive values for Principal, Rate, and Time.');
    return;
  }

  let resultData = null;

  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        principal: p,
        rate: r,
        time: t,
        currency: state.currency,
      }),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success) {
        resultData = json.data;
        updateApiStatus(true);
      }
    } else {
      throw new Error('API returned status ' + response.status);
    }
  } catch (err) {
    console.warn('Backend API unavailable, executing client-side engine:', err.message);
    updateApiStatus(false);
    resultData = calculateClientSide(p, r, t);
  }

  if (resultData) {
    updateUIWithResults(resultData);
  }
}

// Update API status indicator in UI
function updateApiStatus(isOnline) {
  const dot = document.getElementById('api-status-dot');
  const text = document.getElementById('api-status-text');
  if (dot && text) {
    if (isOnline) {
      dot.className = 'w-2 h-2 rounded-full bg-matrix-glow animate-ping';
      text.innerText = 'Backend API Online';
      text.className = 'text-matrix-glow font-bold';
    } else {
      dot.className = 'w-2 h-2 rounded-full bg-yellow-400';
      text.innerText = 'Client Engine Active';
      text.className = 'text-yellow-400 font-bold';
    }
  }
}

// Update DOM with Calculation Results
function updateUIWithResults(data) {
  const { results, schedule } = data;
  const p = data.inputs.principal;
  const si = results.simpleInterest;
  const total = results.totalAmount;
  const monthly = results.monthlyInterest;

  // Update Metric Cards
  document.getElementById('metric-principal').innerText = formatMoney(p);
  document.getElementById('metric-interest').innerText = formatMoney(si);
  document.getElementById('metric-total').innerText = formatMoney(total);
  document.getElementById('metric-monthly').innerText = formatMoney(monthly);

  // Update percentages
  const interestPct = total > 0 ? ((si / total) * 100).toFixed(1) : 0;
  const totalYieldPct = p > 0 ? ((si / p) * 100).toFixed(1) : 0;

  document.getElementById('metric-interest-pct').innerText = `${interestPct}%`;
  document.getElementById('bar-interest').style.width = `${Math.min(interestPct, 100)}%`;
  document.getElementById('ratio-center-pct').innerText = `+${totalYieldPct}%`;

  // Update CLI shell preview
  document.getElementById('cli-p').innerText = p.toLocaleString();
  document.getElementById('cli-r').innerText = data.inputs.annualRatePercent;
  document.getElementById('cli-t').innerText = data.inputs.timeYears;
  document.getElementById('cli-si').innerText = si.toFixed(2);
  document.getElementById('cli-total').innerText = total.toFixed(2);

  // Update Table
  const tbody = document.getElementById('schedule-tbody');
  if (tbody) {
    tbody.innerHTML = '';
    schedule.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-white/[0.03] transition-colors border-b border-gray-800/40';
      tr.innerHTML = `
        <td class="px-4 py-2.5 font-bold text-white flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-matrix-glow"></span>
          ${row.periodLabel || 'Year ' + row.year}
        </td>
        <td class="px-4 py-2.5 text-gray-300">${formatMoney(row.interestEarnedPeriod)}</td>
        <td class="px-4 py-2.5 text-matrix-glow font-bold">${formatMoney(row.cumulativeInterest)}</td>
        <td class="px-4 py-2.5 text-right text-cyber-cyan font-bold">${formatMoney(row.balance)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Update Growth Chart
  if (growthChartInstance) {
    const labels = ['Start', ...schedule.map((s) => s.periodLabel || `Yr ${s.year}`)];
    const principalPoints = [p, ...schedule.map(() => p)];
    const totalPoints = [p, ...schedule.map((s) => s.balance)];

    growthChartInstance.data.labels = labels;
    growthChartInstance.data.datasets[0].data = totalPoints;
    growthChartInstance.data.datasets[1].data = principalPoints;
    growthChartInstance.update();
  }

  // Update Ratio Doughnut
  if (ratioChartInstance) {
    ratioChartInstance.data.datasets[0].data = [p, si];
    ratioChartInstance.update();
  }

  // Store active schedule for export
  window._currentSchedule = schedule;
  window._currentData = data;
}

// Export schedule to CSV
function exportCSV() {
  playCyberChirp(1200, 0.05);
  if (!window._currentSchedule || !window._currentData) return;

  const data = window._currentData;
  const p = data.inputs.principal;
  const r = data.inputs.annualRatePercent;
  const t = data.inputs.timeYears;
  const currency = state.currency;

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Cyber Simple Interest Calculator - Breakdown Schedule\n';
  csvContent += `Author: Aqsa Aziz Wagan (2K23/CSM/21) - IMCS University of Sindh\n`;
  csvContent += `Principal,${p},Rate (%),${r},Time (Years),${t},Currency,${currency}\n\n`;
  csvContent += 'Period,Annual Interest Accrued,Cumulative Interest,Ending Balance\n';

  window._currentSchedule.forEach((row) => {
    csvContent += `"${row.periodLabel || 'Year ' + row.year}",${row.interestEarnedPeriod},${row.cumulativeInterest},${row.balance}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `simple_interest_schedule_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Setup Event Listeners
function setupEvents() {
  const pInput = document.getElementById('principal-input');
  const pSlider = document.getElementById('principal-slider');
  const pDisplay = document.getElementById('principal-display');

  const rInput = document.getElementById('rate-input');
  const rSlider = document.getElementById('rate-slider');
  const rDisplay = document.getElementById('rate-display');

  const tInput = document.getElementById('time-input');
  const tSlider = document.getElementById('time-slider');
  const tDisplay = document.getElementById('time-display');

  const currencySelect = document.getElementById('currency-select');
  const calcBtn = document.getElementById('calculate-btn');
  const resetBtn = document.getElementById('reset-btn');

  // Principal sync
  function syncPrincipal(val) {
    state.principal = Math.max(0, parseFloat(val) || 0);
    pInput.value = state.principal;
    pSlider.value = Math.min(state.principal, 200000);
    pDisplay.innerText = formatMoney(state.principal);
    performCalculation();
  }

  pInput.addEventListener('input', (e) => syncPrincipal(e.target.value));
  pSlider.addEventListener('input', (e) => syncPrincipal(e.target.value));

  // Quick Principal preset buttons
  document.querySelectorAll('.preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const added = parseFloat(btn.getAttribute('data-val'));
      syncPrincipal(state.principal + added);
    });
  });

  // Rate sync
  function syncRate(val) {
    state.rate = Math.max(0.1, parseFloat(val) || 0.1);
    rInput.value = state.rate;
    rSlider.value = Math.min(state.rate, 30);
    rDisplay.innerText = `${state.rate}%`;
    performCalculation();
  }

  rInput.addEventListener('input', (e) => syncRate(e.target.value));
  rSlider.addEventListener('input', (e) => syncRate(e.target.value));

  // Rate presets
  document.querySelectorAll('.rate-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const r = parseFloat(btn.getAttribute('data-rate'));
      syncRate(r);
    });
  });

  // Time sync
  function syncTime(val) {
    const rawVal = Math.max(0.1, parseFloat(val) || 0.1);
    if (state.timeUnit === 'months') {
      state.timeYears = parseFloat((rawVal / 12).toFixed(2));
      tDisplay.innerText = `${rawVal} Months (${state.timeYears} Yrs)`;
    } else {
      state.timeYears = rawVal;
      tDisplay.innerText = `${rawVal} Years`;
    }
    tInput.value = rawVal;
    tSlider.value = Math.min(rawVal, state.timeUnit === 'months' ? 120 : 30);
    performCalculation();
  }

  tInput.addEventListener('input', (e) => syncTime(e.target.value));
  tSlider.addEventListener('input', (e) => syncTime(e.target.value));

  // Unit toggle (Years vs Months)
  const yrBtn = document.getElementById('unit-years-btn');
  const moBtn = document.getElementById('unit-months-btn');
  const unitLabel = document.getElementById('time-unit-label');

  yrBtn.addEventListener('click', () => {
    if (state.timeUnit === 'years') return;
    state.timeUnit = 'years';
    yrBtn.className = 'px-2 py-0.5 rounded bg-cyber-magenta/20 text-cyber-magenta font-bold';
    moBtn.className = 'px-2 py-0.5 rounded text-gray-400 hover:text-white';
    unitLabel.innerText = 'yr';
    tSlider.max = 30;
    tInput.value = state.timeYears;
    tSlider.value = state.timeYears;
    syncTime(state.timeYears);
  });

  moBtn.addEventListener('click', () => {
    if (state.timeUnit === 'months') return;
    state.timeUnit = 'months';
    moBtn.className = 'px-2 py-0.5 rounded bg-cyber-magenta/20 text-cyber-magenta font-bold';
    yrBtn.className = 'px-2 py-0.5 rounded text-gray-400 hover:text-white';
    unitLabel.innerText = 'mo';
    tSlider.max = 120;
    const months = Math.round(state.timeYears * 12);
    tInput.value = months;
    tSlider.value = months;
    syncTime(months);
  });

  // Currency select
  currencySelect.addEventListener('change', (e) => {
    state.currency = e.target.value;
    const symbol = currencySymbols[state.currency] || '$';
    document.querySelectorAll('.currency-symbol').forEach((el) => {
      el.innerText = symbol;
    });
    pDisplay.innerText = formatMoney(state.principal);
    performCalculation();
  });

  // Calculate & Reset buttons
  calcBtn.addEventListener('click', performCalculation);
  resetBtn.addEventListener('click', () => {
    playCyberChirp(600, 0.05);
    state.principal = 10000;
    state.rate = 7.5;
    state.timeYears = 5;
    state.timeUnit = 'years';
    yrBtn.click();
    syncPrincipal(10000);
    syncRate(7.5);
    syncTime(5);
  });

  // Chart view switches (Line vs Bar)
  const lineBtn = document.getElementById('chart-view-line');
  const barBtn = document.getElementById('chart-view-bar');

  lineBtn.addEventListener('click', () => {
    if (state.chartType === 'line') return;
    state.chartType = 'line';
    lineBtn.className = 'px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40';
    barBtn.className = 'px-3 py-1 rounded-lg text-xs font-mono text-gray-400 hover:text-white border border-gray-800';
    if (growthChartInstance) {
      growthChartInstance.config.type = 'line';
      growthChartInstance.data.datasets[0].fill = true;
      growthChartInstance.update();
    }
  });

  barBtn.addEventListener('click', () => {
    if (state.chartType === 'bar') return;
    state.chartType = 'bar';
    barBtn.className = 'px-3 py-1 rounded-lg text-xs font-mono font-bold bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/40';
    lineBtn.className = 'px-3 py-1 rounded-lg text-xs font-mono text-gray-400 hover:text-white border border-gray-800';
    if (growthChartInstance) {
      growthChartInstance.config.type = 'bar';
      growthChartInstance.data.datasets[0].fill = false;
      growthChartInstance.update();
    }
  });

  // Export CSV & Print
  document.getElementById('export-csv-btn')?.addEventListener('click', exportCSV);
  document.getElementById('print-summary-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Sound toggle button
  const soundBtn = document.getElementById('toggle-audio-btn');
  const soundIcon = document.getElementById('sound-icon');
  soundBtn?.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      playCyberChirp(1040, 0.1);
      soundBtn.classList.add('border-matrix-glow', 'text-matrix-glow');
    } else {
      soundBtn.classList.remove('border-matrix-glow', 'text-matrix-glow');
    }
  });

  // Copy bash command snippet
  document.getElementById('copy-script-cmd')?.addEventListener('click', () => {
    navigator.clipboard.writeText('bash simple-interest.sh').then(() => {
      const btn = document.getElementById('copy-script-cmd');
      btn.innerText = 'Copied!';
      setTimeout(() => (btn.innerText = 'Copy'), 1500);
    });
  });
}

// Lifecycle Init
document.addEventListener('DOMContentLoaded', () => {
  initMatrixCanvas();
  initCharts();
  setupEvents();
  performCalculation();
});
