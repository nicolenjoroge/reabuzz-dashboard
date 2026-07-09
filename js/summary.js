import { getFiltered } from './filters.js';

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

const fmtNum      = (n) => Number(n || 0).toLocaleString('en-US');
const fmtCurrency = (n) => 'KES ' + (Number(n || 0) / 1_000_000).toFixed(1) + 'M';

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

export function renderSummary() {
  const data = getFiltered();

  const totalInitiatives = data.length;
  const deployed         = data.filter(i => i.status === 'Deployed').length;
  const totalManHours    = data.reduce((s, i) => s + (Number(i.manHours)    || 0), 0);
  const totalTat         = data.reduce((s, i) => s + (Number(i.tat)         || 0), 0);
  const totalSavings     = data.reduce((s, i) => s + (Number(i.costSavings) || 0), 0);

  const tiles = [
    { label: 'BPM initiatives',  value: totalInitiatives,        cls: '',              tile: 'tile-total'   },
    { label: 'Deployed',         value: deployed,                cls: 'accent-coral',  tile: 'tile-deploy'  },
    { label: 'Man hours',        value: fmtNum(totalManHours),   cls: 'accent-med',    tile: 'tile-hours'   },
    { label: 'Total TAT(HRS)',   value: fmtNum(totalTat),        cls: 'accent-passion',tile: 'tile-tat'     },
    { label: 'Cost savings',     value: fmtCurrency(totalSavings),cls: 'accent-coral', tile: 'tile-savings' },
  ];

  document.getElementById('summaryGrid').innerHTML = tiles.map(t => `
    <div class="summary-tile ${t.tile}">
      <div class="s-label">${t.label}</div>
      <div class="s-value ${t.cls}">${t.value}</div>
    </div>
  `).join('');
}
