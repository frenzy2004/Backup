# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

- `npm run dev` - Start Vite development server on http://localhost:8080
- `npm run build` - Build production application with Vite
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run deploy` - Deploy using PowerShell deployment script

## Architecture Overview

### Core Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7 with fast HMR and optimized bundling
- **Styling**: Tailwind CSS with custom configuration
- **Maps**: Google Maps JavaScript API (Places, Geocoding, Maps APIs)
- **Charts**: Chart.js with react-chartjs-2 wrapper
- **PDF Export**: jsPDF with html2canvas for report generation
- **Icons**: Lucide React icon library
- **3D Graphics**: Three.js with @react-three/fiber and @react-three/drei
- **AI Integration**: AWS Bedrock Runtime for AI assistant features
- **Backend**: Supabase for data persistence
- **Animations**: GSAP with @gsap/react for advanced animations

### Application Purpose

Location Analysis Web App - A comprehensive tool that helps businesses make informed decisions about where to establish their operations by analyzing:
- Geographic location data via Google Maps
- Business competition in the area
- Demographics and seasonal demand patterns
- Rent prices and urban development factors
- AI-powered insights and recommendations

### App Structure

```
src/
├── pages/
│   ├── LocationRequest.tsx      # Landing page with location input form
│   └── LocationAnalysis.tsx     # Main dashboard with analysis results
├── components/
│   ├── charts/                  # Chart.js visualization components
│   │   ├── SeasonalDemandChart.tsx
│   │   ├── DemographicChart.tsx
│   │   ├── CompetitorChart.tsx
│   │   ├── LocationProfileChart.tsx
│   │   ├── CompetitionDensityChart.tsx
│   │   └── SuccessScoreChart.tsx
│   ├── ui/                      # Reusable UI components
│   │   └── dotted-surface.tsx
│   ├── GoogleMap.tsx            # Interactive Google Maps component
│   ├── BusinessCard.tsx         # Business listing cards
│   ├── BusinessDetail.tsx       # Detailed business information view
│   ├── AIAssistant.tsx          # AI chatbot interface
│   ├── KPICards.tsx             # Key Performance Indicator cards
│   ├── RentLocationContent.tsx  # Rent analysis content
│   ├── TabNavigation.tsx        # Tab switching UI
│   ├── WaveBackground.tsx       # Animated wave background
│   └── NeuralBackground.tsx     # 3D neural network background
├── hooks/
│   └── useGoogleMaps.ts         # Google Maps API loader hook
├── utils/
│   ├── placesService.ts         # Google Places API integration
│   ├── geocoding.ts             # Geocoding utilities
│   ├── businessGenerator.ts     # Business data generation
│   └── businessClassifier.ts    # Business type classification
├── data/
│   └── mockData.ts              # Mock data for charts and analysis
├── types/
│   └── index.ts                 # TypeScript type definitions
├── lib/
│   └── utils.ts                 # Utility functions
└── App.tsx                      # Root component with routing logic
```

### Key Features

#### Page 1 - Location Request
- Clean, modern interface with animated 3D neural network background
- Location input with Google Places Autocomplete suggestions
- Business type and scale selection dropdowns
- Form validation with disabled state for incomplete inputs
- Smooth animations and micro-interactions

#### Page 2 - Interactive Analysis Dashboard
- **Tab Navigation**: Multiple analysis tabs with close functionality
- **Google Maps Integration**: Interactive maps with radius overlays, business markers, and recenter functionality
- **Comprehensive Charts**:
  - Seasonal Demand (line chart)
  - Demographics (donut chart)
  - Competitor Analysis (scatter plot)
  - Location Profile (radar chart)
  - Competition Density (bar chart)
  - Success Score (gauge chart)
- **AI Assistant**: Context-aware chatbot with suggestion chips
- **Business Explorer**: Detailed business cards with ratings and reviews
- **Rent Analysis**: Location-specific rent pricing data
- **PDF Export**: Download detailed analysis reports
- **Responsive Design**: Optimized for desktop, tablet, and mobile

### State Management

- Local React state with `useState` and `useEffect` hooks
- No external state management library (no Redux/Zustand)
- Tab state managed in [App.tsx:10-58](src/App.tsx#L10-58)
- Analysis data fetched via Google Maps APIs

### Google Maps Integration

**Required APIs** (must be enabled in Google Cloud Console):
- Maps JavaScript API
- Places API
- Geocoding API

**Key Features**:
- Location autocomplete in [LocationRequest.tsx](src/pages/LocationRequest.tsx)
- Geocoding in [utils/geocoding.ts](src/utils/geocoding.ts)
- Nearby business search in [utils/placesService.ts](src/utils/placesService.ts)
- Interactive map rendering in [GoogleMap.tsx](src/components/GoogleMap.tsx)

### AWS Bedrock Integration

- AI-powered business insights and recommendations
- Integrated via `@aws-sdk/client-bedrock-runtime`
- Used in AI Assistant chatbot feature

### Chart Visualizations

All charts use Chart.js with react-chartjs-2:
1. **Seasonal Demand**: Line chart showing monthly demand patterns with peak/low season annotations
2. **Demographics**: Donut chart displaying office workers vs residents ratio
3. **Competitor Analysis**: Scatter plot comparing competitor ratings vs business size
4. **Location Profile**: Radar chart showing walkability, parking, transit, safety, amenities
5. **Competition Density**: Bar chart showing competitor distribution by radius
6. **Success Score**: Gauge chart with 0-100 scoring and color-coded zones

### PDF Export System

- Uses jsPDF for PDF generation
- Uses html2canvas to capture dashboard as image
- Exports comprehensive location analysis reports
- Implemented in [LocationAnalysis.tsx](src/pages/LocationAnalysis.tsx)

## Key Patterns

### Google Maps Hook Pattern

All components requiring Google Maps use the `useGoogleMaps` hook:

```typescript
import { useGoogleMaps } from '../hooks/useGoogleMaps';

const { isLoaded } = useGoogleMaps();

if (!isLoaded) return <div>Loading maps...</div>;
```

### Form Handling

- React controlled components with `useState`
- No React Hook Form or Zod validation
- Simple validation logic in component handlers
- Google Places Autocomplete integration for location input

### Tab Management Pattern

Multi-tab analysis interface allows users to compare multiple locations:
- Each tab stores: location, businessType, id, label, createdAt, isActive
- Tab creation in [App.tsx:13-29](src/App.tsx#L13-29)
- Tab switching in [App.tsx:35-40](src/App.tsx#L35-40)
- Tab closing with auto-switch logic in [App.tsx:42-58](src/App.tsx#L42-58)

### Error Handling

**Standard Pattern**: All complex data-display components should be wrapped in error boundaries to prevent crashes from breaking the entire page.

```typescript
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";

// Standard usage
<ErrorBoundary>
  <LocationAnalysis />
</ErrorBoundary>

// With custom fallback
<ErrorBoundary fallback={<ErrorFallback variant="minimal" />}>
  <GoogleMap />
</ErrorBoundary>
```

**Note**: ErrorBoundary components may need to be implemented if not already present.

## Visual Development & Testing

### Design System

The project follows S-Tier SaaS design standards inspired by Stripe, Airbnb, and Linear. All UI development must adhere to:

- **Design Principles**: [/context/design-principles.md](context/design-principles.md) - Comprehensive checklist for world-class UI
- **Component Library**: Custom Tailwind CSS with utility-first approach

### Quick Visual Check

**IMMEDIATELY after implementing any front-end change:**

1. **Identify what changed** - Review the modified components/pages
2. **Navigate to affected pages** - Use `mcp__playwright__browser_navigate` to visit each changed view
3. **Verify design compliance** - Compare against [/context/design-principles.md](context/design-principles.md)
4. **Validate feature implementation** - Ensure the change fulfills the user's specific request
5. **Check acceptance criteria** - Review any provided context files or requirements
6. **Capture evidence** - Take full page screenshot at desktop viewport (1440px) of each changed view
7. **Check for errors** - Run `mcp__playwright__browser_console_messages` ⚠️

This verification ensures changes meet design standards and user requirements.

### Comprehensive Design Review

For significant UI changes or before merging PRs, use the design review agent:

```bash
# Option 1: Use the slash command
/design-review

# Option 2: Invoke the agent directly
@agent-design-review
```

The design review agent will:
- Test all interactive states and user flows
- Verify responsiveness (desktop/tablet/mobile)
- Check accessibility (WCAG 2.1 AA compliance)
- Validate visual polish and consistency
- Test edge cases and error states
- Provide categorized feedback (Blockers/High/Medium/Nitpicks)

### Playwright MCP Integration

#### Essential Commands for UI Testing

```javascript
// Navigation & Screenshots
mcp__playwright__browser_navigate(url); // Navigate to page
mcp__playwright__browser_take_screenshot(); // Capture visual evidence
mcp__playwright__browser_resize(width, height); // Test responsiveness

// Interaction Testing
mcp__playwright__browser_click(element); // Test clicks
mcp__playwright__browser_type(element, text); // Test input
mcp__playwright__browser_hover(element); // Test hover states

// Validation
mcp__playwright__browser_console_messages(); // Check for errors
mcp__playwright__browser_snapshot(); // Accessibility check
mcp__playwright__browser_wait_for(text/element); // Ensure loading
```

### Design Compliance Checklist

When implementing UI features, verify:

- [ ] **Visual Hierarchy**: Clear focus flow, appropriate spacing
- [ ] **Consistency**: Uses design tokens (Tailwind classes), follows patterns
- [ ] **Responsiveness**: Works on mobile (375px), tablet (768px), desktop (1440px)
- [ ] **Accessibility**: Keyboard navigable, proper contrast, semantic HTML
- [ ] **Performance**: Fast load times, smooth animations (150-300ms)
- [ ] **Error Handling**: Clear error states, helpful messages
- [ ] **Polish**: Micro-interactions, loading states, empty states

## When to Use Automated Visual Testing

### Use Quick Visual Check for:

- Every front-end change, no matter how small
- After implementing new components or features
- When modifying existing UI elements
- After fixing visual bugs
- Before committing UI changes

### Use Comprehensive Design Review for:

- Major feature implementations
- Before creating pull requests with UI changes
- When refactoring component architecture
- After significant design system updates
- When accessibility compliance is critical

### Skip Visual Testing for:

- Backend-only changes (API utilities, data processing)
- Configuration file updates
- Documentation changes
- Build script modifications
- Non-visual utility functions

## Environment Setup

Requires these environment variables in `.env`:

```bash
# Google Maps (Required)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# AWS Bedrock (for AI features)
VITE_AWS_REGION=your_aws_region
VITE_AWS_ACCESS_KEY_ID=your_access_key
VITE_AWS_SECRET_ACCESS_KEY=your_secret_key

# Supabase (for data persistence)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

See [.env.example](.env.example) for template.

## Additional Context

- Design review agent configuration: [/.claude/agents/design-review-agent.md](.claude/agents/design-review-agent.md)
- Premium UI designer agent: [/.claude/agents/premium-ui-designer.md](.claude/agents/premium-ui-designer.md)
- Design principles checklist: [/context/design-principles.md](context/design-principles.md)
- Custom slash commands: [/context/design-review-slash-command.md](context/design-review-slash-command.md)

## Deployment

- Deployment scripts: [deploy.ps1](deploy.ps1), [deploy-api.ps1](deploy-api.ps1), [deploy-lambda.ps1](deploy-lambda.ps1)
- AWS Amplify configuration: [amplify.yml](amplify.yml)
- Production build command: `npm run build` (outputs to `dist/`)

## Browser Compatibility

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)
- Progressive enhancement for older browsers

---

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.
