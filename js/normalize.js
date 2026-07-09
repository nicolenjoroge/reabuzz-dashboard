// ---------------------------------------------------------------------------
// Text / data normalization
// ---------------------------------------------------------------------------

export function normalizeText(value) {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.filter(Boolean).join(' • ');
  return String(value).trim();
}

export function pickQuantBenefit(costSavings, paperSavings, manHours, tat) {
  const fmtCurrency = (n) => 'KES ' + Number(n).toLocaleString('en-US');
  if (costSavings > 0) return { text: `${fmtCurrency(costSavings)} cost savings`,       type: 'Cost Savings' };
  if (paperSavings > 0) return { text: `${fmtCurrency(paperSavings)} paper cost savings`, type: 'Paper Savings' };
  if (manHours > 0)    return { text: `${manHours.toLocaleString('en-US')} man hrs saved`,     type: 'Man Hours' };
  if (tat > 0)         return { text: `${tat.toLocaleString('en-US')} hrs TAT reduction`,      type: 'TAT Reduction' };
  return { text: '', type: '' };
}

export function normalizeInitiative(item) {
  const status      = normalizeText(item.status || item.Status || item.stage || 'Analysis');
  const vertical    = normalizeText(item.vertical || item.Vertical || item.delivery_stream || item.sectionId || 'Enterprise');
  const department  = normalizeText(item.department || item.Department || 'Operations');
  const division    = normalizeText(item.division || item.Division || 'Operations & Process');
  const name        = normalizeText(item.name || item.Name || item.initiative_name || 'Untitled initiative');
  const solution    = normalizeText(item.solution || item.Solution || item.description || '');
  const qual        = normalizeText(item.qual || item.qualitative_benefit || item.qualitative_benefits || item.qualitative || '');
  const country     = normalizeText(item.country || item.Country || '');

  const manHours    = Number(item.manHours    || 0) || 0;
  const tat         = Number(item.tat         || 0) || 0;
  const costSavings = Number(item.costSavings || 0) || 0;
  const paperSavings= Number(item.paperSavings|| 0) || 0;

  const { text: quant, type: quantType } = pickQuantBenefit(costSavings, paperSavings, manHours, tat);

  return {
    nexusId: normalizeText(item.nexusId || item.nexus_id || item.id || ''),
    name, department, division, status, vertical,
    solution, quant, quantType, qual,
    manHours, tat, costSavings, paperSavings, country,
  };
}
