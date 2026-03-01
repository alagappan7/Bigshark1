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
    // Load inventions from localStorage
    const posts = JSON.parse(localStorage.getItem('inventionPosts') || '[]');
    setInventions(posts);
    setFilteredInventions(posts);
  }, []);

  useEffect(() => {
    // Apply filters
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

  return (
    <div className="browse-inventions-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>Browse Patent-Backed Innovations</h1>
          <p>Discover breakthrough technologies ready for investment</p>
        </div>

        <div className="filters-section slide-in-right">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search patents, problems, technologies..."
              className="search-input"
            />
          </div>

          <div className="filter-grid">
            <div className="filter-group">
              <label>Development Stage</label>
              <select name="stage" value={filters.stage} onChange={handleFilterChange}>
                <option value="all">All Stages</option>
                <option value="idea">Idea</option>
                <option value="prototype">Prototype</option>
                <option value="early-customers">Early Customers</option>
                <option value="revenue">Revenue Generating</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Prototype Status</label>
              <select name="prototypeStatus" value={filters.prototypeStatus} onChange={handleFilterChange}>
                <option value="all">All Statuses</option>
                <option value="idea">Idea</option>
                <option value="prototype">Prototype</option>
                <option value="mvp">MVP</option>
                <option value="production-ready">Production-Ready</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Patent Authority</label>
              <select name="authority" value={filters.authority} onChange={handleFilterChange}>
                <option value="all">All Authorities</option>
                <option value="USPTO">USPTO</option>
                <option value="EPO">EPO</option>
                <option value="WIPO">WIPO</option>
                <option value="India IPO">India IPO</option>
              </select>
            </div>
          </div>
        </div>

        <div className="results-info">
          <p>{filteredInventions.length} invention{filteredInventions.length !== 1 ? 's' : ''} found</p>
        </div>

        {filteredInventions.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No inventions found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          <div className="inventions-grid">
            {filteredInventions.map((invention, index) => (
              <div 
                key={invention.id} 
                className="invention-card scale-in"
                style={{animationDelay: `${index * 0.05}s`}}
                onClick={() => openDetails(invention)}
              >
                <div className="card-header">
                  <div className="patent-badge">
                    {invention.issuingAuthority}
                  </div>
                  <div className="stage-badge">
                    {invention.currentStage}
                  </div>
                </div>

                <div className="card-body">
                  <h3>{invention.patentId}</h3>
                  <p className="problem-brief">{invention.problemSolved}</p>
                  
                  <div className="card-meta">
                    <div className="meta-item">
                      <span className="meta-label">Prototype:</span>
                      <span className="meta-value">{invention.prototypeStatus}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-label">Funding Needed:</span>
                      <span className="meta-value">{invention.fundingRequired}</span>
                    </div>
                  </div>

                  <div className="card-tags">
                    {invention.lookingFor.map(item => (
                      <span key={item} className="tag">{item}</span>
                    ))}
                  </div>
                </div>

                <div className="card-footer">
                  <div className="inventor-info">
                    <div className="inventor-avatar">
                      {invention.inventorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="inventor-details">
                      <div className="inventor-name">{invention.inventorName}</div>
                      <div className="inventor-location">{invention.location}</div>
                    </div>
                  </div>
                  <button className="btn-view-details">View Details →</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedInvention && (
          <div className="modal-overlay" onClick={closeDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeDetails}>×</button>
              
              <div className="modal-header">
                <h2>{selectedInvention.patentId}</h2>
                <div className="modal-badges">
                  <span className="badge badge-primary">{selectedInvention.issuingAuthority}</span>
                  <span className="badge badge-secondary">{selectedInvention.patentStatus}</span>
                </div>
              </div>

              <div className="modal-body">
                <section className="detail-section">
                  <h3>Problem & Solution</h3>
                  <p><strong>Problem:</strong> {selectedInvention.problemSolved}</p>
                  <p><strong>Solution:</strong> {selectedInvention.patentProtects}</p>
                  <p><strong>Target Audience:</strong> {selectedInvention.targetAudience}</p>
                </section>

                <section className="detail-section">
                  <h3>Technology</h3>
                  <p><strong>Key Claims:</strong> {selectedInvention.keyClaims}</p>
                  {selectedInvention.technologyStack && (
                    <p><strong>Technology Stack:</strong> {selectedInvention.technologyStack}</p>
                  )}
                  <p><strong>Prototype Status:</strong> {selectedInvention.prototypeStatus}</p>
                </section>

                <section className="detail-section">
                  <h3>Business Model</h3>
                  <p><strong>Business Model:</strong> {selectedInvention.businessModel}</p>
                  <p><strong>Current Stage:</strong> {selectedInvention.currentStage}</p>
                  <p><strong>Competitive Advantage:</strong> {selectedInvention.competitiveAdvantage}</p>
                </section>

                <section className="detail-section">
                  <h3>Market Opportunity</h3>
                  {selectedInvention.marketSize.tam && (
                    <p><strong>TAM:</strong> {selectedInvention.marketSize.tam}</p>
                  )}
                  {selectedInvention.marketSize.sam && (
                    <p><strong>SAM:</strong> {selectedInvention.marketSize.sam}</p>
                  )}
                  {selectedInvention.marketSize.som && (
                    <p><strong>SOM:</strong> {selectedInvention.marketSize.som}</p>
                  )}
                  <p><strong>Why Now:</strong> {selectedInvention.whyNow}</p>
                </section>

                <section className="detail-section">
                  <h3>Financials</h3>
                  <p><strong>Funding Required:</strong> {selectedInvention.fundingRequired}</p>
                  <p><strong>Use of Funds:</strong> {selectedInvention.useOfFunds}</p>
                  {selectedInvention.productValuation && (
                    <p><strong>Current Valuation:</strong> {selectedInvention.productValuation}</p>
                  )}
                  {selectedInvention.futureValuation && (
                    <p><strong>Projected Valuation:</strong> {selectedInvention.futureValuation}</p>
                  )}
                </section>

                {(selectedInvention.pitchDeckLink || selectedInvention.demoVideoLink || selectedInvention.googlePatentsLink) && (
                  <section className="detail-section">
                    <h3>Resources</h3>
                    {selectedInvention.googlePatentsLink && (
                      <p>
                        <a href={selectedInvention.googlePatentsLink} target="_blank" rel="noopener noreferrer">
                          View Patent on Google Patents →
                        </a>
                      </p>
                    )}
                    {selectedInvention.pitchDeckLink && (
                      <p>
                        <a href={selectedInvention.pitchDeckLink} target="_blank" rel="noopener noreferrer">
                          View Pitch Deck →
                        </a>
                      </p>
                    )}
                    {selectedInvention.demoVideoLink && (
                      <p>
                        <a href={selectedInvention.demoVideoLink} target="_blank" rel="noopener noreferrer">
                          Watch Demo Video →
                        </a>
                      </p>
                    )}
                  </section>
                )}

                <section className="detail-section inventor-section">
                  <h3>Inventor</h3>
                  <div className="inventor-profile">
                    <div className="inventor-avatar large">
                      {selectedInvention.inventorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4>{selectedInvention.inventorName}</h4>
                      <p>{selectedInvention.backgroundSummary}</p>
                      <p><strong>Location:</strong> {selectedInvention.location}</p>
                    </div>
                  </div>
                </section>

                <div className="modal-actions">
                  <button 
                    className="btn-contact"
                    onClick={() => contactInventor(selectedInvention)}
                  >
                    Contact Inventor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseInventions;
