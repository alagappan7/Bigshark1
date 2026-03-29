import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BrowseInventions.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inventions, setInventions] = useState([]);
  const [selectedInvention, setSelectedInvention] = useState(null);

  useEffect(() => {
    const allPosts = JSON.parse(localStorage.getItem('inventionPosts') || '[]');
    const myInventions = allPosts.filter(inv => inv.inventorId === user.id);

    const interests = JSON.parse(localStorage.getItem('inventionInterests') || '{}');
    const likes = JSON.parse(localStorage.getItem('inventionLikes') || '{}');

    const enriched = myInventions.map(inv => ({
      ...inv,
      likeCount: likes[inv.id] || 0,
      interestCount: interests[inv.id] || 0
    }));

    setInventions(enriched);
  }, [user.id]);

  const openDetails = (invention) => {
    setSelectedInvention(invention);
  };

  const closeDetails = () => {
    setSelectedInvention(null);
  };

  const deleteInvention = (id) => {
    if (!window.confirm('Are you sure you want to delete this invention?')) return;
    const allPosts = JSON.parse(localStorage.getItem('inventionPosts') || '[]');
    const updated = allPosts.filter(inv => inv.id !== id);
    localStorage.setItem('inventionPosts', JSON.stringify(updated));
    setInventions(prev => prev.filter(inv => inv.id !== id));
    if (selectedInvention?.id === id) setSelectedInvention(null);
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
        React.createElement('h1', null, `Welcome, ${user.firstName}`),
        React.createElement('p', null, 'Manage your posted inventions and track investor interest')
      ),

      // Stats bar
      React.createElement('div', { className: 'filter-grid fade-in', style: { marginBottom: '2rem' } },
        React.createElement('div', { className: 'form-group', style: { textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: '600', color: 'var(--primary-color, #2563eb)' } },
            inventions.length
          ),
          React.createElement('div', { style: { fontSize: '0.875rem', color: '#6b7280' } }, 'Inventions Posted')
        ),
        React.createElement('div', { className: 'form-group', style: { textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: '600', color: 'var(--primary-color, #2563eb)' } },
            inventions.reduce((sum, inv) => sum + inv.likeCount, 0)
          ),
          React.createElement('div', { style: { fontSize: '0.875rem', color: '#6b7280' } }, 'Total Likes')
        ),
        React.createElement('div', { className: 'form-group', style: { textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '2rem', fontWeight: '600', color: 'var(--primary-color, #2563eb)' } },
            inventions.reduce((sum, inv) => sum + inv.interestCount, 0)
          ),
          React.createElement('div', { style: { fontSize: '0.875rem', color: '#6b7280' } }, 'Investor Interests')
        ),
        React.createElement('div', { className: 'form-group', style: { display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          React.createElement('button', {
            className: 'btn-submit',
            onClick: () => navigate('/post-invention')
          }, '+ Post New Invention')
        )
      ),

      React.createElement('div', { className: 'results-info' },
        React.createElement('p', null,
          inventions.length,
          ' invention',
          inventions.length !== 1 ? 's' : '',
          ' posted'
        )
      ),

      inventions.length === 0
        ? React.createElement('div', { className: 'no-results' },
            React.createElement('div', { className: 'no-results-icon' }, '💡'),
            React.createElement('h3', null, 'No inventions posted yet'),
            React.createElement('p', null, 'Share your first patented innovation with potential investors'),
            React.createElement('button', {
              className: 'btn-submit',
              style: { marginTop: '1rem' },
              onClick: () => navigate('/post-invention')
            }, '+ Post Your First Invention')
          )
        : React.createElement('div', { className: 'inventions-grid' },
            inventions.map((invention, index) =>
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

                  React.createElement('div', { className: 'card-meta', style: { marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #f0f0f0' } },
                    React.createElement('div', { className: 'meta-item' },
                      React.createElement('span', { className: 'meta-label' }, '👍 Likes:'),
                      React.createElement('span', { className: 'meta-value' }, invention.likeCount)
                    ),
                    React.createElement('div', { className: 'meta-item' },
                      React.createElement('span', { className: 'meta-label' }, '🤝 Interests:'),
                      React.createElement('span', { className: 'meta-value' }, invention.interestCount)
                    )
                  ),

                  React.createElement('div', { className: 'card-tags' },
                    (invention.lookingFor || []).map(item =>
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
                  React.createElement('div', { style: { display: 'flex', gap: '0.5rem' } },
                    React.createElement('button', {
                      className: 'btn-view-details',
                      onClick: (e) => { e.stopPropagation(); deleteInvention(invention.id); }
                    }, 'Delete'),
                    React.createElement('button', { className: 'btn-view-details' }, 'View →')
                  )
                )
              )
            )
          ),

      // Detail Modal
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
              React.createElement('h3', null, 'Engagement'),
              React.createElement('div', { className: 'card-meta' },
                React.createElement('div', { className: 'meta-item' },
                  React.createElement('span', { className: 'meta-label' }, '👍 Likes:'),
                  React.createElement('span', { className: 'meta-value' }, selectedInvention.likeCount)
                ),
                React.createElement('div', { className: 'meta-item' },
                  React.createElement('span', { className: 'meta-label' }, '🤝 Investor Interests:'),
                  React.createElement('span', { className: 'meta-value' }, selectedInvention.interestCount)
                )
              )
            ),

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
              selectedInvention.marketSize?.tam &&
                React.createElement('p', null, React.createElement('strong', null, 'TAM:'), ' ', selectedInvention.marketSize.tam),
              selectedInvention.marketSize?.sam &&
                React.createElement('p', null, React.createElement('strong', null, 'SAM:'), ' ', selectedInvention.marketSize.sam),
              selectedInvention.marketSize?.som &&
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

            React.createElement('div', { className: 'modal-actions', style: { display: 'flex', gap: '1rem' } },
              React.createElement('button', {
                className: 'btn-contact',
                style: { background: '#ef4444' },
                onClick: () => { deleteInvention(selectedInvention.id); closeDetails(); }
              }, 'Delete Invention'),
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

export default Dashboard;