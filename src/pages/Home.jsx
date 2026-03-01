import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-background">
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content fade-in">
            <h1 className="hero-title">
              Where Innovation
              <span className="accent-text"> Meets Investment</span>
            </h1>
            <p className="hero-subtitle">
              Connect groundbreaking patents with visionary investors. 
              Transform ideas into ventures, inventions into enterprises.
            </p>
            <div className="hero-cta">
              <Link to="/login" className="btn-hero btn-hero-primary">
                Get Started
                <span className="arrow">→</span>
              </Link>
              <Link to="/about" className="btn-hero btn-hero-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title text-center mb-xl">
            How It Works
          </h2>
          
          <div className="features-grid">
            <div className="feature-card slide-in-right" style={{animationDelay: '0.1s'}}>
              <div className="feature-icon">💡</div>
              <h3>For Inventors</h3>
              <p>
                Showcase your patented innovations to a curated network of 
                investors actively seeking breakthrough technologies.
              </p>
              <ul className="feature-list">
                <li>Post detailed invention profiles</li>
                <li>Link your LinkedIn credentials</li>
                <li>Connect with serious investors</li>
                <li>Maintain control of your IP</li>
              </ul>
            </div>

            <div className="feature-card slide-in-right" style={{animationDelay: '0.2s'}}>
              <div className="feature-icon">💰</div>
              <h3>For Investors</h3>
              <p>
                Discover pre-vetted patent-backed opportunities across 
                industries before they hit the mainstream market.
              </p>
              <ul className="feature-list">
                <li>Browse verified patents</li>
                <li>Filter by industry & stage</li>
                <li>Direct inventor communication</li>
                <li>Early-stage opportunities</li>
              </ul>
            </div>

            <div className="feature-card slide-in-right" style={{animationDelay: '0.3s'}}>
              <div className="feature-icon">🤝</div>
              <h3>Secure Platform</h3>
              <p>
                Built on LinkedIn authentication with comprehensive profiles 
                ensuring credibility on both sides.
              </p>
              <ul className="feature-list">
                <li>LinkedIn-verified accounts</li>
                <li>Patent documentation</li>
                <li>Transparent communication</li>
                <li>Professional network integration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card scale-in" style={{animationDelay: '0.1s'}}>
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Patents</div>
            </div>
            <div className="stat-card scale-in" style={{animationDelay: '0.2s'}}>
              <div className="stat-number">200+</div>
              <div className="stat-label">Verified Investors</div>
            </div>
            <div className="stat-card scale-in" style={{animationDelay: '0.3s'}}>
              <div className="stat-number">$50M+</div>
              <div className="stat-label">Capital Raised</div>
            </div>
            <div className="stat-card scale-in" style={{animationDelay: '0.4s'}}>
              <div className="stat-number">150+</div>
              <div className="stat-label">Successful Connections</div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Connect?</h2>
            <p>Join the future of patent-backed innovation today.</p>
            <Link to="/login" className="btn-cta">
              Sign in with LinkedIn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
