import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './PostInvention.css';

const PostInvention = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Patent Identity
    patentId: '',
    issuingAuthority: 'USPTO',
    patentStatus: 'granted',
    filingDate: '',
    issueDate: '',
    googlePatentsLink: '',
    
    // Inventor Identity (auto-filled from LinkedIn)
    linkedInProfile: user?.profileUrl || '',
    teamMembers: '',
    location: '',
    backgroundSummary: user?.headline || '',
    
    // Problem & Market
    problemSolved: '',
    targetAudience: '',
    marketSize: { tam: '', sam: '', som: '' },
    whyNow: '',
    
    // Technology & Innovation
    patentProtects: '',
    keyClaims: '',
    technologyStack: '',
    prototypeStatus: 'idea',
    
    // Business & Commercialisation
    currentStage: 'idea',
    businessModel: '',
    competitiveAdvantage: '',
    barriersToEntry: '',
    similarPatents: '',
    
    // Financials
    productValuation: '',
    futureValuation: '',
    costToBuild: '',
    fundingRequired: '',
    useOfFunds: '',
    
    // Supporting Materials
    pitchDeckLink: '',
    demoVideoLink: '',
    technicalDocsLink: '',
    
    // Call to Action
    lookingFor: [],
    contactMethod: 'linkedin'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        lookingFor: checked 
          ? [...prev.lookingFor, value]
          : prev.lookingFor.filter(item => item !== value)
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store in localStorage (in production, send to backend)
    const existingPosts = JSON.parse(localStorage.getItem('inventionPosts') || '[]');
    const newPost = {
      ...formData,
      id: Date.now(),
      inventorId: user.id,
      inventorName: `${user.firstName} ${user.lastName}`,
      inventorEmail: user.email,
      createdAt: new Date().toISOString()
    };
    
    existingPosts.push(newPost);
    localStorage.setItem('inventionPosts', JSON.stringify(existingPosts));
    
    alert('Invention posted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="post-invention-page">
      <div className="container">
        <div className="page-header fade-in">
          <h1>Post Your Invention</h1>
          <p>Share your patented innovation with potential investors</p>
        </div>

        <form onSubmit={handleSubmit} className="invention-form">
          {/* Patent Identity */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.1s'}}>
            <h2>1. Patent Identity</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Patent ID / Number *</label>
                <input
                  type="text"
                  name="patentId"
                  value={formData.patentId}
                  onChange={handleChange}
                  required
                  placeholder="US1234567A"
                />
              </div>
              
              <div className="form-group">
                <label>Patent Issuing Authority *</label>
                <select
                  name="issuingAuthority"
                  value={formData.issuingAuthority}
                  onChange={handleChange}
                  required
                >
                  <option value="USPTO">USPTO (United States)</option>
                  <option value="EPO">EPO (European)</option>
                  <option value="WIPO">WIPO (International)</option>
                  <option value="India IPO">India IPO</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Patent Status *</label>
                <select
                  name="patentStatus"
                  value={formData.patentStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="granted">Granted</option>
                  <option value="pending">Pending</option>
                  <option value="provisional">Provisional</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Filing Date *</label>
                <input
                  type="date"
                  name="filingDate"
                  value={formData.filingDate}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Issue Date</label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group full-width">
                <label>Google Patents Link</label>
                <input
                  type="url"
                  name="googlePatentsLink"
                  value={formData.googlePatentsLink}
                  onChange={handleChange}
                  placeholder="https://patents.google.com/patent/..."
                />
              </div>
            </div>
          </section>

          {/* Inventor Identity */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.15s'}}>
            <h2>2. Inventor Identity</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>LinkedIn Profile (Auto-filled)</label>
                <input
                  type="url"
                  name="linkedInProfile"
                  value={formData.linkedInProfile}
                  readOnly
                  className="readonly"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Team Members (Optional)</label>
                <input
                  type="text"
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  placeholder="John Doe (CTO), Jane Smith (Engineer)"
                />
              </div>
              
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="San Francisco, CA"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Background Summary (Auto-filled from LinkedIn)</label>
                <textarea
                  name="backgroundSummary"
                  value={formData.backgroundSummary}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </div>
          </section>

          {/* Problem & Market */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.2s'}}>
            <h2>3. Problem & Market</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Problem Being Solved *</label>
                <textarea
                  name="problemSolved"
                  value={formData.problemSolved}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Describe the problem your invention solves..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Who Experiences This Problem *</label>
                <textarea
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  required
                  rows="2"
                  placeholder="Healthcare providers, manufacturers, consumers..."
                />
              </div>
              
              <div className="form-group">
                <label>TAM (Total Addressable Market)</label>
                <input
                  type="text"
                  name="marketSize.tam"
                  value={formData.marketSize.tam}
                  onChange={handleChange}
                  placeholder="$10B"
                />
              </div>
              
              <div className="form-group">
                <label>SAM (Serviceable Available Market)</label>
                <input
                  type="text"
                  name="marketSize.sam"
                  value={formData.marketSize.sam}
                  onChange={handleChange}
                  placeholder="$2B"
                />
              </div>
              
              <div className="form-group">
                <label>SOM (Serviceable Obtainable Market)</label>
                <input
                  type="text"
                  name="marketSize.som"
                  value={formData.marketSize.som}
                  onChange={handleChange}
                  placeholder="$200M"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Why Now (Timing Advantage) *</label>
                <textarea
                  name="whyNow"
                  value={formData.whyNow}
                  onChange={handleChange}
                  required
                  rows="2"
                  placeholder="What makes this the right time for this innovation..."
                />
              </div>
            </div>
          </section>

          {/* Technology & Innovation */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.25s'}}>
            <h2>4. Technology & Innovation</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>What the Patent Protects *</label>
                <textarea
                  name="patentProtects"
                  value={formData.patentProtects}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Simple explanation of what your patent covers..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Key Claims (Summarized) *</label>
                <textarea
                  name="keyClaims"
                  value={formData.keyClaims}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Main claims of your patent in simple terms..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Technology Stack / Scientific Basis</label>
                <input
                  type="text"
                  name="technologyStack"
                  value={formData.technologyStack}
                  onChange={handleChange}
                  placeholder="AI/ML, IoT, Biotechnology, etc."
                />
              </div>
              
              <div className="form-group">
                <label>Prototype Status *</label>
                <select
                  name="prototypeStatus"
                  value={formData.prototypeStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="mvp">MVP</option>
                  <option value="production-ready">Production-Ready</option>
                </select>
              </div>
            </div>
          </section>

          {/* Business & Commercialisation */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.3s'}}>
            <h2>5. Business & Commercialisation</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Current Stage *</label>
                <select
                  name="currentStage"
                  value={formData.currentStage}
                  onChange={handleChange}
                  required
                >
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="early-customers">Early Customers</option>
                  <option value="revenue">Revenue Generating</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label>Business Model *</label>
                <input
                  type="text"
                  name="businessModel"
                  value={formData.businessModel}
                  onChange={handleChange}
                  required
                  placeholder="Licensing, Product Sales, B2B, B2C, SaaS..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Competitive Advantage *</label>
                <textarea
                  name="competitiveAdvantage"
                  value={formData.competitiveAdvantage}
                  onChange={handleChange}
                  required
                  rows="2"
                  placeholder="What sets your innovation apart..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Barriers to Entry</label>
                <textarea
                  name="barriersToEntry"
                  value={formData.barriersToEntry}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Patent protection, technical complexity, regulatory approvals..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Similar Patents (Optional)</label>
                <input
                  type="text"
                  name="similarPatents"
                  value={formData.similarPatents}
                  onChange={handleChange}
                  placeholder="Patent numbers of related innovations"
                />
              </div>
            </div>
          </section>

          {/* Financials */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.35s'}}>
            <h2>6. Financials</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Initial Product Valuation</label>
                <input
                  type="text"
                  name="productValuation"
                  value={formData.productValuation}
                  onChange={handleChange}
                  placeholder="$500K"
                />
              </div>
              
              <div className="form-group">
                <label>Estimated Future Valuation</label>
                <input
                  type="text"
                  name="futureValuation"
                  value={formData.futureValuation}
                  onChange={handleChange}
                  placeholder="$10M in 3 years"
                />
              </div>
              
              <div className="form-group">
                <label>Estimated Cost to Build</label>
                <input
                  type="text"
                  name="costToBuild"
                  value={formData.costToBuild}
                  onChange={handleChange}
                  placeholder="$200K"
                />
              </div>
              
              <div className="form-group">
                <label>Funding Required *</label>
                <input
                  type="text"
                  name="fundingRequired"
                  value={formData.fundingRequired}
                  onChange={handleChange}
                  required
                  placeholder="$250K"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Use of Funds (Breakdown) *</label>
                <textarea
                  name="useOfFunds"
                  value={formData.useOfFunds}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Product development: $150K, Marketing: $50K, Operations: $50K"
                />
              </div>
            </div>
          </section>

          {/* Supporting Materials */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.4s'}}>
            <h2>7. Supporting Materials</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Pitch Deck (Link)</label>
                <input
                  type="url"
                  name="pitchDeckLink"
                  value={formData.pitchDeckLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Demo Video (Link)</label>
                <input
                  type="url"
                  name="demoVideoLink"
                  value={formData.demoVideoLink}
                  onChange={handleChange}
                  placeholder="https://youtube.com/..."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Technical Documents (Link)</label>
                <input
                  type="url"
                  name="technicalDocsLink"
                  value={formData.technicalDocsLink}
                  onChange={handleChange}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="form-section slide-in-right" style={{animationDelay: '0.45s'}}>
            <h2>8. Call to Action</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Looking For *</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Investment"
                      checked={formData.lookingFor.includes('Investment')}
                      onChange={handleChange}
                    />
                    <span>Investment</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Licensing"
                      checked={formData.lookingFor.includes('Licensing')}
                      onChange={handleChange}
                    />
                    <span>Licensing</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Partnership"
                      checked={formData.lookingFor.includes('Partnership')}
                      onChange={handleChange}
                    />
                    <span>Partnership</span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      value="Co-founder"
                      checked={formData.lookingFor.includes('Co-founder')}
                      onChange={handleChange}
                    />
                    <span>Co-founder</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group">
                <label>Preferred Contact Method *</label>
                <select
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="email">Email</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Post Invention
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInvention;
