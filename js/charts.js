import { TARGET_MAN_HOURS, STATUS_COLORS, DIVISION_COLORS, RING_COLORS, STATUSES } from './config.js';
import { getFiltered } from './filters.js';

// ---------------------------------------------------------------------------
// Chart instances (module-scoped singletons)
// ---------------------------------------------------------------------------

let gaugeChartInstance        = null;
let ganttChartInstance        = null;
let divisionChartInstance     = null;
let divisionChartLargeInstance= null;

// ---------------------------------------------------------------------------
// Shared plugins
// ---------------------------------------------------------------------------

const divisionValueLabelPlugin = {
  id: 'divisionValueLabel',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta = chart.getDatasetMeta(0);
    meta.data.forEach((bar, i) => {
      const value = chart.data.datasets[0].data[i];
      ctx.save();
      ctx.fillStyle   = '#39302D';
      ctx.font        = 'bold 12px Century Gothic, Futura, Trebuchet MS, sans-serif';
      ctx.textAlign   = 'left';
      ctx.textBaseline= 'middle';
      ctx.fillText(value, bar.x + 8, bar.y);
      ctx.restore();
    });
  },
};

const statusPctLabelPlugin = {
  id: 'statusPctLabel',
  afterDatasetsDraw(chart) {
    const { ctx } = chart;
    const meta    = chart.getDatasetMeta(0);
    const dataset = chart.data.datasets[0];
    const total   = dataset.data.reduce((a, b) => a + b, 0);
    if (!total) return;

    meta.data.forEach((slice, i) => {
      const value = dataset.data[i];
      if (!value) return;
      const pct = Math.round((value / total) * 100);
      const pos = slice.tooltipPosition();
      ctx.save();
      ctx.font        = 'bold 11px Century Gothic, Futura, Trebuchet MS, sans-serif';
      ctx.fillStyle   = '#fff';
      ctx.textAlign   = 'center';
      ctx.textBaseline= 'middle';
      ctx.fillText(pct + '%', pos.x, pos.y);
      ctx.restore();
    });
  },
};

// ---------------------------------------------------------------------------
// Gauge
// ---------------------------------------------------------------------------

function ragColor(pct) {
  const style = getComputedStyle(document.documentElement);
  if (pct < 40)  return style.getPropertyValue('--sky').trim();
  if (pct < 80)  return style.getPropertyValue('--sun').trim();
  if (pct < 100) return style.getPropertyValue('--green').trim();
  return style.getPropertyValue('--coral').trim();
}

export function renderGauge(data) {
  const deployedHours = data
    .filter(i => i.status === 'Deployed')
    .reduce((s, i) => s + (Number(i.manHours) || 0), 0);
  const pct = TARGET_MAN_HOURS ? (deployedHours / TARGET_MAN_HOURS) * 100 : 0;

  document.getElementById('gaugeText').innerHTML =
    pct.toFixed(2) + '%<span>of 200,000 Target</span>';
  document.getElementById('actualHours').textContent =
    deployedHours.toLocaleString('en-US');

  if (gaugeChartInstance) gaugeChartInstance.destroy();
  gaugeChartInstance = new Chart(document.getElementById('gaugeChart'), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [Math.min(pct, 100), Math.max(100 - pct, 0)],
        backgroundColor: [ragColor(pct), '#eee8e0'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
        cutout: '72%',
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });
}

// ---------------------------------------------------------------------------
// Status pie
// ---------------------------------------------------------------------------

export function renderStatusChart(data) {
  const statusOrder  = ['Pipeline', 'Analysis', 'Build', 'CAB', 'UAT', 'Deployed'];
  const statusCounts = statusOrder.map(s => data.filter(i => i.status === s).length);

  const visibleStatuses = statusOrder.filter((_, idx) => statusCounts[idx] > 0);
  const visibleCounts   = visibleStatuses.map(s => statusCounts[statusOrder.indexOf(s)]);

  if (ganttChartInstance) ganttChartInstance.destroy();
  ganttChartInstance = new Chart(document.getElementById('ganttChart'), {
    type: 'doughnut',
    data: {
      labels: visibleStatuses,
      datasets: [{
        data: visibleCounts,
        backgroundColor: visibleStatuses.map(s => STATUS_COLORS[s]),
        borderWidth: 2,
        borderColor: '#fff',
      }],
    },
    plugins: [statusPctLabelPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.parsed} initiative${ctx.parsed === 1 ? '' : 's'}` } },
      },
      cutout: '58%',
    },
  });

  const statusTotal = visibleCounts.reduce((a, b) => a + b, 0);
  document.getElementById('statusLegend').innerHTML = visibleStatuses.length
    ? visibleStatuses.map(s => `
        <span>
          <span class="legend-dot" style="background:${STATUS_COLORS[s]}"></span>
          ${s} ${statusTotal ? Math.round(statusCounts[statusOrder.indexOf(s)] / statusTotal * 100) : 0}%
        </span>
      `).join('')
    : '<span>No data for this filter combination</span>';
}

// ---------------------------------------------------------------------------
// Rings
// ---------------------------------------------------------------------------

export function renderRings(data) {
  const activeVerticals = [...new Set(data.map(i => i.vertical).filter(Boolean))];
  const total = data.length;
  const grid  = document.getElementById('ringsGrid');

  if (!activeVerticals.length || !total) {
    grid.innerHTML = '<span style="font-size:12px;color:var(--txt-minor);">No data for this filter combination</span>';
    return;
  }

  const isMobile     = window.innerWidth <= 768;
  const size         = isMobile ? 56 : 84;
  const stroke       = isMobile ? 5  : 8;
  const r            = (size - stroke) / 2;
  const circumference= 2 * Math.PI * r;

  grid.innerHTML = activeVerticals.map((v, idx) => {
    const count  = data.filter(i => i.vertical === v).length;
    const pct    = Math.round((count / total) * 100);
    const offset = circumference - (pct / 100) * circumference;
    const color  = RING_COLORS[idx % RING_COLORS.length];
    const mid    = size / 2;

    return `
      <div class="ring-item">
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
          <circle cx="${mid}" cy="${mid}" r="${r}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="${stroke}"/>
          <circle cx="${mid}" cy="${mid}" r="${r}" fill="none" stroke="${color}" stroke-width="${stroke}"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
            stroke-linecap="round" transform="rotate(-90 ${mid} ${mid})"/>
          <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
            class="ring-pct" fill="${color}" font-size="${isMobile ? 13 : 16}">${pct}%</text>
        </svg>
        <div class="ring-label">${v}<br>${count}</div>
      </div>
    `;
  }).join('');
}

// ---------------------------------------------------------------------------
// Division bar (compressed — top 6)
// ---------------------------------------------------------------------------

export function getDivisionPairs(data) {
  const activeDivisions = [...new Set(data.map(i => i.division).filter(Boolean))];
  return activeDivisions
    .map(d => ({ label: d, count: data.filter(i => i.division === d).length }))
    .sort((a, b) => b.count - a.count);
}

export function renderDivisionChart(data) {
  const allPairs = getDivisionPairs(data);
  const topPairs = allPairs.slice(0, 6);

  if (divisionChartInstance) divisionChartInstance.destroy();
  divisionChartInstance = new Chart(document.getElementById('divisionChart'), {
    type: 'bar',
    data: {
      labels: topPairs.map(p => p.label),
      datasets: [{
        data: topPairs.map(p => p.count),
        backgroundColor: topPairs.map((_, idx) => DIVISION_COLORS[idx % DIVISION_COLORS.length]),
        borderRadius: 4,
        maxBarThickness: 50,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      }],
    },
    plugins: [divisionValueLabelPlugin],
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 28 } },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx) => ctx.parsed.x + ' initiative' + (ctx.parsed.x === 1 ? '' : 's') } },
      },
      scales: {
        x: {
          beginAtZero: true,
          suggestedMax: Math.max(...topPairs.map(p => p.count), 1) + 1,
          ticks: { precision: 0, color: '#8a8580' },
          grid:  { color: '#eee8e0' },
        },
        y: {
          ticks: { color: '#39302D', font: { weight: 'bold', size: 11 } },
          grid:  { display: false },
        },
      },
    },
  });

  // Stash for modal
  window._lastDivisionData = data;
}

// ---------------------------------------------------------------------------
// Division modal (full breakdown)
// ---------------------------------------------------------------------------

export function openDivisionModal() {
  document.getElementById('divisionModal').classList.add('show');
  const data     = window._lastDivisionData || [];
  const allPairs = getDivisionPairs(data);
  const total    = allPairs.reduce((s, p) => s + p.count, 0);

  if (divisionChartLargeInstance) divisionChartLargeInstance.destroy();
  divisionChartLargeInstance = new Chart(document.getElementById('divisionChartLarge'), {
    type: 'bar',
    data: {
      labels: allPairs.map(p => p.label),
      datasets: [{
        data: allPairs.map(p => p.count),
        backgroundColor: allPairs.map((_, idx) => DIVISION_COLORS[idx % DIVISION_COLORS.length]),
        borderRadius: 4,
        maxBarThickness: 22,
      }],
    },
    plugins: [divisionValueLabelPlugin],
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 28 } },
      plugins: { legend: { display: false } },
      scales: {
        x: { beginAtZero: true, ticks: { precision: 0 } },
        y: { ticks: { autoSkip: false, font: { size: 12, weight: 'bold' } }, grid: { display: false } },
      },
    },
  });

  document.getElementById('divisionModalTable').innerHTML = allPairs.map(p => `
    <tr>
      <td>${p.label}</td>
      <td>${p.count}</td>
      <td>${total ? Math.round(p.count / total * 100) : 0}%</td>
    </tr>
  `).join('');
}

export function closeDivisionModal() {
  document.getElementById('divisionModal').classList.remove('show');
}

// ---------------------------------------------------------------------------
// Orchestrator — called by main.js on every refresh
// ---------------------------------------------------------------------------

export function renderCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
  }
  const data = getFiltered();
  renderGauge(data);
  renderStatusChart(data);
  renderRings(data);
  renderDivisionChart(data);
}
