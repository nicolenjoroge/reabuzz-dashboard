import {
  reaState,
  reaIdeas,
  REA_STATUSES,
  REA_DIVISIONS,
  REA_DEPARTMENTS,
  REA_DEPT_BY_DIV,
} from './config.js';

// ---------------------------------------------------------------------------
// Dropdown population
// ---------------------------------------------------------------------------

export function reaPopulateFilters() {
  const addOption = (id, text, val) => {
    const sel = document.getElementById(id);
    if (sel) sel.appendChild(new Option(text, val));
  };

  REA_STATUSES.forEach(s  => addOption('reaFilterStatus',   s, s));
  REA_DIVISIONS.forEach(d  => addOption('reaFilterDivision', d, d));
  REA_DEPARTMENTS.forEach(d => addOption('reaFilterDept',    d, d));
}

// ---------------------------------------------------------------------------
// Filtering
// ---------------------------------------------------------------------------

export function reaGetFiltered() {
  const { filters } = reaState;
  const q = filters.search.toLowerCase();

  return reaIdeas.filter(idea => {
    const matchSearch = !q ||
      idea.title.toLowerCase().includes(q) ||
      idea.submitter.toLowerCase().includes(q) ||
      idea.department.toLowerCase().includes(q);
    const matchStatus = !filters.status     || idea.status     === filters.status;
    const matchDiv    = !filters.division   || idea.division   === filters.division;
    const matchDept   = !filters.department || idea.department === filters.department;
    return matchSearch && matchStatus && matchDiv && matchDept;
  });
}

// ---------------------------------------------------------------------------
// Event handlers (called from HTML onchange / oninput)
// ---------------------------------------------------------------------------

export function reaOnFilterChange() {
  reaState.filters.search     = document.getElementById('reaFilterSearch').value;
  reaState.filters.status     = document.getElementById('reaFilterStatus').value;
  reaState.filters.division   = document.getElementById('reaFilterDivision').value;
  reaState.filters.department = document.getElementById('reaFilterDept').value;
  reaState.currentPage = 1;
}

export function reaOnDivisionChange() {
  reaState.filters.division = document.getElementById('reaFilterDivision').value;

  // Narrow department options to match the selected division
  const deptSel = document.getElementById('reaFilterDept');
  const kept = deptSel.value;
  deptSel.innerHTML = '';
  deptSel.appendChild(new Option('Department: All', ''));

  const allowed = reaState.filters.division
    ? (REA_DEPT_BY_DIV[reaState.filters.division] || [])
    : REA_DEPARTMENTS;

  allowed.forEach(d => deptSel.appendChild(new Option(d, d)));
  reaState.filters.department = allowed.includes(kept) ? kept : '';
  deptSel.value = reaState.filters.department;
  reaState.currentPage = 1;
}

export function reaClearFilters() {
  reaState.filters = { search: '', status: '', division: '', department: '' };
  reaState.currentPage = 1;

  document.getElementById('reaFilterSearch').value   = '';
  document.getElementById('reaFilterStatus').value   = '';
  document.getElementById('reaFilterDivision').value = '';

  const deptSel = document.getElementById('reaFilterDept');
  deptSel.innerHTML = '';
  deptSel.appendChild(new Option('Department: All', ''));
  REA_DEPARTMENTS.forEach(d => deptSel.appendChild(new Option(d, d)));

  // Remove active tile highlight
  document.querySelectorAll('#view-rea .summary-tile')
    .forEach(t => t.classList.remove('active-filter'));
}

// ---------------------------------------------------------------------------
// Tile click filter (summary tile or progress bar segment)
// ---------------------------------------------------------------------------

export function reaTileFilter(status) {
  if (reaState.filters.status === status) {
    reaState.filters.status = '';
  } else {
    reaState.filters.status = status;
    const sel = document.getElementById('reaFilterStatus');
    if (sel) sel.value = status;
  }
  reaState.currentPage = 1;

  // Toggle active highlight on summary tiles
  document.querySelectorAll('#view-rea .summary-tile')
    .forEach(t => t.classList.remove('active-filter'));

  if (reaState.filters.status) {
    const active = document.querySelector(
      `#view-rea .summary-tile[data-status="${reaState.filters.status}"]`
    );
    if (active) active.classList.add('active-filter');
  }
}

// ---------------------------------------------------------------------------
// Filter note
// ---------------------------------------------------------------------------

export function reaRenderFilterNote() {
  const { filters } = reaState;
  const parts = [];
  if (filters.status)     parts.push(`Status: ${filters.status}`);
  if (filters.division)   parts.push(`Division: ${filters.division}`);
  if (filters.department) parts.push(`Department: ${filters.department}`);
  if (filters.search)     parts.push(`Search: "${filters.search}"`);
  const el = document.getElementById('reaFilterNote');
  if (el) el.textContent = parts.length ? `Showing: ${parts.join(' · ')}` : '';
}