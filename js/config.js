// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PAGE_SIZE = 10;
export const TARGET_MAN_HOURS = 200000;

export const STATUSES = ['Deployed', 'UAT', 'CAB', 'Build', 'Analysis', 'Pipeline'];
export const VERTICALS = ['RPA', 'PowerApps', 'Power Agents', 'AI', 'IBPS', 'DocuSign', 'Enterprise'];
export const DEPARTMENTS = ['Operations', 'Finance', 'Contact Centre', 'Trustee Services', 'Credit', 'FX Desk', 'Investment Banking', 'Retail Banking'];
export const DIVISIONS = ['Operations & Process', 'Finance & Treasury', 'Risk & Credit', 'Wealth & Trustee', 'Retail & Digital Banking', 'Corporate & Investment Banking', 'Customer Experience'];

export const STATUS_COLORS = {
  'Pipeline': '#E4032C',
  'Analysis': '#6C5042',
  'Build':    '#9F197E',
  'CAB':      '#F8E200',
  'UAT':      '#3AB3E5',
  'Deployed': '#00A86B',
};

export const DIVISION_COLORS = [
  '#3AB3E5', '#00A8A9', '#9F197E', '#F8E200',
  '#E4032C', '#39302D', '#7a8a99', '#c96b3a', '#5a8f4f',
];

export const RING_COLORS = [
  '#3AB3E5', '#00A8A9', '#9F197E', '#F8E200',
  '#E4032C', '#e8e8e8', '#d5dbe1',
];

// ---------------------------------------------------------------------------
// Shared mutable state
// ---------------------------------------------------------------------------

export const state = {
  initiatives: [],
  activeFilters: { status: '', vertical: '', division: '', department: '', country: '' },
  sortState: { key: null, dir: 1 },
  currentPage: 1,
};
