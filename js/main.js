import { state }                                          from './config.js';
import { normalizeInitiative }                             from './normalize.js';
import { populateFilterOptions, refreshDeptOptions,
         getFiltered, updateFilterNote,
         statusSel, verticalSel, divisionSel,
         deptSel, countrySel }                             from './filters.js';
import { toggleReaTree, toggleReaPipeline }                from './pipeline.js';
import { renderSummary }                                   from './summary.js';
import { renderCharts, openDivisionModal,
         closeDivisionModal }                              from './charts.js';
import { renderTable, toggleDetailPanel }                  from './table.js';

// ---------------------------------------------------------------------------
// Expose functions that are called from inline HTML onclick attributes
// ---------------------------------------------------------------------------

window.toggleReaTree       = toggleReaTree;
window.toggleReaPipeline   = toggleReaPipeline;
window.openDivisionModal   = openDivisionModal;
window.closeDivisionModal  = closeDivisionModal;
window.toggleDetailPanel   = toggleDetailPanel;

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

function refreshAll() {
  renderSummary();
  renderCharts();
  renderTable();
  updateFilterNote();
}


var API_BASE =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "https://rea-buzz-api-layers-fkbra6a3dmahckh0.southafricanorth-01.azurewebsites.net/api";
// ---------------------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------------------

async function loadInitiatives() {
  try {
    const response = await fetch(API_BASE + '/initiatives');
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    state.initiatives = Array.isArray(data) ? data.map(normalizeInitiative) : [];
  } catch (err) {
    console.error('Failed to load initiatives:', err);
    state.initiatives = [];
    const note = document.getElementById('loadingNote');
    if (note) note.textContent = 'Unable to load live data';
  }

  populateFilterOptions();
  refreshDeptOptions();
  refreshAll();
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------

statusSel.addEventListener('change', e => {
  state.activeFilters.status = e.target.value;
  state.currentPage = 1;
  refreshAll();
});

verticalSel.addEventListener('change', e => {
  state.activeFilters.vertical = e.target.value;
  state.currentPage = 1;
  refreshAll();
});

divisionSel.addEventListener('change', e => {
  state.activeFilters.division = e.target.value;
  refreshDeptOptions();
  state.currentPage = 1;
  refreshAll();
});

deptSel.addEventListener('change', e => {
  state.activeFilters.department = e.target.value;
  state.currentPage = 1;
  refreshAll();
});

countrySel.addEventListener('change', e => {
  state.activeFilters.country = e.target.value;
  state.currentPage = 1;
  refreshAll();
});

document.getElementById('filterClear').addEventListener('click', () => {
  state.activeFilters = { status: '', vertical: '', division: '', department: '', country: '' };
  state.currentPage   = 1;
  [statusSel, verticalSel, divisionSel, deptSel, countrySel].forEach(s => s.value = '');
  refreshDeptOptions();
  refreshAll();
});

document.querySelectorAll('th[data-key]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.key;
    if (state.sortState.key === key) state.sortState.dir *= -1;
    else state.sortState = { key, dir: 1 };
    state.currentPage = 1;
    renderTable();
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDivisionModal();
});

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

loadInitiatives();
