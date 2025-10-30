# Location Analysis Web App

A comprehensive location analysis tool that helps businesses make informed decisions about where to establish their operations. Built with React, TypeScript, and modern web technologies.

## Features

### Page 1 - Location Analysis Request
- Clean, ChatGPT-style interface with animated wave background
- Location input with suggestions
- Business type selection dropdown
- Form validation and accessibility features
- Smooth animations and micro-interactions

### Page 2 - Interactive Analysis Dashboard
- **Google Maps Integration**: Interactive maps with radius overlays and business markers
- **Comprehensive Analytics**: Multiple chart types (line, donut, scatter, radar, bar, gauge)
- **AI Assistant**: Intelligent chatbot with context-aware responses
- **Business Explorer**: Detailed business cards with review trends
- **Responsive Design**: Optimized for all device sizes
- **PDF Export**: Download detailed analysis reports

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Charts**: Chart.js with react-chartjs-2
- **Maps**: Google Maps JavaScript API
- **PDF Generation**: jsPDF with html2canvas
- **Build Tool**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Google Maps API Key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Google Maps API Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create credentials (API Key)
5. Restrict the API key to your domain for production use
6. Add the API key to your `.env` file

## Features Breakdown

### Charts and Visualizations
- **Seasonal Demand**: Line chart showing demand patterns with peak/low season annotations
- **Demographics**: Donut chart displaying office workers vs residents ratio
- **Competitor Analysis**: Scatter plot comparing competitor size vs ratings
- **Location Profile**: Radar chart showing key location characteristics
- **Competition Density**: Bar chart showing competitor distribution by radius
- **Success Score**: Gauge chart with overall location assessment

### Interactive Elements
- **Hamburger Menu**: Slides analysis panel in/out with smooth transitions
- **AI Assistant**: Contextual chatbot with pre-written suggestions
- **Business Cards**: Click to view detailed information and map recentering
- **Map Interactions**: Clickable markers, radius overlays, and smooth animations

### Accessibility Features
- ARIA labels and keyboard navigation
- Screen reader compatible
- High contrast ratios
- Focus indicators
- Semantic HTML structure

### Responsive Design
- Mobile-first approach
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Adaptive layouts and interactions
- Touch-friendly interface elements

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── charts/          # Chart components
│   ├── GoogleMap.tsx    # Map component
│   ├── BusinessCard.tsx # Business listing card
│   └── ...
├── pages/               # Page components
│   ├── LocationRequest.tsx
│   └── LocationAnalysis.tsx
├── hooks/               # Custom hooks
│   └── useGoogleMaps.ts
├── data/                # Mock data and constants
│   └── mockData.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── App.tsx              # Main application component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Performance Optimizations

- Lazy loading of chart components
- Optimized Google Maps rendering
- Efficient state management
- Minimized bundle size with tree shaking
- Compressed assets and images

## Browser Compatibility

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Progressive enhancement for older browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository.