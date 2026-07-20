import { reaState, reaIdeas, REA_PAGE_SIZE, REA_STATUS_PILL } from './config.js';
import { reaGetFiltered }                                      from './filters.js';
import { reaFmtDate }                                          from './utils.js';

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export function reaRenderTable() {
  let data = reaGetFiltered();

  // Sort
  const { key, dir } = reaState.sortState;
  data = [...data].sort((a, b) => {
    const av = a[key] || '';
    const bv = b[key] || '';
    if (typeof av === 'number') return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });

  const total      = data.length;
  const totalPages = Math.max(1, Math.ceil(total / REA_PAGE_SIZE));
  if (reaState.currentPage > totalPages) reaState.currentPage = totalPages;

  const start    = (reaState.currentPage - 1) * REA_PAGE_SIZE;
  const pageData = data.slice(start, start + REA_PAGE_SIZE);

  const tbody = document.getElementById('reaIdeasTableBody');
  if (!tbody) return;

  if (total === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">No ideas match this filter combination.</td></tr>';
    document.getElementById('reaPaginationWrap').innerHTML = '';
    return;
  }

  tbody.innerHTML = pageData.map(idea => `
    <tr onclick="reaOpenModal('${idea.id}')">
      <td><div class="td-title">${idea.title}</div></td>
      <td>${idea.submitter}</td>
      <td>${idea.department}</td>
      <td style="font-size:12px;color:var(--txt2);">${idea.division}</td>
      <td><span class="pill ${REA_STATUS_PILL[idea.status]}">${idea.status}</span></td>
      <td style="font-size:12px;color:var(--txt2);">${reaFmtDate(idea.dateSubmitted)}</td>
    </tr>
  `).join('');

  reaRenderPagination(total, totalPages);
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

function reaRenderPagination(total, totalPages) {
  const wrap = document.getElementById('reaPaginationWrap');
  if (!wrap) return;
  if (totalPages <= 1) { wrap.innerHTML = ''; return; }

  const page = reaState.currentPage;
  let btns = `<button class="page-btn" onclick="reaGoPage(${page - 1})" ${page === 1 ? 'disabled' : ''}>‹ Prev</button>`;
  for (let p = 1; p <= totalPages; p++) {
    btns += `<button class="page-btn ${p === page ? 'active' : ''}" onclick="reaGoPage(${p})">${p}</button>`;
  }
  btns += `<button class="page-btn" onclick="reaGoPage(${page + 1})" ${page === totalPages ? 'disabled' : ''}>Next ›</button>`;
  wrap.innerHTML = btns;
}

export function reaGoPage(p) {
  const total      = reaGetFiltered().length;
  const totalPages = Math.max(1, Math.ceil(total / REA_PAGE_SIZE));
  reaState.currentPage = Math.max(1, Math.min(totalPages, p));
  reaRenderTable();
}

// ---------------------------------------------------------------------------
// Column sort (called from th onclick in HTML)
// ---------------------------------------------------------------------------

export function reaSort(key) {
  if (reaState.sortState.key === key) {
    reaState.sortState.dir *= -1;
  } else {
    reaState.sortState = { key, dir: 1 };
  }
  reaState.currentPage = 1;
  reaRenderTable();
}

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export function reaOpenModal(id) {
  const idea = reaIdeas.find(i => i.id === id);
  if (!idea) return;

  document.getElementById('reaModalTitle').textContent = idea.title;

  document.getElementById('reaModalMeta').innerHTML = `
    <span class="pill ${REA_STATUS_PILL[idea.status]}">${idea.status}</span>
    <span class="modal-meta-dot"></span>
    <span class="modal-meta-item">${idea.submitter}</span>
    <span class="modal-meta-dot"></span>
    <span class="modal-meta-item">${idea.department}</span>
    <span class="modal-meta-dot"></span>
    <span class="modal-meta-item" style="color:var(--txt2);">${idea.division}</span>
  `;

  const hasFeedback = idea.feedback && idea.feedback.trim().length > 0;
  document.getElementById('reaModalBody').innerHTML = `
    <div class="modal-section">
      <div class="modal-section-label">Description</div>
      <p>${idea.description}</p>
    </div>
    <div class="modal-section">
      <div class="modal-section-label">REA Feedback</div>
      <div class="modal-feedback${hasFeedback ? '' : ' no-feedback'}">
        ${hasFeedback ? idea.feedback : 'No feedback yet — this idea is pending review.'}
      </div>
    </div>
  `;

  document.getElementById('reaModalDate').textContent = `Submitted ${reaFmtDate(idea.dateSubmitted)}`;
  document.getElementById('reaModalId').textContent   = idea.id;

  document.getElementById('reaModalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

export function reaCloseModal(e) {
  const overlay = document.getElementById('reaModalOverlay');
  if (e && e.target !== overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}