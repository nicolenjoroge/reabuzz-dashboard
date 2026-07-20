import { reaIdeas, reaState, REA_STATUSES, REA_TILE_CLASS, REA_STATUS_COLORS } from './config.js';
import { reaGetFiltered, reaTileFilter }                                         from './filters.js';

// ---------------------------------------------------------------------------
// Summary tiles
// ---------------------------------------------------------------------------

export function reaRenderSummary() {
  const grid = document.getElementById('reaSummaryGrid');
  if (!grid) return;

  grid.innerHTML = REA_STATUSES.map(s => {
    const count  = reaIdeas.filter(i => i.status === s).length;
    const active = reaState.filters.status === s ? ' active-filter' : '';
    return `
      <div class="summary-tile ${REA_TILE_CLASS[s]}${active}"
           data-status="${s}"
           onclick="reaTileFilter('${s.replace(/'/g, "\\'")}')">
        <div class="s-label">${s}</div>
        <div class="s-value">${count}</div>
      </div>
    `;
  }).join('');
}

// ---------------------------------------------------------------------------
// Stacked progress bar
// ---------------------------------------------------------------------------

export function reaRenderProgress() {
  const filtered = reaGetFiltered();
  const total    = filtered.length;
  const bar      = document.getElementById('reaProgressBar');
  const legend   = document.getElementById('reaProgressLegend');
  if (!bar || !legend) return;

  if (total === 0) {
    bar.innerHTML    = '<div style="width:100%;display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--txt2);">No ideas match this filter</div>';
    legend.innerHTML = '';
    return;
  }

  let segments     = '';
  let legendItems  = '';

  REA_STATUSES.forEach(s => {
    const count = filtered.filter(i => i.status === s).length;
    if (!count) return;
    const pct   = (count / total * 100).toFixed(2);
    const color = REA_STATUS_COLORS[s];
    const label = count > 2 ? count : '';

    segments += `
      <div class="progress-segment" style="flex:${pct};background:${color};" data-sf="${s}">
        <div class="progress-tip">${s} · ${count} idea${count === 1 ? '' : 's'} (${parseFloat(pct).toFixed(0)}%)</div>
        ${label ? `<div class="progress-segment-label">${label}</div>` : ''}
      </div>
    `;
    legendItems += `
      <div class="legend-item" data-sf="${s}">
        <div class="legend-dot" style="background:${color};"></div>
        <span><strong>${count}</strong> ${s}</span>
      </div>
    `;
  });

  bar.innerHTML    = segments;
  legend.innerHTML = legendItems;

  // Click delegation for bar and legend
  const handleClick = (container) => {
    container.onclick = (e) => {
      let el = e.target;
      while (el && el !== container) {
        if (el.dataset?.sf) { reaTileFilter(el.dataset.sf); return; }
        el = el.parentNode;
      }
    };
  };
  handleClick(bar);
  handleClick(legend);
}