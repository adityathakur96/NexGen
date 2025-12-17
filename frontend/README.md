# NexGen Frontend

A modern, responsive sales analytics and forecasting platform built with React, Vite, and Tailwind CSS v4.

## Overview

NexGen Frontend is a comprehensive dashboard application for visualizing sales data, tracking performance metrics, and managing sales forecasts. The application features an intuitive interface with interactive charts, real-time data upload capabilities, and responsive design.

## Tech Stack

- **React 19.2.0** - Modern UI library with latest features
- **Vite 7.2.4** - Next-generation frontend tooling for fast development
- **Tailwind CSS v4** - Utility-first CSS framework with custom gradient support
- **React Router DOM 7.10.1** - Client-side routing
- **Recharts 3.6.0** - Composable charting library for data visualization
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

## Features

### Pages & Components

- **Login Page** - Secure authentication with gradient design
- **Dashboard** - Overview with key metrics and performance indicators
  - Total Revenue, Growth Rate, Active Customers, Target Progress
  - Interactive Sales vs Forecast chart
  - Monthly Performance visualization
  - CSV data upload functionality
- **Predictions** - Sales forecasting and analytics
- **Profile** - User account management
- **About** - Platform information and features

### UI Components

- **StatCard** - Reusable metric display cards with icons and trends
- **Button** - Customizable button component with variants
- **Card** - Container component for content sections
- **Input** - Form input with label support
- **Layout** - Main layout with sidebar and navbar
- **Sidebar** - Navigation menu with active route highlighting
- **Navbar** - Top navigation with search and user profile

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Build

```bash
# Build for production
npm run build
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── ui/         # UI primitives (Button, Card, Input, etc.)
│   │   ├── Layout.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── pages/          # Page components
│   │   ├── About.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Predictions.jsx
│   │   └── Profile.jsx
│   ├── lib/
│   │   └── utils.js    # Utility functions
│   ├── App.jsx         # Main app component with routing
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles and Tailwind configuration
├── index.html
├── vite.config.js      # Vite configuration
├── eslint.config.js    # ESLint configuration
└── package.json

```

## Styling

The application uses Tailwind CSS v4 with custom configurations:

- **Custom Gradients** - Purple, blue, pink, and indigo gradient utilities
- **OKLCH Color Space** - Modern color definitions for better perceptual uniformity
- **Custom Animations** - Fade-in, slide-up, and pulse-glow effects
- **Responsive Design** - Mobile-first approach with breakpoints
- **Dark Mode Support** - Theme variables for light/dark modes

### Gradient Classes

```css
bg-gradient-to-r    /* Left to right */
bg-gradient-to-br   /* Top-left to bottom-right */
bg-gradient-to-b    /* Top to bottom */

/* Color stops */
from-purple-500, to-blue-600
from-pink-500, to-pink-600
from-indigo-500, to-indigo-600
```

## Data Upload

The dashboard supports CSV file uploads for custom sales data:

**CSV Format:**
```csv
month,sales,forecast
Jan,45000,48000
Feb,52000,54000
Mar,48000,51000
```

## Configuration

### Vite Configuration

The project uses `@vitejs/plugin-react` and `@tailwindcss/vite` plugins for optimal development experience and styling support.

### ESLint Configuration

ESLint is configured with React-specific rules including:
- `eslint-plugin-react-hooks` - Enforce React Hooks rules
- `eslint-plugin-react-refresh` - Ensure Fast Refresh compatibility

