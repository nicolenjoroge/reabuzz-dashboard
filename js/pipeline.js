// ---------------------------------------------------------------------------
// REA Pipeline tree — expand/collapse interactions
// ---------------------------------------------------------------------------

export function toggleReaTree(el) {
  const item = el.closest('.rt-item');
  item.classList.toggle('open');
  const chev = el.querySelector('.rt-chev');
  chev.textContent = item.classList.contains('open') ? '⌄' : '›';
}

export function toggleReaPipeline() {
  const card  = document.getElementById('reaPipelineCard');
  const label = document.getElementById('reaPipelineToggleLabel');
  const expanded = card.classList.toggle('expanded');
  label.textContent = expanded ? 'Close' : 'Expand';
}
