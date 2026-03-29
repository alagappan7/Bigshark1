:root {
  /* Sophisticated color palette - deep blues with bronze accents */
  --color-primary: #0A2342;
  --color-secondary: #2C5F7F;
  --color-accent: #C49A6C;
  --color-accent-light: #D4B896;
  --color-background: #F8F6F3;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-light: #666666;
  --color-border: #E5E1DA;
  --color-success: #2D6A4F;
  --color-error: #B85450;
  
  /* Typography scale */
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
  
  /* Spacing */
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2.5rem;
  --space-xl: 4rem;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(10, 35, 66, 0.08);
  --shadow-md: 0 4px 16px rgba(10, 35, 66, 0.12);
  --shadow-lg: 0 8px 32px rgba(10, 35, 66, 0.16);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-primary);
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.02em;
}

h2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
}

h3 {
  font-size: clamp(1.5rem, 3vw, 2rem);
}

a {
  color: var(--color-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-accent);
}

button {
  font-family: var(--font-body);
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

input, textarea, select {
  font-family: var(--font-body);
  font-size: 1rem;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-accent-light);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.slide-in-right {
  animation: slideInRight 0.6s ease-out forwards;
}

.scale-in {
  animation: scaleIn 0.4s ease-out forwards;
}

/* Utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.text-center {
  text-align: center;
}

.mb-sm { margin-bottom: var(--space-sm); }
.mb-md { margin-bottom: var(--space-md); }
.mb-lg { margin-bottom: var(--space-lg); }
.mb-xl { margin-bottom: var(--space-xl); }

.mt-sm { margin-top: var(--space-sm); }
.mt-md { margin-top: var(--space-md); }
.mt-lg { margin-top: var(--space-lg); }
.mt-xl { margin-top: var(--space-xl); }
