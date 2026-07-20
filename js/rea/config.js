// ---------------------------------------------------------------------------
// REA Dashboard — Constants
// ---------------------------------------------------------------------------

export const REA_STATUSES = [
  'Pending Review',
  'Reviewed',
  'Prioritized',
  'Ongoing RVA',
  'Awaiting RVA',
  'Adopted - Innovation Council',
  'Not Adopted',
  'Deprioritized',
];

export const REA_DIVISIONS = [
  'Operations & Process',
  'Finance & Treasury',
  'Risk & Credit',
  'Wealth & Trustee',
  'Retail & Digital Banking',
  'Corporate & Investment Banking',
  'Customer Experience',
];

export const REA_DEPT_BY_DIV = {
  'Operations & Process':            ['Operations'],
  'Finance & Treasury':              ['Finance', 'FX Desk'],
  'Risk & Credit':                   ['Credit'],
  'Wealth & Trustee':                ['Trustee Services'],
  'Retail & Digital Banking':        ['Retail Banking'],
  'Corporate & Investment Banking':  ['Investment Banking'],
  'Customer Experience':             ['Contact Centre'],
};

export const REA_DEPARTMENTS = Object.values(REA_DEPT_BY_DIV).flat();

export const REA_TILE_CLASS = {
  'Pending Review':             'tile-pending',
  'Reviewed':                   'tile-reviewed',
  'Prioritized':                'tile-prioritized',
  'Ongoing RVA':                'tile-ongoing',
  'Awaiting RVA':               'tile-awaiting',
  'Adopted - Innovation Council':'tile-adopted',
  'Not Adopted':                'tile-not-adopted',
  'Deprioritized':              'tile-deprioritized',
};

export const REA_STATUS_COLORS = {
  'Pending Review':             '#94a3b8',
  'Reviewed':                   '#3AB3E5',
  'Prioritized':                '#F8E200',
  'Ongoing RVA':                '#00A8A9',
  'Awaiting RVA':               '#9F197E',
  'Adopted - Innovation Council':'#1a8a5a',
  'Not Adopted':                '#E4032C',
  'Deprioritized':              '#c4b5a5',
};

export const REA_STATUS_PILL = {
  'Pending Review':             'pill-pending-review',
  'Reviewed':                   'pill-reviewed',
  'Prioritized':                'pill-prioritized',
  'Ongoing RVA':                'pill-ongoing-rva',
  'Awaiting RVA':               'pill-awaiting-rva',
  'Adopted - Innovation Council':'pill-adopted',
  'Not Adopted':                'pill-not-adopted',
  'Deprioritized':              'pill-deprioritized',
};

export const REA_PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Shared mutable state
// ---------------------------------------------------------------------------

export const reaState = {
  filters: { search: '', status: '', division: '', department: '' },
  sortState: { key: 'dateSubmitted', dir: -1 },
  currentPage: 1,
};

// ---------------------------------------------------------------------------
// Static ideas data
// ---------------------------------------------------------------------------

export const reaIdeas = [
  { id:'REA-001', title:'Automated loan disbursement reconciliation', submitter:'A. Kamau', department:'Operations', division:'Operations & Process', status:'Deployed', dateSubmitted:'2025-11-03', description:'The reconciliation of loan disbursements against core banking entries is done manually each morning. Errors are only caught end-of-day.', feedback:'Deployed as RPA bot. Now runs nightly with exception reports emailed to ops team.' },
  { id:'REA-002', title:'Customer onboarding document checker', submitter:'B. Otieno', department:'Retail Banking', division:'Retail & Digital Banking', status:'Prioritized', dateSubmitted:'2025-11-10', description:'Relationship managers manually verify KYC documents against a checklist before onboarding. This takes 20–40 minutes per customer.', feedback:'Prioritized. AI document classification shortlisted. RVA ongoing.' },
  { id:'REA-003', title:'Branch cash position dashboard', submitter:'C. Mutua', department:'Operations', division:'Operations & Process', status:'Reviewed', dateSubmitted:'2025-11-18', description:'Branch managers call treasury for cash positions every morning. There is no real-time view.', feedback:'Reviewed and passed to BPM. A Power BI dashboard is already in scope under the treasury stream.' },
  { id:'REA-004', title:'FX rate alert for relationship managers', submitter:'D. Njoroge', department:'FX Desk', division:'Finance & Treasury', status:'Ongoing RVA', dateSubmitted:'2025-12-01', description:'RMs manually check FX rates before calling clients. They miss rate windows that would have been beneficial to clients.', feedback:'RVA ongoing. Feasibility confirmed — evaluating Power Automate vs custom app.' },
  { id:'REA-005', title:'Automated NSSF/NHIF deduction reports', submitter:'E. Wanjiru', department:'Finance', division:'Finance & Treasury', status:'Adopted - Innovation Council', dateSubmitted:'2025-12-09', description:'Payroll deduction reports for statutory bodies are compiled manually from multiple spreadsheets every month.', feedback:'Adopted by Innovation Council. Fast-tracked — statutory deadline risk.' },
  { id:'REA-006', title:'Credit limit review reminder bot', submitter:'F. Ochieng', department:'Credit', division:'Risk & Credit', status:'Awaiting RVA', dateSubmitted:'2025-12-14', description:'Credit limit reviews fall overdue because there is no automated reminder system. Reviewers rely on calendar entries.', feedback:'' },
  { id:'REA-007', title:'Trustee fee calculation automation', submitter:'G. Kaminde', department:'Trustee Services', division:'Wealth & Trustee', status:'Not Adopted', dateSubmitted:'2026-01-05', description:'Trustee fees are calculated monthly using an Excel model that requires manual inputs from three systems.', feedback:'Not adopted at this stage — legacy trustee system replacement already planned for Q3. Will revisit post-migration.' },
  { id:'REA-008', title:'Digital account opening status tracker', submitter:'H. Muthoni', department:'Retail Banking', division:'Retail & Digital Banking', status:'Deprioritized', dateSubmitted:'2026-01-12', description:'Customers opening accounts digitally have no visibility of where their application stands. Branch staff field many status calls.', feedback:'Deprioritized. CX team has a similar initiative already in the pipeline under a different stream.' },
  { id:'REA-009', title:'Automated cheque clearing exception report', submitter:'I. Kariuki', department:'Operations', division:'Operations & Process', status:'Pending Review', dateSubmitted:'2026-01-20', description:'Cheque clearing exceptions are identified manually by reviewing transaction logs. This takes two hours daily.', feedback:'' },
  { id:'REA-010', title:'Supplier invoice matching bot', submitter:'J. Kiprotich', department:'Finance', division:'Finance & Treasury', status:'Reviewed', dateSubmitted:'2026-01-28', description:'Accounts payable team manually matches supplier invoices to purchase orders across two systems. Mismatches are common.', feedback:'Reviewed. Strong RPA candidate. Awaiting volume data from AP team before prioritisation.' },
  { id:'REA-011', title:'Real-time ATM cash level monitor', submitter:'K. Achieng', department:'Operations', division:'Operations & Process', status:'Prioritized', dateSubmitted:'2026-02-04', description:'ATM cash levels are checked on a schedule. Machines run out between checks, causing customer complaints.', feedback:'Prioritized. Integration with ATM management system confirmed feasible.' },
  { id:'REA-012', title:'Staff leave balance self-service', submitter:'L. Waweru', department:'Operations', division:'Operations & Process', status:'Ongoing RVA', dateSubmitted:'2026-02-11', description:'Staff call HR to check leave balances. HR spends significant time on these queries each week.', feedback:'RVA ongoing. HR system API availability under assessment.' },
  { id:'REA-013', title:'Automated regulatory report compiler', submitter:'M. Githinji', department:'Credit', division:'Risk & Credit', status:'Adopted - Innovation Council', dateSubmitted:'2026-02-18', description:'Monthly regulatory submissions require data pulled from six systems and formatted manually. Errors have caused CBK queries.', feedback:'Adopted. Regulatory risk classified as high. Innovation Council approved immediate resourcing.' },
  { id:'REA-014', title:'Investment portfolio rebalancing alerts', submitter:'N. Odhiambo', department:'Trustee Services', division:'Wealth & Trustee', status:'Awaiting RVA', dateSubmitted:'2026-02-25', description:'Portfolio managers manually check asset allocations against mandates weekly. Drift is often spotted too late.', feedback:'' },
  { id:'REA-015', title:'Dormant account reactivation workflow', submitter:'O. Chebet', department:'Retail Banking', division:'Retail & Digital Banking', status:'Not Adopted', dateSubmitted:'2026-03-04', description:'Reactivating dormant accounts requires manual processing and supervisor approval across three queues.', feedback:'Not adopted — dormant account process is being redesigned under the core banking upgrade project.' },
  { id:'REA-016', title:'Trade finance document tracking', submitter:'P. Mutiso', department:'Investment Banking', division:'Corporate & Investment Banking', status:'Pending Review', dateSubmitted:'2026-03-11', description:'Trade finance documents move between teams via email. There is no central tracking system and documents are sometimes lost.', feedback:'' },
  { id:'REA-017', title:'Automated interest accrual checker', submitter:'Q. Njeru', department:'Finance', division:'Finance & Treasury', status:'Reviewed', dateSubmitted:'2026-03-18', description:'Interest accruals are verified manually against the general ledger every day before close. This takes one accountant three hours.', feedback:'Reviewed. Passed to BPM — aligns with the GL reconciliation bot already in build.' },
  { id:'REA-018', title:'Customer complaint SLA monitor', submitter:'R. Onyango', department:'Contact Centre', division:'Customer Experience', status:'Prioritized', dateSubmitted:'2026-03-25', description:'Complaint resolution SLAs are tracked in a spreadsheet. Breaches are only noticed when the spreadsheet is reviewed manually.', feedback:'Prioritized. CRM integration confirmed. Design sprint scheduled.' },
  { id:'REA-019', title:'Branch performance scorecard automation', submitter:'S. Mwaura', department:'Retail Banking', division:'Retail & Digital Banking', status:'Ongoing RVA', dateSubmitted:'2026-04-01', description:'Branch scorecards are compiled manually from five data sources each month. The process takes three days.', feedback:'RVA in progress. Data source mapping underway.' },
  { id:'REA-020', title:'Treasury position report bot', submitter:'T. Korir', department:'FX Desk', division:'Finance & Treasury', status:'Adopted - Innovation Council', dateSubmitted:'2026-04-08', description:'The daily treasury position report is manually assembled from Reuters, Bloomberg, and internal systems each morning.', feedback:'Adopted. Innovation Council noted the 3-hour daily time saving as compelling.' },
  { id:'REA-021', title:'Automated credit bureau batch submission', submitter:'U. Wangari', department:'Credit', division:'Risk & Credit', status:'Awaiting RVA', dateSubmitted:'2026-04-15', description:'Monthly credit bureau submissions are done manually. Each submission takes a full day and errors lead to bureau disputes.', feedback:'' },
  { id:'REA-022', title:'Loan covenant breach detector', submitter:'V. Ogutu', department:'Credit', division:'Risk & Credit', status:'Deprioritized', dateSubmitted:'2026-04-22', description:'Covenant compliance is checked quarterly by relationship managers reviewing each loan file manually.', feedback:'Deprioritized this cycle — credit risk team capacity constrained. Revisit in Q4.' },
  { id:'REA-023', title:'E-statement delivery failure tracker', submitter:'W. Kimani', department:'Retail Banking', division:'Retail & Digital Banking', status:'Pending Review', dateSubmitted:'2026-04-29', description:'E-statements that fail to deliver are not tracked. Customers only realise they missed statements when they call in.', feedback:'' },
  { id:'REA-024', title:'Automated PAYE reconciliation', submitter:'X. Adhiambo', department:'Finance', division:'Finance & Treasury', status:'Reviewed', dateSubmitted:'2026-05-06', description:'PAYE reconciliation between payroll output and KRA records is done manually every month end. Discrepancies take days to resolve.', feedback:'Reviewed. Strong candidate — clear rules, high volume, time-sensitive. Prioritisation pending capacity.' },
  { id:'REA-025', title:'Digital lending disbursement tracker', submitter:'Y. Njenga', department:'Retail Banking', division:'Retail & Digital Banking', status:'Prioritized', dateSubmitted:'2026-05-13', description:'Digital loan disbursements are tracked in a spreadsheet that is updated manually from M-Pesa and T24 logs.', feedback:'Prioritized. RPA bot design started.' },
  { id:'REA-026', title:'Automated board paper reminder', submitter:'Z. Cheruiyot', department:'Operations', division:'Operations & Process', status:'Ongoing RVA', dateSubmitted:'2026-05-20', description:'Board secretariat sends manual reminders for board paper submissions. Submissions are frequently late.', feedback:'RVA ongoing. Aligned with existing board paper workflow initiative in pipeline.' },
  { id:'REA-027', title:'Contract renewal alert system', submitter:'A. Ndungu', department:'Finance', division:'Finance & Treasury', status:'Adopted - Innovation Council', dateSubmitted:'2026-05-27', description:'Vendor contracts are tracked in Excel. Renewals are missed because there is no automated alert system.', feedback:'Adopted. Straightforward automation with clear financial exposure risk.' },
  { id:'REA-028', title:'Risk appetite breach notifier', submitter:'B. Chege', department:'Credit', division:'Risk & Credit', status:'Prioritized', dateSubmitted:'2026-07-05', description:'Risk appetite breaches are identified during manual monthly reviews. By then it is often too late to take corrective action.', feedback:'Prioritized. Real-time monitoring dashboard with automated alerts. Fast-tracked given risk exposure.' },
  { id:'REA-029', title:'Staff training completion tracker', submitter:'C. Mutuku', department:'Operations', division:'Operations & Process', status:'Pending Review', dateSubmitted:'2026-07-09', description:'Compliance requires all staff to complete mandatory training by set dates. Tracking completion is done manually by team leads.', feedback:'' },
  { id:'REA-030', title:'SWIFT message reconciler', submitter:'D. Kamau', department:'FX Desk', division:'Finance & Treasury', status:'Reviewed', dateSubmitted:'2026-07-12', description:'Incoming SWIFT messages are manually matched to expected transactions. Volume is increasing and reconciliation takes half a day.', feedback:'Reviewed. RPA candidate — well-structured process with clear rules. High priority given volume growth.' },
];