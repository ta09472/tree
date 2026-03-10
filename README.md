# TanStack Start Full-Stack Starter

A modern full-stack React starter template with comprehensive tooling and best practices.

## 🚀 Tech Stack

| Category | Technology | Documentation |
|----------|-----------|---------------|
| **Runtime** | Bun | [bun.sh/docs](https://bun.sh/docs) |
| **Lint/Format** | Biome | [biomejs.dev](https://biomejs.dev/guides/getting-started/) |
| **Framework** | TanStack Start | [tanstack.com/start](https://tanstack.com/start/latest/docs/framework/react/overview) |
| **UI Library** | React 19 | [react.dev](https://react.dev/) |
| **Styling** | Tailwind CSS v4 | [tailwindcss.com](https://tailwindcss.com/docs) |
| **UI Components** | shadcn/ui + Base UI | [ui.shadcn.com](https://ui.shadcn.com/docs), [base-ui.com](https://base-ui.com/react/overview/quick-start) |
| **Animations** | Motion (Framer Motion) | [motion.dev](https://motion.dev/docs/react) |
| **Haptics** | web-haptics | [haptics.lochie.me](https://haptics.lochie.me) |
| **Theming** | next-themes | [next-themes](https://github.com/pacocoursey/next-themes) |
| **i18n** | i18next + react-i18next | [react.i18next.com](https://react.i18next.com/) |
| **Dates** | date-fns | [date-fns.org](https://date-fns.org/) |
| **Mobile** | react-simple-kit patterns | [react-simplikit](https://react-simplikit.slash.page/ko/mobile/intro.html) |
| **HTTP Client** | Axios | [axios-http.com](https://axios-http.com/docs/intro) |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LanguageSwitcher.tsx
│   └── ThemeToggle.tsx
├── hooks/              # Custom React hooks
│   ├── useHaptics.ts   # Haptic feedback
│   ├── useDateFormat.ts # Date formatting with i18n
│   ├── useTheme.ts     # Theme management
│   └── useMobile.ts    # Mobile detection & a11y
├── providers/          # React context providers
│   ├── ThemeProvider.tsx
│   ├── I18nProvider.tsx
│   ├── MotionProvider.tsx
│   ├── HapticsProvider.tsx
│   └── index.tsx       # Combined providers
├── lib/                # Library configurations
│   ├── axios.ts        # Axios instance
│   ├── i18n.ts         # i18next configuration
│   └── utils.ts        # Utility functions
├── utils/              # Utility modules
│   └── date.ts         # Date utilities
├── i18n/               # Internationalization
│   └── locales/
│       ├── en.json
│       └── ko.json
├── routes/             # TanStack Start routes
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   └── about.tsx       # About page
└── styles.css          # Global styles
```

## 🛠️ Available Scripts

```bash
# Development
bun dev                 # Start development server

# Building
bun run build           # Build for production
bun run preview         # Preview production build

# Code Quality
bun run lint            # Run Biome linter
bun run format          # Format code with Biome
bun run check           # Run all Biome checks
bun run typecheck       # Run TypeScript type checking

# Testing
bun test                # Run Vitest tests
```

## 🎯 Key Features

### 🌓 Dark/Light Mode
- Automatic system preference detection
- Manual toggle with persistent storage
- Smooth transitions between themes

### 🌍 Internationalization (i18n)
- English and Korean translations included
- Language detection and persistence
- Easy to add more languages

### 📳 Haptic Feedback
- Predefined patterns: light, medium, heavy, success, error, warning
- Automatic device capability detection
- Easy to use hooks

### 📱 Mobile-First Design
- Safe area insets support
- Viewport height handling
- Focus trap for modals
- Lock body scroll

### 🎨 Animations
- Motion provider for consistent animations
- Reduced motion support
- Easy-to-use animation variants

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed

### Installation

```bash
# Clone or create project
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Adding Translations

1. Add new locale file in `src/i18n/locales/`
2. Import and register in `src/lib/i18n.ts`
3. Add language option in `src/components/LanguageSwitcher.tsx`

## 🎨 Customizing Themes

Edit CSS variables in `src/styles.css`:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... */
}
```

## 📦 Adding shadcn/ui Components

```bash
bunx shadcn@latest add button
bunx shadcn@latest add card
# etc...
```

## 🔗 API Integration

Axios instance is pre-configured in `src/lib/axios.ts`:

```typescript
import { api } from '@/lib/axios';

// Use in components
const data = await api.get('/users');
```

## 📄 License

MIT
# tree
