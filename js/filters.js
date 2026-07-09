import { state, STATUSES, VERTICALS, DEPARTMENTS, DIVISIONS } from './config.js';

// ---------------------------------------------------------------------------
// DOM references (resolved once on first import)
// ---------------------------------------------------------------------------

export const statusSel   = document.getElementById('filterStatus');
export const verticalSel = document.getElementById('filterVertical');
export const divisionSel = document.getElementById('filterDivision');
export const deptSel     = document.getElementById('filterDept');
export const countrySel  = document.getElementById('filterCountry');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fillSelect(select, values, placeholder) {
  const currentValue = select.value;
  select.innerHTML = '';
  select.appendChild(new Option(placeholder, ''));
  values.forEach(v => select.appendChild(new Option(v, v)));
  select.value = values.includes(currentValue) ? currentValue : '';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function populateFilterOptions() {
  const { initiatives } = state;
  const unique = (key) => [...new Set(initiatives.map(i => i[key]).filter(Boolean))].sort();

  fillSelect(statusSel,   unique('status').length   ? unique('status')   : STATUSES,   'Status: All');
  fillSelect(verticalSel, unique('vertical').length ? unique('vertical') : VERTICALS,  'Delivery stream: All');
  fillSelect(divisionSel, unique('division').length ? unique('division') : DIVISIONS,  'Division: All');
  fillSelect(deptSel,     unique('department').length ? unique('department') : DEPARTMENTS, 'Department: All');
  fillSelect(countrySel,  unique('country').length  ? unique('country')  : [],         'Country: All');
}

export function refreshDeptOptions() {
  const { initiatives, activeFilters } = state;
  const keepValue   = deptSel.value;
  const allowedDepts = activeFilters.division
    ? [...new Set(initiatives.filter(i => i.division === activeFilters.division).map(i => i.department))].filter(Boolean)
    : [...new Set(initiatives.map(i => i.department).filter(Boolean))];

  deptSel.innerHTML = '';
  deptSel.appendChild(new Option('Department: All', ''));
  allowedDepts.forEach(d => deptSel.appendChild(new Option(d, d)));

  if (allowedDepts.includes(keepValue)) deptSel.value = keepValue;
  else {
    deptSel.value = '';
    activeFilters.department = '';
  }
}

export function getFiltered() {
  const { initiatives, activeFilters } = state;
  return initiatives.filter(i =>
    (!activeFilters.status     || i.status     === activeFilters.status)     &&
    (!activeFilters.vertical   || i.vertical   === activeFilters.vertical)   &&
    (!activeFilters.division   || i.division   === activeFilters.division)   &&
    (!activeFilters.department || i.department === activeFilters.department) &&
    (!activeFilters.country    || i.country    === activeFilters.country)
  );
}

export function updateFilterNote() {
  const { activeFilters } = state;
  const parts = [];
  if (activeFilters.status)     parts.push(`Status: ${activeFilters.status}`);
  if (activeFilters.vertical)   parts.push(`Delivery stream: ${activeFilters.vertical}`);
  if (activeFilters.division)   parts.push(`Division: ${activeFilters.division}`);
  if (activeFilters.department) parts.push(`Department: ${activeFilters.department}`);
  document.getElementById('filterNote').textContent = parts.length
    ? `Showing: ${parts.join(' · ')} — summary tiles and charts above reflect this filter too.`
    : '';
}
