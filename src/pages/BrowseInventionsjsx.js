// BrowseInventions.js — Vanilla JavaScript (no React/JSX)
// Replaces the React component with plain DOM manipulation.
// Usage: call initBrowseInventions('#app') where '#app' is your mount selector.

function initBrowseInventions(mountSelector) {
  const root = document.querySelector(mountSelector);
  if (!root) {
    console.error('BrowseInventions: mount element not found:', mountSelector);
    return;
  }

  // ── State ────────────────────────────────────────────────────────────────
  let inventions = [];
  let filteredInventions = [];
  let selectedInvention = null;

  const filters = {
    search: '',
    stage: 'all',
    prototypeStatus: 'all',
    authority: 'all',
  };

  // ── Data loading ─────────────────────────────────────────────────────────
  function loadInventions() {
    const posts = JSON.parse(localStorage.getItem('inventionPosts') || '[]');
    inventions = posts;
    filteredInventions = posts;
  }

  // ── Filtering ─────────────────────────────────────────────────────────────
  function applyFilters() {
    let result = inventions;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.patentId.toLowerCase().includes(q) ||
          inv.problemSolved.toLowerCase().includes(q) ||
          inv.patentProtects.toLowerCase().includes(q)
      );
    }

    if (filters.stage !== 'all') {
      result = result.filter((inv) => inv.currentStage === filters.stage);
    }

    if (filters.prototypeStatus !== 'all') {
      result = result.filter(
        (inv) => inv.prototypeStatus === filters.prototypeStatus
      );
    }

    if (filters.authority !== 'all') {
      result = result.filter(
        (inv) => inv.issuingAuthority === filters.authority
      );
    }

    filteredInventions = result;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function initials(name) {
    return (name || '')
      .split(' ')
      .map((n) => n[0])
      .join('');
  }

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === 'className') {
          node.className = v;
        } else if (k === 'style' && typeof v === 'object') {
          Object.assign(node.style, v);
        } else if (k.startsWith('on') && typeof v === 'function') {
          node.addEventListener(k.slice(2).toLowerCase(), v);
        } else {
          node.setAttribute(k, v);
        }
      });
    }
    children.flat().forEach((child) => {
      if (child == null) return;
      node.appendChild(
        typeof child === 'string' ? document.createTextNode(child) : child
      );
    });
    return node;
  }

  // ── Contact inventor ──────────────────────────────────────────────────────
  function contactInventor(invention) {
    if (
      invention.contactMethod === 'linkedin' ||
      invention.contactMethod === 'both'
    ) {
      window.open(invention.linkedInProfile, '_blank');
    } else {
      window.location.href = `mailto:${invention.inventorEmail}`;
    }
  }

  // ── Modal ─────────────────────────────────────────────────────────────────
  function closeDetails() {
    selectedInvention = null;
    const overlay = root.querySelector('.modal-overlay');
    if (overlay) overlay.remove();
  }

  function openDetails(invention) {
    selectedInvention = invention;
    renderModal();
  }

  function detailRow(label, value) {
    if (!value) return null;
    return el('p', null,
      el('strong', null, `${label}: `),
      `${value}`
    );
  }

  function renderModal() {
    // Remove any existing modal
    const existing = root.querySelector('.modal-overlay');
    if (existing) existing.remove();

    const inv = selectedInvention;
    if (!inv) return;

    const overlay = el('div', {
      className: 'modal-overlay',
      onClick: closeDetails,
    });

    const content = el('div', {
      className: 'modal-content',
      onClick: (e) => e.stopPropagation(),
    });

    // Close button
    content.appendChild(
      el('button', { className: 'modal-close', onClick: closeDetails }, '×')
    );

    // Header
    const header = el('div', { className: 'modal-header' },
      el('h2', null, inv.patentId),
      el('div', { className: 'modal-badges' },
        el('span', { className: 'badge badge-primary' }, inv.issuingAuthority),
        el('span', { className: 'badge badge-secondary' }, inv.patentStatus)
      )
    );
    content.appendChild(header);

    // Body
    const body = el('div', { className: 'modal-body' });

    // Problem & Solution
    const sec1 = el('section', { className: 'detail-section' },
      el('h3', null, 'Problem & Solution'),
      detailRow('Problem', inv.problemSolved),
      detailRow('Solution', inv.patentProtects),
      detailRow('Target Audience', inv.targetAudience)
    );
    body.appendChild(sec1);

    // Technology
    const sec2 = el('section', { className: 'detail-section' },
      el('h3', null, 'Technology'),
      detailRow('Key Claims', inv.keyClaims),
      inv.technologyStack ? detailRow('Technology Stack', inv.technologyStack) : null,
      detailRow('Prototype Status', inv.prototypeStatus)
    );
    body.appendChild(sec2);

    // Business Model
    const sec3 = el('section', { className: 'detail-section' },
      el('h3', null, 'Business Model'),
      detailRow('Business Model', inv.businessModel),
      detailRow('Current Stage', inv.currentStage),
      detailRow('Competitive Advantage', inv.competitiveAdvantage)
    );
    body.appendChild(sec3);

    // Market Opportunity
    const sec4 = el('section', { className: 'detail-section' },
      el('h3', null, 'Market Opportunity'),
      inv.marketSize?.tam ? detailRow('TAM', inv.marketSize.tam) : null,
      inv.marketSize?.sam ? detailRow('SAM', inv.marketSize.sam) : null,
      inv.marketSize?.som ? detailRow('SOM', inv.marketSize.som) : null,
      detailRow('Why Now', inv.whyNow)
    );
    body.appendChild(sec4);

    // Financials
    const sec5 = el('section', { className: 'detail-section' },
      el('h3', null, 'Financials'),
      detailRow('Funding Required', inv.fundingRequired),
      detailRow('Use of Funds', inv.useOfFunds),
      inv.productValuation ? detailRow('Current Valuation', inv.productValuation) : null,
      inv.futureValuation ? detailRow('Projected Valuation', inv.futureValuation) : null
    );
    body.appendChild(sec5);

    // Resources
    if (inv.googlePatentsLink || inv.pitchDeckLink || inv.demoVideoLink) {
      const sec6 = el('section', { className: 'detail-section' },
        el('h3', null, 'Resources')
      );
      if (inv.googlePatentsLink) {
        sec6.appendChild(
          el('p', null,
            el('a', { href: inv.googlePatentsLink, target: '_blank', rel: 'noopener noreferrer' },
              'View Patent on Google Patents →'
            )
          )
        );
      }
      if (inv.pitchDeckLink) {
        sec6.appendChild(
          el('p', null,
            el('a', { href: inv.pitchDeckLink, target: '_blank', rel: 'noopener noreferrer' },
              'View Pitch Deck →'
            )
          )
        );
      }
      if (inv.demoVideoLink) {
        sec6.appendChild(
          el('p', null,
            el('a', { href: inv.demoVideoLink, target: '_blank', rel: 'noopener noreferrer' },
              'Watch Demo Video →'
            )
          )
        );
      }
      body.appendChild(sec6);
    }

    // Inventor
    const sec7 = el('section', { className: 'detail-section inventor-section' },
      el('h3', null, 'Inventor'),
      el('div', { className: 'inventor-profile' },
        el('div', { className: 'inventor-avatar large' }, initials(inv.inventorName)),
        el('div', null,
          el('h4', null, inv.inventorName),
          el('p', null, inv.backgroundSummary),
          el('p', null,
            el('strong', null, 'Location: '),
            inv.location
          )
        )
      )
    );
    body.appendChild(sec7);

    // Actions
    const actions = el('div', { className: 'modal-actions' });
    const contactBtn = el('button', {
      className: 'btn-contact',
      onClick: () => contactInventor(inv),
    }, 'Contact Inventor');
    actions.appendChild(contactBtn);
    body.appendChild(actions);

    content.appendChild(body);
    overlay.appendChild(content);
    root.appendChild(overlay);
  }

  // ── Card rendering ────────────────────────────────────────────────────────
  function renderCard(invention, index) {
    const card = el('div', {
      className: 'invention-card scale-in',
      style: { animationDelay: `${index * 0.05}s` },
      onClick: () => openDetails(invention),
    });

    // Card header
    card.appendChild(
      el('div', { className: 'card-header' },
        el('div', { className: 'patent-badge' }, invention.issuingAuthority),
        el('div', { className: 'stage-badge' }, invention.currentStage)
      )
    );

    // Card body
    const tags = el('div', { className: 'card-tags' });
    (invention.lookingFor || []).forEach((item) => {
      tags.appendChild(el('span', { className: 'tag' }, item));
    });

    card.appendChild(
      el('div', { className: 'card-body' },
        el('h3', null, invention.patentId),
        el('p', { className: 'problem-brief' }, invention.problemSolved),
        el('div', { className: 'card-meta' },
          el('div', { className: 'meta-item' },
            el('span', { className: 'meta-label' }, 'Prototype:'),
            el('span', { className: 'meta-value' }, invention.prototypeStatus)
          ),
          el('div', { className: 'meta-item' },
            el('span', { className: 'meta-label' }, 'Funding Needed:'),
            el('span', { className: 'meta-value' }, invention.fundingRequired)
          )
        ),
        tags
      )
    );

    // Card footer
    card.appendChild(
      el('div', { className: 'card-footer' },
        el('div', { className: 'inventor-info' },
          el('div', { className: 'inventor-avatar' }, initials(invention.inventorName)),
          el('div', { className: 'inventor-details' },
            el('div', { className: 'inventor-name' }, invention.inventorName),
            el('div', { className: 'inventor-location' }, invention.location)
          )
        ),
        el('button', { className: 'btn-view-details' }, 'View Details →')
      )
    );

    return card;
  }

  // ── Full render ───────────────────────────────────────────────────────────
  function render() {
    // Preserve modal if open
    const existingModal = root.querySelector('.modal-overlay');

    root.innerHTML = '';

    // Re-attach modal if it was open
    if (existingModal) root.appendChild(existingModal);

    const container = el('div', { className: 'browse-inventions-page' },
      el('div', { className: 'container' })
    );
    const inner = container.querySelector('.container');

    // Page header
    inner.appendChild(
      el('div', { className: 'page-header fade-in' },
        el('h1', null, 'Browse Patent-Backed Innovations'),
        el('p', null, 'Discover breakthrough technologies ready for investment')
      )
    );

    // Filters
    const filtersSection = el('div', { className: 'filters-section slide-in-right' });

    const searchInput = el('input', {
      type: 'text',
      name: 'search',
      value: filters.search,
      placeholder: 'Search patents, problems, technologies...',
      className: 'search-input',
    });
    searchInput.addEventListener('input', (e) => {
      filters.search = e.target.value;
      applyFilters();
      renderGrid();
      renderResultsInfo();
    });
    filtersSection.appendChild(el('div', { className: 'filter-group' }, searchInput));

    function makeSelect(name, label, options, currentValue) {
      const select = el('select', { name });
      options.forEach(({ value, text }) => {
        const opt = el('option', { value }, text);
        if (value === currentValue) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', (e) => {
        filters[name] = e.target.value;
        applyFilters();
        renderGrid();
        renderResultsInfo();
      });
      return el('div', { className: 'filter-group' },
        el('label', null, label),
        select
      );
    }

    const filterGrid = el('div', { className: 'filter-grid' },
      makeSelect('stage', 'Development Stage', [
        { value: 'all', text: 'All Stages' },
        { value: 'idea', text: 'Idea' },
        { value: 'prototype', text: 'Prototype' },
        { value: 'early-customers', text: 'Early Customers' },
        { value: 'revenue', text: 'Revenue Generating' },
      ], filters.stage),

      makeSelect('prototypeStatus', 'Prototype Status', [
        { value: 'all', text: 'All Statuses' },
        { value: 'idea', text: 'Idea' },
        { value: 'prototype', text: 'Prototype' },
        { value: 'mvp', text: 'MVP' },
        { value: 'production-ready', text: 'Production-Ready' },
      ], filters.prototypeStatus),

      makeSelect('authority', 'Patent Authority', [
        { value: 'all', text: 'All Authorities' },
        { value: 'USPTO', text: 'USPTO' },
        { value: 'EPO', text: 'EPO' },
        { value: 'WIPO', text: 'WIPO' },
        { value: 'India IPO', text: 'India IPO' },
      ], filters.authority)
    );

    filtersSection.appendChild(filterGrid);
    inner.appendChild(filtersSection);

    // Results info placeholder
    const resultsInfo = el('div', { className: 'results-info', id: 'results-info' });
    inner.appendChild(resultsInfo);

    // Grid placeholder
    const gridContainer = el('div', { id: 'grid-container' });
    inner.appendChild(gridContainer);

    root.appendChild(container);

    renderResultsInfo();
    renderGrid();
  }

  function renderResultsInfo() {
    const el2 = root.querySelector('#results-info');
    if (!el2) return;
    const count = filteredInventions.length;
    el2.innerHTML = `<p>${count} invention${count !== 1 ? 's' : ''} found</p>`;
  }

  function renderGrid() {
    const gridContainer = root.querySelector('#grid-container');
    if (!gridContainer) return;
    gridContainer.innerHTML = '';

    if (filteredInventions.length === 0) {
      gridContainer.appendChild(
        el('div', { className: 'no-results' },
          el('div', { className: 'no-results-icon' }, '🔍'),
          el('h3', null, 'No inventions found'),
          el('p', null, 'Try adjusting your filters or search criteria')
        )
      );
    } else {
      const grid = el('div', { className: 'inventions-grid' });
      filteredInventions.forEach((invention, index) => {
        grid.appendChild(renderCard(invention, index));
      });
      gridContainer.appendChild(grid);
    }
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  loadInventions();
  applyFilters();
  render();
}

// Auto-init if a #browse-inventions element exists in the page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#browse-inventions')) {
    initBrowseInventions('#browse-inventions');
  }
});