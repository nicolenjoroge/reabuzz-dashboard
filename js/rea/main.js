import { reaPopulateFilters, reaOnFilterChange, reaOnDivisionChange,
         reaClearFilters, reaTileFilter, reaRenderFilterNote }  from './filters.js';
import { reaRenderSummary, reaRenderProgress }                  from './summary.js';
import { reaRenderTable, reaGoPage, reaSort,
         reaOpenModal, reaCloseModal }                          from './table.js';

// ---------------------------------------------------------------------------
// Expose to HTML onclick / oninput attributes
// ---------------------------------------------------------------------------

window.reaOnFilterChange   = () => { reaOnFilterChange();   reaRefreshAll(); };
window.reaOnDivisionChange = () => { reaOnDivisionChange(); reaRefreshAll(); };
window.reaClearFilters     = () => { reaClearFilters();     reaRefreshAll(); };
window.reaTileFilter       = (status) => { reaTileFilter(status); reaRefreshAll(); };
window.reaOpenModal        = reaOpenModal;
window.reaCloseModal       = reaCloseModal;
window.reaGoPage           = reaGoPage;
window.reaSort             = reaSort;

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

function reaRefreshAll() {
  reaRenderSummary();
  reaRenderProgress();
  reaRenderTable();
  reaRenderFilterNote();
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

function reaInit() {
  reaPopulateFilters();
  reaRefreshAll();
}

// Expose for switchDash — must be on window, not just exported
window.reaRefresh = reaRefreshAll;

reaInit();