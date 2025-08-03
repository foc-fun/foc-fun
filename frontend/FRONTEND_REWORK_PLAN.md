# Frontend Rework Plan for foc.fun

## Overview
This document outlines the plan to modernize the foc.fun frontend while preserving its cartoony, playful aesthetic. The goal is to create a more polished, professional experience that still feels fun and approachable.

## Design Philosophy
- **Modern meets Playful**: Clean, contemporary UI patterns with cartoon-inspired elements
- **Consistent Visual Language**: Unified color palette, typography, and spacing
- **Enhanced UX**: Better navigation, clearer CTAs, improved accessibility
- **Responsive Design**: Mobile-first approach ensuring great experience across devices

## Core Design System

### 1. Typography
- **Primary Font**: Keep Light-Pixel-7 for headers and branding
- **Secondary Font**: Add a clean sans-serif (Inter, Poppins, or similar) for body text and better readability
- **Font Hierarchy**: Clear size/weight distinctions for H1-H6, body, captions

### 2. Color Palette Evolution
- **Keep**: Purple/Green/Orange accent colors (modernize the shades)
- **Add**: 
  - Neutral grays for better contrast
  - Semantic colors (success, warning, error)
  - Dark/light mode support
- **Gradients**: Subtle, modern gradients instead of heavy ones

### 3. Component Library
- **Cards**: Modern glassmorphism with subtle borders and shadows
- **Buttons**: Refined hover states, micro-interactions
- **Navigation**: Sticky header with smooth transitions
- **Animations**: Tasteful, performant animations (Framer Motion)

## Page Structure

### 1. Header Redesign
- **Logo**: Refined placement with subtle animation on hover
- **Navigation**: 
  - Clear tab indicators with underline/background on active
  - Smooth transitions between tabs
  - Mobile hamburger menu
- **Login Button**: 
  - Prominent CTA styling
  - User avatar/address display when connected
  - Dropdown for account options

### 2. Play Tab (Game Explorer)
- **Hero Section**: 
  - Engaging tagline about gaming on Starknet
  - Featured game carousel/spotlight
- **Game Grid**:
  - Improved card design with better hover effects
  - Filter/Sort options (by genre, status, popularity)
  - Search functionality
  - Category badges (New, Popular, Coming Soon)
- **Game Cards**:
  - Lazy-loaded videos/images
  - Quick stats (players, rating)
  - One-click play buttons
  - Status indicators refined

### 3. Build Tab
- **Purpose**: Gateway for developers
- **Content**:
  - Hero section: "Build Your Game on Starknet"
  - Key features grid (showcasing benefits)
  - Quick start guide preview
  - Prominent "View Documentation" CTA button linking to docs.foc.fun
  - Example games/success stories
  - Developer resources links

### 4. About Page
- **Hero Section**:
  - "The Starknet App Engine" - clear value proposition
  - Animated illustration showing the concept
- **What is foc.fun**:
  - Platform for deploying and managing smart contracts on Starknet
  - Registry system for contract classes
  - Automated deployment and event indexing
  - No-code contract interaction interface
- **Key Features**:
  - Decentralized game hosting
  - Smart contract integration made easy
  - Community-driven ecosystem
  - Low fees on Starknet
- **Roadmap/Coming Soon**:
  - Timeline of upcoming features
  - Games in development
  - Platform improvements
- **Community Section**:
  - Links to Discord, Twitter, GitHub
  - Newsletter signup

### 5. Footer
- **Links**: Docs, GitHub, Social Media
- **Legal**: Terms, Privacy Policy
- **Branding**: "Built on Starknet" badge

## Technical Implementation

### 1. Component Architecture
- Create reusable component library
- Implement design tokens for consistency
- Use CSS modules or styled-components for scoped styling

### 2. Performance Optimizations
- Image optimization with next/image
- Lazy loading for game cards
- Code splitting by route
- Minimize bundle size

### 3. Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader friendly

### 4. Animations & Interactions
- Page transitions
- Hover effects on cards
- Loading skeletons
- Smooth scroll behaviors

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up design system (colors, typography, spacing)
- [ ] Create base component library
- [ ] Implement new header/navigation
- [ ] Set up routing for new structure

### Phase 2: Core Pages (Week 2)
- [ ] Redesign Play tab with game explorer
- [ ] Create Build tab with docs link
- [ ] Develop About page with all sections
- [ ] Implement responsive design

### Phase 3: Polish & Interactions (Week 3)
- [ ] Add animations and micro-interactions
- [ ] Implement search/filter functionality
- [ ] Add loading states and error handling
- [ ] Performance optimization

### Phase 4: Testing & Launch (Week 4)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness verification
- [ ] Accessibility audit
- [ ] Final polish and bug fixes

## Design Mockup Ideas

### Visual Direction
- **Background**: Subtle animated gradient or particle effect
- **Cards**: Clean white/dark cards with colorful accents
- **Icons**: Custom icon set matching the playful theme
- **Illustrations**: Simple, geometric characters/elements

### Interaction Patterns
- **Hover**: Gentle scale and shadow elevation
- **Click**: Satisfying press animation
- **Transitions**: Smooth, physics-based animations
- **Loading**: Playful skeleton screens or spinners

## Success Metrics
- Improved user engagement (time on site, pages visited)
- Higher click-through to games
- Increased developer interest (Build tab clicks)
- Better mobile experience scores
- Positive community feedback

## Notes
- Preserve the fun, approachable nature while adding sophistication
- Ensure the design scales well as more games are added
- Keep performance as a top priority
- Make the platform feel alive and dynamic