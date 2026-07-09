import { state, PAGE_SIZE } from './config.js';
import { getFiltered } from './filters.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function statusPillClass(status) {
  return 'status-' + String(status || '').toLowerCase().replace(/ /g, '-');
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

export function renderTable() {
  let data = getFiltered();

  if (state.sortState.key) {
    data = [...data].sort((a, b) => {
      const av = a[state.sortState.key];
      const bv = b[state.sortState.key];
      if (typeof av === 'number') return (av - bv) * state.sortState.dir;
      return String(av).localeCompare(String(bv)) * state.sortState.dir;
    });
  } else {
    // Default: initiatives with a quantitative benefit first
    data = [...data].sort((a, b) => {
      const aHas = a.quant && a.quant.trim() !== '' ? 1 : 0;
      const bHas = b.quant && b.quant.trim() !== '' ? 1 : 0;
      return bHas - aHas;
    });
  }

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  if (state.currentPage > totalPages) state.currentPage = totalPages;
  if (state.currentPage < 1)         state.currentPage = 1;

  const startIdx = (state.currentPage - 1) * PAGE_SIZE;
  const pageData = data.slice(startIdx, startIdx + PAGE_SIZE);

  if (totalItems === 0) {
    document.getElementById('tableCount').textContent =
      `0 of ${state.initiatives.length} initiatives shown`;
    document.getElementById('tableBody').innerHTML =
      `<tr><td colspan="8" class="empty-row">No initiatives match this filter combination. Try clearing a filter.</td></tr>`;
    renderPagination(0, 1, 1);
    return;
  }

  const rangeEnd = Math.min(startIdx + PAGE_SIZE, totalItems);
  document.getElementById('tableCount').textContent =
    `Showing ${startIdx + 1}–${rangeEnd} of ${totalItems} initiatives (${state.initiatives.length} total)`;

  document.getElementById('tableBody').innerHTML = pageData.map((i, idx) => `
    <tr class="data-row" data-idx="${idx}">
      <td style="color:var(--txt-minor); font-size:11px; white-space:nowrap;">${startIdx + idx + 1}</td>
      <td><strong>${i.name}</strong></td>
      <td class="solution-cell" onclick="toggleDetailPanel(this, ${idx})">
        <div class="solution-preview">
          <span class="solution-text">${i.solution || '—'}</span>
          <span class="solution-arrow">▾</span>
        </div>
      </td>
      <td><span class="status-pill ${statusPillClass(i.status)}">${i.status}</span></td>
      <td>${i.department}</td>
      <td>${i.division}</td>
      <td>${i.quant}</td>
      <td>${i.country}</td>
    </tr>
  `).join('');

  renderPagination(totalItems, state.currentPage, totalPages);
}

export function renderPagination(totalItems, page, totalPages) {
  const wrap = document.getElementById('paginationWrap');
  if (totalItems === 0) { wrap.innerHTML = ''; return; }

  let buttons = `<button class="page-btn" data-page="prev" ${page === 1 ? 'disabled' : ''}>‹ Prev</button>`;
  for (let p = 1; p <= totalPages; p++) {
    buttons += `<button class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`;
  }
  buttons += `<button class="page-btn" data-page="next" ${page === totalPages ? 'disabled' : ''}>Next ›</button>`;
  wrap.innerHTML = buttons;

  wrap.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.page;
      if (val === 'prev')      state.currentPage--;
      else if (val === 'next') state.currentPage++;
      else                     state.currentPage = parseInt(val, 10);
      renderTable();
    });
  });
}

// ---------------------------------------------------------------------------
// Row expand / collapse
// ---------------------------------------------------------------------------

export function toggleDetailPanel(cell, idx) {
  const dataRow     = document.querySelector(`.data-row[data-idx="${idx}"]`);
  const solutionCell= dataRow.querySelector('.solution-cell');
  const isOpen      = dataRow.classList.contains('expanded-row');

  // Close all open rows first
  document.querySelectorAll('.data-row.expanded-row').forEach(r => {
    r.classList.remove('expanded-row');
    r.querySelector('.solution-cell').classList.remove('solution-expanded');
  });

  if (!isOpen) {
    dataRow.classList.add('expanded-row');
    solutionCell.classList.add('solution-expanded');
  }
}
