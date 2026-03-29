import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './BrowseInventions.css';

const BrowseInventions = () => {
  const { user } = useAuth();
  const [inventions, setInventions] = useState([]);
  const [filteredInventions, setFilteredInventions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    stage: 'all',
    prototypeStatus: 'all',
    authority: 'all'
  });
  const [selectedInvention, setSelectedInvention] = useState(null);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('inventionPosts') || '[]');
    setInventions(posts);
    setFilteredInventions(posts);
  }, []);

  useEffect(() => {
    let filtered = inventions;

    if (filters.search) {
      filtered = filtered.filter(inv =>
        inv.patentId.toLowerCase().includes(filters.search.toLowerCase()) ||
        inv.problemSolved.toLowerCase().includes(filters.search.toLowerCase()) ||
        inv.patentProtects.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.stage !== 'all') {
      filtered = filtered.filter(inv => inv.currentStage === filters.stage);
    }

    if (filters.prototypeStatus !== 'all') {
      filtered = filtered.filter(inv => inv.prototypeStatus === filters.prototypeStatus);
    }

    if (filters.authority !== 'all') {
      filtered = filtered.filter(inv => inv.issuingAuthority === filters.authority);
    }

    setFilteredInventions(filtered);
  }, [filters, inventions]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const openDetails = (invention) => {
    setSelectedInvention(invention);
  };

  const closeDetails = () => {
    setSelectedInvention(null);
  };

  const contactInventor = (invention) => {
    if (invention.contactMethod === 'linkedin' || invention.contactMethod === 'both') {
      window.open(invention.linkedInProfile, '_blank');
    } else {
      window.location.href = `mailto:${invention.inventorEmail}`;
    }
  };

  return React.createElement('div', { className: 'browse-inventions-page' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'page-header fade-in' },
        React.createElement('h1', null, 'Browse Patent-Backed Innovations'),
        React.createElement('p', null, 'Discover breakthrough technologies ready for investment')
      ),

      React.createElement('div', { className: 'filters-section slide-in-right' },
        React.createElement('div', { className: 'filter-group' },
          React.createElement('input', {
            type: 'text',
            name: 'search',
            value: filters.search,
            onChange: handleFilterChange,
            placeholder: 'Search patents, problems, technologies...',
            className: 'search-input'
          })
        ),

        React.createElement('div', { className: 'filter-grid' },
          React.createElement('div', { className: 'filter-group' },
            React.createElement('label', null, 'Development Stage'),
            React.createElement('select', { name: 'stage', value: filters.stage, onChange: handleFilterChange },
              React.createElement('option', { value: 'all' }, 'All Stages'),
              React.createElement('option', { value: 'idea' }, 'Idea'),
              React.createElement('option', { value: 'prototype' }, 'Prototype'),
              React.createElement('option', { value: 'early-customers' }, 'Early Customers'),
              React.createElement('option', { value: 'revenue' }, 'Revenue Generating')
            )
          ),

          React.createElement('div', { className: 'filter-group' },
            React.createElement('label', null, 'Prototype Status'),
            React.createElement('select', { name: 'prototypeStatus', value: filters.prototypeStatus, onChange: handleFilterChange },
              React.createElement('option', { value: 'all' }, 'All Statuses'),
              React.createElement('option', { value: 'idea' }, 'Idea'),
              React.createElement('option', { value: 'prototype' }, 'Prototype'),
              React.createElement('option', { value: 'mvp' }, 'MVP'),
              React.createElement('option', { value: 'production-ready' }, 'Production-Ready')
            )
          ),

          React.createElement('div', { className: 'filter-group' },
            React.createElement('label', null, 'Patent Authority'),
            React.createElement('select', { name: 'authority', value: filters.authority, onChange: handleFilterChange },
              React.createElement('option', { value: 'all' }, 'All Authorities'),
              React.createElement('option', { value: 'USPTO' }, 'USPTO'),
              React.createElement('option', { value: 'EPO' }, 'EPO'),
              React.createElement('option', { value: 'WIPO' }, 'WIPO'),
              React.createElement('option', { value: 'India IPO' }, 'India IPO')
            )
          )
        )
      ),

      React.createElement('div', { className: 'results-info' },
        React.createElement('p', null,
          filteredInventions.length,
          ' invention',
          filteredInventions.length !== 1 ? 's' : '',
          ' found'
        )
      ),

      filteredInventions.length === 0
        ? React.createElement('div', { className: 'no-results' },
            React.createElement('div', { className: 'no-results-icon' }, '🔍'),
            React.createElement('h3', null, 'No inventions found'),
            React.createElement('p', null, 'Try adjusting your filters or search criteria')
          )
        : React.createElement('div', { className: 'inventions-grid' },
            filteredInventions.map((invention, index) =>
              React.createElement('div', {
                key: invention.id,
                className: 'invention-card scale-in',
                style: { animationDelay: `${index * 0.05}s` },
                onClick: () => openDetails(invention)
              },
                React.createElement('div', { className: 'card-header' },
                  React.createElement('div', { className: 'patent-badge' }, invention.issuingAuthority),
                  React.createElement('div', { className: 'stage-badge' }, invention.currentStage)
                ),

                React.createElement('div', { className: 'card-body' },
                  React.createElement('h3', null, invention.patentId),
                  React.createElement('p', { className: 'problem-brief' }, invention.problemSolved),

                  React.createElement('div', { className: 'card-meta' },
                    React.createElement('div', { className: 'meta-item' },
                      React.createElement('span', { className: 'meta-label' }, 'Prototype:'),
                      React.createElement('span', { className: 'meta-value' }, invention.prototypeStatus)
                    ),
                    React.createElement('div', { className: 'meta-item' },
                      React.createElement('span', { className: 'meta-label' }, 'Funding Needed:'),
                      React.createElement('span', { className: 'meta-value' }, invention.fundingRequired)
                    )
                  ),

                  React.createElement('div', { className: 'card-tags' },
                    invention.lookingFor.map(item =>
                      React.createElement('span', { key: item, className: 'tag' }, item)
                    )
                  )
                ),

                React.createElement('div', { className: 'card-footer' },
                  React.createElement('div', { className: 'inventor-info' },
                    React.createElement('div', { className: 'inventor-avatar' },
                      invention.inventorName.split(' ').map(n => n[0]).join('')
                    ),
                    React.createElement('div', { className: 'inventor-details' },
                      React.createElement('div', { className: 'inventor-name' }, invention.inventorName),
                      React.createElement('div', { className: 'inventor-location' }, invention.location)
                    )
                  ),
                  React.createElement('button', { className: 'btn-view-details' }, 'View Details →')
                )
              )
            )
          ),

      selectedInvention && React.createElement('div', { className: 'modal-overlay', onClick: closeDetails },
        React.createElement('div', { className: 'modal-content', onClick: (e) => e.stopPropagation() },
          React.createElement('button', { className: 'modal-close', onClick: closeDetails }, '×'),

          React.createElement('div', { className: 'modal-header' },
            React.createElement('h2', null, selectedInvention.patentId),
            React.createElement('div', { className: 'modal-badges' },
              React.createElement('span', { className: 'badge badge-primary' }, selectedInvention.issuingAuthority),
              React.createElement('span', { className: 'badge badge-secondary' }, selectedInvention.patentStatus)
            )
          ),

          React.createElement('div', { className: 'modal-body' },
            React.createElement('section', { className: 'detail-section' },
              React.createElement('h3', null, 'Problem & Solution'),
              React.createElement('p', null, React.createElement('strong', null, 'Problem:'), ' ', selectedInvention.problemSolved),
              React.createElement('p', null, React.createElement('strong', null, 'Solution:'), ' ', selectedInvention.patentProtects),
              React.createElement('p', null, React.createElement('strong', null, 'Target Audience:'), ' ', selectedInvention.targetAudience)
            ),

            React.createElement('section', { className: 'detail-section' },
              React.createElement('h3', null, 'Technology'),
              React.createElement('p', null, React.createElement('strong', null, 'Key Claims:'), ' ', selectedInvention.keyClaims),
              selectedInvention.technologyStack &&
                React.createElement('p', null, React.createElement('strong', null, 'Technology Stack:'), ' ', selectedInvention.technologyStack),
              React.createElement('p', null, React.createElement('strong', null, 'Prototype Status:'), ' ', selectedInvention.prototypeStatus)
            ),

            React.createElement('section', { className: 'detail-section' },
              React.createElement('h3', null, 'Business Model'),
              React.createElement('p', null, React.createElement('strong', null, 'Business Model:'), ' ', selectedInvention.businessModel),
              React.createElement('p', null, React.createElement('strong', null, 'Current Stage:'), ' ', selectedInvention.currentStage),
              React.createElement('p', null, React.createElement('strong', null, 'Competitive Advantage:'), ' ', selectedInvention.competitiveAdvantage)
            ),

            React.createElement('section', { className: 'detail-section' },
              React.createElement('h3', null, 'Market Opportunity'),
              selectedInvention.marketSize.tam &&
                React.createElement('p', null, React.createElement('strong', null, 'TAM:'), ' ', selectedInvention.marketSize.tam),
              selectedInvention.marketSize.sam &&
                React.createElement('p', null, React.createElement('strong', null, 'SAM:'), ' ', selectedInvention.marketSize.sam),
              selectedInvention.marketSize.som &&
                React.createElement('p', null, React.createElement('strong', null, 'SOM:'), ' ', selectedInvention.marketSize.som),
              React.createElement('p', null, React.createElement('strong', null, 'Why Now:'), ' ', selectedInvention.whyNow)
            ),

            React.createElement('section', { className: 'detail-section' },
              React.createElement('h3', null, 'Financials'),
              React.createElement('p', null, React.createElement('strong', null, 'Funding Required:'), ' ', selectedInvention.fundingRequired),
              React.createElement('p', null, React.createElement('strong', null, 'Use of Funds:'), ' ', selectedInvention.useOfFunds),
              selectedInvention.productValuation &&
                React.createElement('p', null, React.createElement('strong', null, 'Current Valuation:'), ' ', selectedInvention.productValuation),
              selectedInvention.futureValuation &&
                React.createElement('p', null, React.createElement('strong', null, 'Projected Valuation:'), ' ', selectedInvention.futureValuation)
            ),

            (selectedInvention.pitchDeckLink || selectedInvention.demoVideoLink || selectedInvention.googlePatentsLink) &&
              React.createElement('section', { className: 'detail-section' },
                React.createElement('h3', null, 'Resources'),
                selectedInvention.googlePatentsLink &&
                  React.createElement('p', null,
                    React.createElement('a', { href: selectedInvention.googlePatentsLink, target: '_blank', rel: 'noopener noreferrer' },
                      'View Patent on Google Patents →'
                    )
                  ),
                selectedInvention.pitchDeckLink &&
                  React.createElement('p', null,
                    React.createElement('a', { href: selectedInvention.pitchDeckLink, target: '_blank', rel: 'noopener noreferrer' },
                      'View Pitch Deck →'
                    )
                  ),
                selectedInvention.demoVideoLink &&
                  React.createElement('p', null,
                    React.createElement('a', { href: selectedInvention.demoVideoLink, target: '_blank', rel: 'noopener noreferrer' },
                      'Watch Demo Video →'
                    )
                  )
              ),

            React.createElement('section', { className: 'detail-section inventor-section' },
              React.createElement('h3', null, 'Inventor'),
              React.createElement('div', { className: 'inventor-profile' },
                React.createElement('div', { className: 'inventor-avatar large' },
                  selectedInvention.inventorName.split(' ').map(n => n[0]).join('')
                ),
                React.createElement('div', null,
                  React.createElement('h4', null, selectedInvention.inventorName),
                  React.createElement('p', null, selectedInvention.backgroundSummary),
                  React.createElement('p', null, React.createElement('strong', null, 'Location:'), ' ', selectedInvention.location)
                )
              )
            ),

            React.createElement('div', { className: 'modal-actions' },
              React.createElement('button', {
                className: 'btn-contact',
                onClick: () => contactInventor(selectedInvention)
              }, 'Contact Inventor')
            )
          )
        )
      )
    )
  );
};

export default BrowseInventions;