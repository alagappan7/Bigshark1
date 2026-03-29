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

  return React.createElement('div', { className: 'post-invention-page' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'page-header fade-in' },
        React.createElement('h1', null, 'Post Your Invention'),
        React.createElement('p', null, 'Share your patented innovation with potential investors')
      ),

      React.createElement('form', { onSubmit: handleSubmit, className: 'invention-form' },

        // Patent Identity
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.1s' } },
          React.createElement('h2', null, '1. Patent Identity'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Patent ID / Number *'),
              React.createElement('input', {
                type: 'text',
                name: 'patentId',
                value: formData.patentId,
                onChange: handleChange,
                required: true,
                placeholder: 'US1234567A'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Patent Issuing Authority *'),
              React.createElement('select', { name: 'issuingAuthority', value: formData.issuingAuthority, onChange: handleChange, required: true },
                React.createElement('option', { value: 'USPTO' }, 'USPTO (United States)'),
                React.createElement('option', { value: 'EPO' }, 'EPO (European)'),
                React.createElement('option', { value: 'WIPO' }, 'WIPO (International)'),
                React.createElement('option', { value: 'India IPO' }, 'India IPO'),
                React.createElement('option', { value: 'Other' }, 'Other')
              )
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Patent Status *'),
              React.createElement('select', { name: 'patentStatus', value: formData.patentStatus, onChange: handleChange, required: true },
                React.createElement('option', { value: 'granted' }, 'Granted'),
                React.createElement('option', { value: 'pending' }, 'Pending'),
                React.createElement('option', { value: 'provisional' }, 'Provisional')
              )
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Filing Date *'),
              React.createElement('input', {
                type: 'date',
                name: 'filingDate',
                value: formData.filingDate,
                onChange: handleChange,
                required: true
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Issue Date'),
              React.createElement('input', {
                type: 'date',
                name: 'issueDate',
                value: formData.issueDate,
                onChange: handleChange
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Google Patents Link'),
              React.createElement('input', {
                type: 'url',
                name: 'googlePatentsLink',
                value: formData.googlePatentsLink,
                onChange: handleChange,
                placeholder: 'https://patents.google.com/patent/...'
              })
            )
          )
        ),

        // Inventor Identity
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.15s' } },
          React.createElement('h2', null, '2. Inventor Identity'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'LinkedIn Profile (Auto-filled)'),
              React.createElement('input', {
                type: 'url',
                name: 'linkedInProfile',
                value: formData.linkedInProfile,
                readOnly: true,
                className: 'readonly'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Team Members (Optional)'),
              React.createElement('input', {
                type: 'text',
                name: 'teamMembers',
                value: formData.teamMembers,
                onChange: handleChange,
                placeholder: 'John Doe (CTO), Jane Smith (Engineer)'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Location *'),
              React.createElement('input', {
                type: 'text',
                name: 'location',
                value: formData.location,
                onChange: handleChange,
                required: true,
                placeholder: 'San Francisco, CA'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Background Summary (Auto-filled from LinkedIn)'),
              React.createElement('textarea', {
                name: 'backgroundSummary',
                value: formData.backgroundSummary,
                onChange: handleChange,
                rows: '2'
              })
            )
          )
        ),

        // Problem & Market
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.2s' } },
          React.createElement('h2', null, '3. Problem & Market'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Problem Being Solved *'),
              React.createElement('textarea', {
                name: 'problemSolved',
                value: formData.problemSolved,
                onChange: handleChange,
                required: true,
                rows: '3',
                placeholder: 'Describe the problem your invention solves...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Who Experiences This Problem *'),
              React.createElement('textarea', {
                name: 'targetAudience',
                value: formData.targetAudience,
                onChange: handleChange,
                required: true,
                rows: '2',
                placeholder: 'Healthcare providers, manufacturers, consumers...'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'TAM (Total Addressable Market)'),
              React.createElement('input', {
                type: 'text',
                name: 'marketSize.tam',
                value: formData.marketSize.tam,
                onChange: handleChange,
                placeholder: '$10B'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'SAM (Serviceable Available Market)'),
              React.createElement('input', {
                type: 'text',
                name: 'marketSize.sam',
                value: formData.marketSize.sam,
                onChange: handleChange,
                placeholder: '$2B'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'SOM (Serviceable Obtainable Market)'),
              React.createElement('input', {
                type: 'text',
                name: 'marketSize.som',
                value: formData.marketSize.som,
                onChange: handleChange,
                placeholder: '$200M'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Why Now (Timing Advantage) *'),
              React.createElement('textarea', {
                name: 'whyNow',
                value: formData.whyNow,
                onChange: handleChange,
                required: true,
                rows: '2',
                placeholder: 'What makes this the right time for this innovation...'
              })
            )
          )
        ),

        // Technology & Innovation
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.25s' } },
          React.createElement('h2', null, '4. Technology & Innovation'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'What the Patent Protects *'),
              React.createElement('textarea', {
                name: 'patentProtects',
                value: formData.patentProtects,
                onChange: handleChange,
                required: true,
                rows: '3',
                placeholder: 'Simple explanation of what your patent covers...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Key Claims (Summarized) *'),
              React.createElement('textarea', {
                name: 'keyClaims',
                value: formData.keyClaims,
                onChange: handleChange,
                required: true,
                rows: '3',
                placeholder: 'Main claims of your patent in simple terms...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Technology Stack / Scientific Basis'),
              React.createElement('input', {
                type: 'text',
                name: 'technologyStack',
                value: formData.technologyStack,
                onChange: handleChange,
                placeholder: 'AI/ML, IoT, Biotechnology, etc.'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Prototype Status *'),
              React.createElement('select', { name: 'prototypeStatus', value: formData.prototypeStatus, onChange: handleChange, required: true },
                React.createElement('option', { value: 'idea' }, 'Idea'),
                React.createElement('option', { value: 'prototype' }, 'Prototype'),
                React.createElement('option', { value: 'mvp' }, 'MVP'),
                React.createElement('option', { value: 'production-ready' }, 'Production-Ready')
              )
            )
          )
        ),

        // Business & Commercialisation
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.3s' } },
          React.createElement('h2', null, '5. Business & Commercialisation'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Current Stage *'),
              React.createElement('select', { name: 'currentStage', value: formData.currentStage, onChange: handleChange, required: true },
                React.createElement('option', { value: 'idea' }, 'Idea'),
                React.createElement('option', { value: 'prototype' }, 'Prototype'),
                React.createElement('option', { value: 'early-customers' }, 'Early Customers'),
                React.createElement('option', { value: 'revenue' }, 'Revenue Generating')
              )
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Business Model *'),
              React.createElement('input', {
                type: 'text',
                name: 'businessModel',
                value: formData.businessModel,
                onChange: handleChange,
                required: true,
                placeholder: 'Licensing, Product Sales, B2B, B2C, SaaS...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Competitive Advantage *'),
              React.createElement('textarea', {
                name: 'competitiveAdvantage',
                value: formData.competitiveAdvantage,
                onChange: handleChange,
                required: true,
                rows: '2',
                placeholder: 'What sets your innovation apart...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Barriers to Entry'),
              React.createElement('textarea', {
                name: 'barriersToEntry',
                value: formData.barriersToEntry,
                onChange: handleChange,
                rows: '2',
                placeholder: 'Patent protection, technical complexity, regulatory approvals...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Similar Patents (Optional)'),
              React.createElement('input', {
                type: 'text',
                name: 'similarPatents',
                value: formData.similarPatents,
                onChange: handleChange,
                placeholder: 'Patent numbers of related innovations'
              })
            )
          )
        ),

        // Financials
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.35s' } },
          React.createElement('h2', null, '6. Financials'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Initial Product Valuation'),
              React.createElement('input', {
                type: 'text',
                name: 'productValuation',
                value: formData.productValuation,
                onChange: handleChange,
                placeholder: '$500K'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Estimated Future Valuation'),
              React.createElement('input', {
                type: 'text',
                name: 'futureValuation',
                value: formData.futureValuation,
                onChange: handleChange,
                placeholder: '$10M in 3 years'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Estimated Cost to Build'),
              React.createElement('input', {
                type: 'text',
                name: 'costToBuild',
                value: formData.costToBuild,
                onChange: handleChange,
                placeholder: '$200K'
              })
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Funding Required *'),
              React.createElement('input', {
                type: 'text',
                name: 'fundingRequired',
                value: formData.fundingRequired,
                onChange: handleChange,
                required: true,
                placeholder: '$250K'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Use of Funds (Breakdown) *'),
              React.createElement('textarea', {
                name: 'useOfFunds',
                value: formData.useOfFunds,
                onChange: handleChange,
                required: true,
                rows: '3',
                placeholder: 'Product development: $150K, Marketing: $50K, Operations: $50K'
              })
            )
          )
        ),

        // Supporting Materials
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.4s' } },
          React.createElement('h2', null, '7. Supporting Materials'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Pitch Deck (Link)'),
              React.createElement('input', {
                type: 'url',
                name: 'pitchDeckLink',
                value: formData.pitchDeckLink,
                onChange: handleChange,
                placeholder: 'https://drive.google.com/...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Demo Video (Link)'),
              React.createElement('input', {
                type: 'url',
                name: 'demoVideoLink',
                value: formData.demoVideoLink,
                onChange: handleChange,
                placeholder: 'https://youtube.com/...'
              })
            ),

            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Technical Documents (Link)'),
              React.createElement('input', {
                type: 'url',
                name: 'technicalDocsLink',
                value: formData.technicalDocsLink,
                onChange: handleChange,
                placeholder: 'https://drive.google.com/...'
              })
            )
          )
        ),

        // Call to Action
        React.createElement('section', { className: 'form-section slide-in-right', style: { animationDelay: '0.45s' } },
          React.createElement('h2', null, '8. Call to Action'),
          React.createElement('div', { className: 'form-grid' },
            React.createElement('div', { className: 'form-group full-width' },
              React.createElement('label', null, 'Looking For *'),
              React.createElement('div', { className: 'checkbox-group' },
                React.createElement('label', { className: 'checkbox-label' },
                  React.createElement('input', {
                    type: 'checkbox',
                    value: 'Investment',
                    checked: formData.lookingFor.includes('Investment'),
                    onChange: handleChange
                  }),
                  React.createElement('span', null, 'Investment')
                ),
                React.createElement('label', { className: 'checkbox-label' },
                  React.createElement('input', {
                    type: 'checkbox',
                    value: 'Licensing',
                    checked: formData.lookingFor.includes('Licensing'),
                    onChange: handleChange
                  }),
                  React.createElement('span', null, 'Licensing')
                ),
                React.createElement('label', { className: 'checkbox-label' },
                  React.createElement('input', {
                    type: 'checkbox',
                    value: 'Partnership',
                    checked: formData.lookingFor.includes('Partnership'),
                    onChange: handleChange
                  }),
                  React.createElement('span', null, 'Partnership')
                ),
                React.createElement('label', { className: 'checkbox-label' },
                  React.createElement('input', {
                    type: 'checkbox',
                    value: 'Co-founder',
                    checked: formData.lookingFor.includes('Co-founder'),
                    onChange: handleChange
                  }),
                  React.createElement('span', null, 'Co-founder')
                )
              )
            ),

            React.createElement('div', { className: 'form-group' },
              React.createElement('label', null, 'Preferred Contact Method *'),
              React.createElement('select', { name: 'contactMethod', value: formData.contactMethod, onChange: handleChange, required: true },
                React.createElement('option', { value: 'linkedin' }, 'LinkedIn'),
                React.createElement('option', { value: 'email' }, 'Email'),
                React.createElement('option', { value: 'both' }, 'Both')
              )
            )
          )
        ),

        React.createElement('div', { className: 'form-actions' },
          React.createElement('button', { type: 'button', className: 'btn-secondary', onClick: () => navigate(-1) }, 'Cancel'),
          React.createElement('button', { type: 'submit', className: 'btn-submit' }, 'Post Invention')
        )
      )
    )
  );
};

export default PostInvention;