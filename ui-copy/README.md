# 🎨 Garuda Lens UI Components

**Ready-to-use UI components** from Garuda Lens - A modern, responsive, split-panel dashboard interface.

![UI Preview](../screenshot.png)

## 📦 What's Inside

This folder contains **everything you need** to integrate the Garuda Lens UI into your project:

```
ui-copy/
├── components/           # All UI components
│   ├── AppContainer.tsx           # Main container
│   ├── ChatInterface.tsx          # Left panel (chat)
│   ├── MapDashboardInterface.tsx  # Right panel (tabs)
│   ├── MapInterface.tsx           # Map view
│   ├── Dashboard.tsx              # Analytics view
│   ├── NDVIDashboard.tsx          # NDVI analysis
│   ├── LandingPage.tsx            # Landing page
│   ├── ThemeToggle.tsx            # Theme switcher
│   └── ui/                        # UI component library
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (15+ components)
├── app/
│   ├── globals.css      # All styles & theme
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── lib/
│   ├── utils.ts         # Utilities (cn function)
│   ├── types.ts         # TypeScript types
│   └── hooks/           # Custom React hooks
├── package.json         # All dependencies
├── tailwind.config.ts   # Tailwind configuration
├── tsconfig.json        # TypeScript config
├── postcss.config.mjs   # PostCSS config
└── next.config.ts       # Next.js config

```

## 🚀 Quick Start (3 Steps)

### Step 1: Copy Everything to Your Project

```bash
# From the ui-copy folder, copy all contents to your Next.js project root
cp -r ui-copy/* /path/to/your/nextjs/project/
```

### Step 2: Install Dependencies

```bash
cd /path/to/your/nextjs/project
npm install
```

### Step 3: Run Your Project

```bash
npm run dev
```

That's it! Open `http://localhost:3000` and you'll see the UI running.

---

## 🎯 Integration Options

### Option 1: Use Everything (Recommended for Quick Start)

Just copy the entire `ui-copy` folder to your project root. All files are ready to go.

### Option 2: Pick What You Need

**Minimal Setup (Just the split panel layout):**
```
✅ components/AppContainer.tsx
✅ components/MapDashboardInterface.tsx
✅ components/ui/* (all)
✅ app/globals.css
✅ lib/utils.ts
✅ lib/types.ts
✅ tailwind.config.ts
```

**Add Chat Interface:**
```
+ components/ChatInterface.tsx
+ components/ui/chat-container.tsx
+ components/ui/message.tsx
+ components/ui/prompt-input.tsx
```

**Add Map View:**
```
+ components/MapInterface.tsx
+ Install: leaflet, react-leaflet, @types/leaflet
```

**Add Analytics Dashboard:**
```
+ components/Dashboard.tsx
+ Install: recharts
```

---

## 📝 Configuration Files Explained

### package.json
Contains all required dependencies. Just run `npm install`.

### tailwind.config.ts
Pre-configured with all color variables and theme settings.

### tsconfig.json
TypeScript configuration with path aliases (`@/*`) already set up.

### globals.css
Contains:
- All CSS variables for theming
- Light and dark mode colors
- Component styles
- Animations
- Leaflet map styles

---

## 🎨 Customization

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --background: #ffffff;     /* Main background */
  --foreground: #000000;     /* Text color */
  --primary: #000000;        /* Primary color */
  --accent: #f9a825;         /* Accent color - CHANGE THIS */
}

.dark {
  --background: #0a0a0a;     /* Dark mode background */
  /* ... more dark mode colors */
}
```

### Change Layout Proportions

In `components/AppContainer.tsx`:

```tsx
// Current: 40% left, 60% right
<div className="w-2/5 h-full ...">  // Left panel

// Change to 50/50:
<div className="w-1/2 h-full ...">

// Change to 30/70:
<div className="w-[30%] h-full ...">
```

### Remove Components You Don't Need

**Don't need chat?**
- Delete `components/ChatInterface.tsx`
- Replace with your own left panel content

**Don't need map?**
- Delete `components/MapInterface.tsx`
- Remove map tab from `MapDashboardInterface.tsx`
- Remove leaflet dependencies

**Don't need NDVI?**
- Delete `components/NDVIDashboard.tsx`
- Remove NDVI tab from `MapDashboardInterface.tsx`

---

## 📋 File Dependencies

### Core Files (Required)
- `lib/utils.ts` - Required by all components
- `lib/types.ts` - TypeScript definitions
- `app/globals.css` - All styles
- `components/ui/*` - UI component library

### Optional Components
- `ChatInterface.tsx` → Requires: message.tsx, chat-container.tsx, prompt-input.tsx
- `MapInterface.tsx` → Requires: leaflet, react-leaflet
- `Dashboard.tsx` → Requires: recharts
- `NDVIDashboard.tsx` → Requires: recharts

---

## 🔧 Common Modifications

### 1. Use Your Own Data

Replace the mock data in `AppContainer.tsx`:

```tsx
const [mapData, setMapData] = useState<EnhancedQueryResult | null>(null);

// Replace with your data fetching
useEffect(() => {
  fetchYourData().then(data => setMapData(data));
}, []);
```

### 2. Replace Chat with Custom Panel

In `AppContainer.tsx`:

```tsx
// Replace this:
<ChatInterface
  initialQuery={currentQuery}
  onMapUpdate={handleMapUpdate}
/>

// With your component:
<YourCustomPanel
  data={yourData}
  onUpdate={handleUpdate}
/>
```

### 3. Add More Tabs

In `MapDashboardInterface.tsx`:

```tsx
// Add tab button
<TabsTrigger value="your-tab">
  <YourIcon className="h-4 w-4" />
  <span>Your Tab</span>
</TabsTrigger>

// Add tab content
<TabsContent value="your-tab">
  <YourComponent />
</TabsContent>
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@/components/...'"

**Fix:** Ensure `tsconfig.json` has path aliases:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Tailwind classes not working

**Fix:**
1. Check `tailwind.config.ts` content paths include your files
2. Ensure `globals.css` is imported in `app/layout.tsx`
3. Restart dev server: `npm run dev`

### Issue: Framer Motion hydration errors

**Fix:** Add to `app/layout.tsx`:
```tsx
<html lang="en" suppressHydrationWarning>
```

### Issue: Leaflet "window is not defined"

**Fix:** Use dynamic import in your page:
```tsx
import dynamic from 'next/dynamic';

const MapInterface = dynamic(() => import('@/components/MapInterface'), {
  ssr: false,
});
```

---

## 📚 Dependencies Explained

| Package | What It Does | Required? |
|---------|--------------|-----------|
| `framer-motion` | Smooth animations | ✅ Yes |
| `lucide-react` | Icons | ✅ Yes |
| `tailwind-merge` | Merge Tailwind classes | ✅ Yes |
| `next-themes` | Dark/light theme | ✅ Yes |
| `react-leaflet` | Maps | ⚠️ Only if using MapInterface |
| `recharts` | Charts | ⚠️ Only if using Dashboard/NDVIDashboard |
| `react-markdown` | Markdown rendering | ⚠️ Only if using ChatInterface |

---

## ✅ Integration Checklist

- [ ] Copy `ui-copy` contents to your project
- [ ] Run `npm install`
- [ ] Verify `globals.css` is imported in `layout.tsx`
- [ ] Check path aliases in `tsconfig.json`
- [ ] Test in browser: `npm run dev`
- [ ] Test dark/light mode toggle
- [ ] Test responsive design (mobile/tablet)
- [ ] Customize colors to match your brand
- [ ] Remove unused components
- [ ] Replace mock data with your API

---

## 🎯 Example Usage

### Basic Split Panel

```tsx
// app/page.tsx
import AppContainer from '@/components/AppContainer';

export default function Home() {
  return <AppContainer />;
}
```

### Custom Left Panel

```tsx
// app/page.tsx
"use client";
import { useState } from 'react';
import MapDashboardInterface from '@/components/MapDashboardInterface';

export default function Home() {
  const [data, setData] = useState(null);

  return (
    <div className="h-screen flex">
      {/* Your custom left panel */}
      <div className="w-2/5 border-r p-4">
        <h1>Your Custom Panel</h1>
        <button onClick={() => setData(yourData)}>
          Load Data
        </button>
      </div>

      {/* Right panel with tabs */}
      <div className="flex-1">
        <MapDashboardInterface queryResult={data} />
      </div>
    </div>
  );
}
```

---

## 🚀 Next Steps

1. **Customize the theme** colors in `globals.css`
2. **Connect your data** sources
3. **Add authentication** if needed
4. **Deploy** to Vercel/Netlify
5. **Share** your awesome project!

---

## 📞 Need Help?

- Check the [main integration guide](../UI_EXPORT_GUIDE.md) for detailed steps
- Review component source code for implementation details
- Check Tailwind CSS and Framer Motion docs for customization

---

**Version:** 1.0.0
**Last Updated:** 2025-10-10
**Compatibility:** Next.js 15+, React 19+

Happy coding! 🎉
