import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return React.createElement(
    "div",
    { className: "home" },

    /* ---------------- HERO SECTION ---------------- */
    React.createElement(
      "section",
      { className: "hero" },

      React.createElement(
        "div",
        { className: "hero-background" },
        React.createElement("div", { className: "hero-pattern" })
      ),

      React.createElement(
        "div",
        { className: "container" },
        React.createElement(
          "div",
          { className: "hero-content fade-in" },

          React.createElement(
            "h1",
            { className: "hero-title" },
            "Where Innovation",
            React.createElement("span", { className: "accent-text" }, " Meets Investment")
          ),

          React.createElement(
            "p",
            { className: "hero-subtitle" },
            "Connect groundbreaking patents with visionary investors. Transform ideas into ventures, inventions into enterprises."
          ),

          React.createElement(
            "div",
            { className: "hero-cta" },

            React.createElement(
              Link,
              { to: "/login", className: "btn-hero btn-hero-primary" },
              "Get Started",
              React.createElement("span", { className: "arrow" }, "→")
            ),

            React.createElement(
              Link,
              { to: "/about", className: "btn-hero btn-hero-secondary" },
              "Learn More"
            )
          )
        )
      )
    ),

    /* ---------------- FEATURES SECTION ---------------- */
    React.createElement(
      "section",
      { className: "features" },

      React.createElement(
        "div",
        { className: "container" },

        React.createElement(
          "h2",
          { className: "section-title text-center mb-xl" },
          "How It Works"
        ),

        React.createElement(
          "div",
          { className: "features-grid" },

          /* Inventors Card */
          React.createElement(
            "div",
            {
              className: "feature-card slide-in-right",
              style: { animationDelay: "0.1s" }
            },
            React.createElement("div", { className: "feature-icon" }, "💡"),
            React.createElement("h3", null, "For Inventors"),
            React.createElement(
              "p",
              null,
              "Showcase your patented innovations to a curated network of investors actively seeking breakthrough technologies."
            ),
            React.createElement(
              "ul",
              { className: "feature-list" },
              React.createElement("li", null, "Post detailed invention profiles"),
              React.createElement("li", null, "Link your LinkedIn credentials"),
              React.createElement("li", null, "Connect with serious investors"),
              React.createElement("li", null, "Maintain control of your IP")
            )
          ),

          /* Investors Card */
          React.createElement(
            "div",
            {
              className: "feature-card slide-in-right",
              style: { animationDelay: "0.2s" }
            },
            React.createElement("div", { className: "feature-icon" }, "💰"),
            React.createElement("h3", null, "For Investors"),
            React.createElement(
              "p",
              null,
              "Discover pre-vetted patent-backed opportunities across industries before they hit the mainstream market."
            ),
            React.createElement(
              "ul",
              { className: "feature-list" },
              React.createElement("li", null, "Browse verified patents"),
              React.createElement("li", null, "Filter by industry & stage"),
              React.createElement("li", null, "Direct inventor communication"),
              React.createElement("li", null, "Early-stage opportunities")
            )
          ),

          /* Secure Platform Card */
          React.createElement(
            "div",
            {
              className: "feature-card slide-in-right",
              style: { animationDelay: "0.3s" }
            },
            React.createElement("div", { className: "feature-icon" }, "🤝"),
            React.createElement("h3", null, "Secure Platform"),
            React.createElement(
              "p",
              null,
              "Built on LinkedIn authentication with comprehensive profiles ensuring credibility on both sides."
            ),
            React.createElement(
              "ul",
              { className: "feature-list" },
              React.createElement("li", null, "LinkedIn-verified accounts"),
              React.createElement("li", null, "Patent documentation"),
              React.createElement("li", null, "Transparent communication"),
              React.createElement("li", null, "Professional network integration")
            )
          )
        )
      )
    ),

    /* ---------------- STATS SECTION ---------------- */
    React.createElement(
      "section",
      { className: "stats" },

      React.createElement(
        "div",
        { className: "container" },

        React.createElement(
          "div",
          { className: "stats-grid" },

          React.createElement(
            "div",
            { className: "stat-card scale-in", style: { animationDelay: "0.1s" } },
            React.createElement("div", { className: "stat-number" }, "500+"),
            React.createElement("div", { className: "stat-label" }, "Active Patents")
          ),

          React.createElement(
            "div",
            { className: "stat-card scale-in", style: { animationDelay: "0.2s" } },
            React.createElement("div", { className: "stat-number" }, "200+"),
            React.createElement("div", { className: "stat-label" }, "Verified Investors")
          ),

          React.createElement(
            "div",
            { className: "stat-card scale-in", style: { animationDelay: "0.3s" } },
            React.createElement("div", { className: "stat-number" }, "$50M+"),
            React.createElement("div", { className: "stat-label" }, "Capital Raised")
          ),

          React.createElement(
            "div",
            { className: "stat-card scale-in", style: { animationDelay: "0.4s" } },
            React.createElement("div", { className: "stat-number" }, "150+"),
            React.createElement("div", { className: "stat-label" }, "Successful Connections")
          )
        )
      )
    ),

    /* ---------------- CTA SECTION ---------------- */
    React.createElement(
      "section",
      { className: "cta-section" },

      React.createElement(
        "div",
        { className: "container" },

        React.createElement(
          "div",
          { className: "cta-content" },

          React.createElement("h2", null, "Ready to Connect?"),
          React.createElement("p", null, "Join the future of patent-backed innovation today."),

          React.createElement(
            Link,
            { to: "/login", className: "btn-cta" },
            "Sign in with LinkedIn"
          )
        )
      )
    )
  );
};

export default Home;