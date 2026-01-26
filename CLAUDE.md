# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **CityHistoryWalks** Angular application for city history walking tours.

### Technology Stack
- **Framework**: Angular 21 with standalone components (no NgModules)
- **Language**: TypeScript 5.9
- **Styling**: SCSS with Angular Material
- **Maps**: MapLibre GL
- **Backend**: Supabase (authentication, database, storage)
- **Testing**: Vitest (unit), Cypress (e2e)
- **PWA**: Service Worker support enabled in production

## Development Commands

```bash
npm start           # Development server on http://localhost:4200
npm run build       # Production build to dist/
npm test            # Run Vitest unit tests
npm run e2e         # Run Cypress e2e tests
ng generate component component-name  # Scaffold new component
```

## UI/UX Design Guidelines

### Core Design Philosophy

This app follows the visual and interaction patterns of a **modern museum audio guide**. The experience is designed for a self-guided city walking experience where users listen to historical stories tied to physical locations.

### Design Constraints

**Context**:
- Mobile-first (phone primary, tablet secondary)
- Outdoor use with variable lighting conditions
- Audio-first experience
- Minimal text on primary screens
- Calm, neutral visual style
- No gamification elements
- No forced login or account creation

**User Focus**:
- One primary action per screen
- Minimal cognitive load
- Audio must always be one tap away
- Offline-first mindset

### Key Screen Patterns

#### 1. Home / Start Screen
**Purpose**: Simple entry point to begin the experience

**Primary Components**:
- "Start nearby story" as the main call-to-action
- Optional featured walk highlight
- Minimal chrome, maximum focus

**Layout**:
- Single column
- Vertical scrolling only
- Large touch targets (minimum 44×44pt)

#### 2. Map Screen (Primary Navigation)
**Purpose**: Spatial overview of available stories

**Components**:
- Clean map background with minimal UI overlay
- Numbered or dot-style story markers
- Bottom sheet style preview cards (swipe up to expand)
- Clear distance indicators in metres (not kilometers)
- Current location indicator

**Interaction**:
- Tap marker → show preview card
- Swipe up card → expand to full details
- Swipe down → collapse card
- No pinch-to-zoom required for primary tasks

#### 3. Story Preview Card
**Purpose**: Quick decision-making about which story to listen to

**Required Elements**:
- Story title (prominent, serif font)
- Historical date range
- Short summary (1–2 lines maximum)
- Duration estimate (e.g., "8 minutes")
- Distance from current location
- Two clear actions: "Listen" (primary), "Read More" (secondary)

**Layout**:
- Card format with white/neutral background
- Hero image at top (optional)
- Content padding: 16–24px
- Actions at bottom of card

#### 4. Story Playback Screen
**Purpose**: Primary listening experience

**Components** (top to bottom):
1. Large image area (hero image, 40% of screen)
2. Story title (serif, large)
3. Audio controls as primary focus:
   - Play/pause (large, central)
   - Skip back 15s
   - Skip forward 15s
   - Progress bar with time indicators
   - Playback speed control (1×, 1.25×, 1.5×)
4. Scrollable transcript below (optional, collapsible)

**Requirements**:
- Background playback enabled
- Lock-screen controls with artwork
- Headphone controls supported
- Auto-advance to next story (optional, user preference)

**Interaction Rules**:
- Tap hero image → toggle play/pause
- Swipe up → reveal transcript
- Swipe down → minimize transcript
- Back button → pause and return (do not stop)

#### 5. Route Progress Screen
**Purpose**: Wayfinding during multi-stop routes

**Components**:
- Current stop indicator (prominent)
- Next stop preview with distance in metres
- Simple linear progress indicator (e.g., "3 of 7")
- Walking direction indicator (optional)
- Actions: Skip to next, Replay current

**Layout**:
- Top third: Current stop summary
- Middle: Distance to next stop (large, readable outdoors)
- Bottom: Skip/replay controls

### Visual Style System

#### Typography
**Headings**:
- Font: Serif (e.g., Georgia, Playfair Display, Lora)
- Weight: 600–700
- Use for: Story titles, section headers
- Minimum size: 20px

**Body Text**:
- Font: Sans-serif (e.g., Inter, SF Pro, Roboto)
- Weight: 400 (regular), 500 (medium for emphasis)
- Use for: Descriptions, transcript, UI labels
- Minimum size: 16px (outdoor readability)

**Special Text**:
- Distance indicators: 24px+, medium weight
- Durations: 14px, uppercase, letter-spacing 0.5px
- Date ranges: 14px, serif italic

#### Color System
**Foundation**:
- Neutral backgrounds: White, light grey (#F5F5F5)
- High contrast for outdoor readability
- One accent color for primary actions (defined in theme)
- Text: Dark grey (#1A1A1A) on light, White (#FFFFFF) on dark

**Accent Color Usage**:
- Primary buttons
- Active audio controls
- Selected map markers
- Progress indicators
- Should meet WCAG AA contrast ratio (4.5:1)

**Map Markers**:
- Unvisited: Neutral (grey or accent color at 40% opacity)
- Current: Full accent color with pulse animation
- Completed: Accent color with checkmark icon

#### Spacing System
**Base unit**: 4px

**Common values**:
- Tight: 8px (within cards, between related elements)
- Standard: 16px (card padding, between sections)
- Comfortable: 24px (between major sections)
- Spacious: 32px+ (screen margins on tablet)

**Touch Targets**:
- Minimum: 44×44pt (iOS), 48×48dp (Android)
- Preferred: 56×56px for primary actions

#### Component Patterns

**Cards**:
- Border radius: 12–16px
- Shadow: Subtle (0 2px 8px rgba(0,0,0,0.08))
- No borders (rely on shadow for separation)
- White or neutral background

**Buttons**:
- Primary: Filled with accent color, white text, 48px height
- Secondary: Outlined or text only
- Border radius: 24px (pill shape) or 8px (rounded rectangle)
- No gradients or 3D effects

**Audio Controls**:
- Play button: Large (64×64px minimum)
- Skip controls: 48×48px
- Progress bar: 4px height, accent color fill
- Time labels: 12–14px, tabular numbers

**Bottom Sheets**:
- Drag handle: 32×4px rounded rectangle, centered, 8px from top
- Background: White with rounded top corners (16px radius)
- Peek height: 120–160px
- Full height: 80% of screen maximum

### Interaction Rules

#### Tap Behaviors
**Primary Actions**:
- "Listen" button → immediately start audio playback
- Play/pause → toggle with clear visual feedback
- Map marker → show preview card with subtle animation

**Secondary Actions**:
- "Read More" → expand card or navigate to full story view
- Back button → always preserve audio state

#### Swipe Gestures
**Bottom Sheets**:
- Swipe up → expand to full view
- Swipe down → collapse to peek height
- Drag handle → visual affordance for swipe

**Story Cards**:
- Horizontal swipe → navigate between stories (optional)
- No swipe-to-delete patterns

#### Scroll Behaviors
**Transcripts**:
- Auto-scroll with audio (optional, toggleable)
- Manual scroll pauses auto-scroll
- Return to auto-scroll on play/pause

**Lists**:
- Standard vertical scroll
- Pull-to-refresh for tour list updates
- No infinite scroll (show all available content)

### Outdoor Usability Considerations

**Contrast**:
- Text contrast ratio minimum: 4.5:1 (WCAG AA)
- Prefer 7:1 for outdoor use (WCAG AAA)
- Avoid low-contrast greys

**Touch Targets**:
- Increase size for outdoor use (cold hands, gloves)
- Add padding around interactive elements
- Avoid precise gestures (no small sliders)

**Audio Feedback**:
- Haptic feedback on button presses
- Audio confirmation for critical actions
- Visual feedback must not rely on color alone

**Battery Considerations**:
- Dim screens during audio playback
- Offer audio-only mode (black screen)
- Show battery usage estimate for tours

### Angular Implementation Notes

**Component Structure**:
- Feature components per screen (tour-page, map-canvas, etc.)
- Shared UI components in `shared/components/`
- Maintain separation: presentation vs. business logic

**Responsive Approach**:
- Mobile-first media queries
- Use CSS Grid/Flexbox for layouts
- Avoid fixed pixel heights (use min-height, flex-grow)

**Audio Integration**:
- Use native HTML5 audio with Angular controls
- Maintain audio state in service with signals
- Support media session API for lock-screen controls

**Map Integration**:
- MapLibre GL for map rendering
- Custom marker components with Angular templates
- Bottom sheet as Angular component with drag directives

**Accessibility**:
- All interactive elements must be keyboard accessible
- ARIA labels for icon-only buttons
- Screen reader announcements for audio state changes
- Semantic HTML (nav, main, article, section)

**Performance**:
- Lazy load images below the fold
- Preload next story audio
- Use Angular animations sparingly (60fps minimum)
- Test on mid-range Android devices

## Architecture Patterns

### Signal-Based State Management

**Component-Level State**: Use `signal()` for isolated component state (toggles, local counters, UI state).

**Shared State**: Use injectable services with signals for cross-component state (see `PoiStore` in `src/app/shared/state/poi.store.ts`). The store pattern:
- Private `signal()` for writeable state
- Public `computed()` for readonly derived state
- Methods for state mutations

Example structure:
```typescript
@Injectable({ providedIn: 'root' })
export class PoiStore {
  private readonly dataSignal = signal<Data[]>([]);
  readonly data = computed(() => this.dataSignal());

  updateData(newData: Data[]): void {
    this.dataSignal.set(newData);
  }
}
```

### Data Fetching

**Primary Pattern**: Use RxJS Observables with Supabase services (`supabase-tours.service.ts`, `supabase-pois.service.ts`, `supabase-auth.service.ts`). Services return `Observable<T>` wrapped with `from()` to convert Supabase promises.

**Offline Fallback**: The `OfflineToursService` provides IndexedDB-backed storage for tours and POIs, enabling offline access and providing sample data during development.

**Error Handling**: Services fail closed - returning empty arrays/null on errors rather than throwing. Production apps should log to monitoring services.

**Type Safety**: Supabase DTOs (e.g., `SupabaseTour`) map database schema to TypeScript interfaces. These transform to domain models (e.g., `Tour`) in components.

### Component Architecture

**All components are standalone** - no NgModule usage except for framework providers in `app.config.ts`.

**File Structure**:
```
features/
  home/
    home-page.component.ts
    home-page.component.html
    home-page.component.scss
  tour/
    tour-page.component.ts       # Tour details page
    map-canvas.component.ts      # Map display component
    poi-media.component.ts       # POI media viewer
  admin/
    admin-dashboard-page.component.ts
    admin-login-page.component.ts
    admin-tours-page.component.ts
    admin-pois-page.component.ts
    admin-poi-media-page.component.ts
shared/
  components/     # Reusable UI components (theme-toggle, etc.)
  services/       # Supabase API services
  state/          # Signal-based stores, offline tours service
  models/         # TypeScript interfaces
  auth/           # Guards and auth logic
  map/            # MapLibre service
  data/           # Sample tour data
  styles/         # Global styles and themes
```

**Component Inputs**: Use `input()` function, not `@Input()` decorator.

**Effects**: Use `effect()` sparingly, only for synchronizing with non-reactive APIs (third-party libraries, logging). Never use effects to drive component state changes.

### Routing

Routes defined in `src/app/app.routes.ts`:
- Public routes: `/` (home), `/tour/:id` (tour details)
- Admin routes: `/admin/login`, `/admin/dashboard`, `/admin/tours`, `/admin/tours/:id/pois`, `/admin/pois/:id/media`
- Admin routes (except login) protected by `adminAuthGuard` functional guard

### Map Integration

**MapService** (`src/app/shared/map/map.service.ts`) wraps MapLibre GL:
- `initMap()`: Initialize map with navigation controls
- `setRouteFromGeoJson()`: Load tour route from GeoJSON URL
- `createPoiMarker()`: Create custom markers for POIs
- `flyToLocation()`: Animate camera to coordinates

Map state managed reactively through signals in components, not through imperative map event listeners.

### Theme Management

**ThemeService** (`src/app/shared/services/theme.service.ts`) provides dark mode support:
- `themeMode` signal: Current theme setting ('light' | 'dark' | 'auto')
- `appliedTheme` signal: Computed actual theme based on mode and system preference
- `setTheme(mode)`: Set theme mode and persist to localStorage
- `toggleTheme()`: Cycle through light → dark → auto
- Automatically syncs with system theme preference when in 'auto' mode
- Updates document class and meta theme-color for mobile browsers

**ThemeToggleComponent** (`src/app/shared/components/theme-toggle.component.ts`): Standalone component providing UI for theme switching.

### Offline Support

**OfflineToursService** (`src/app/shared/state/offline-tours.service.ts`) enables offline functionality:
- Uses IndexedDB to store tours and POIs locally
- Seeds database with sample tour data on initialization
- Provides fallback data when offline or Supabase unavailable
- Separate object stores for tours and POIs with indexed queries

## Testing

### Unit Tests (Vitest)
- Test files: `*.spec.ts` co-located with source
- Run: `npm test`
- Focus on stores, services, and component logic
- Example: `poi.store.spec.ts` tests signal computations and state mutations

### E2E Tests (Cypress)
- Test files: `cypress/e2e/*.cy.ts`
- Run: `npm run e2e`
- Base URL: `http://localhost:4200`
- Admin credentials in `cypress.config.ts` env variables
- Tests cover: auth flows, CRUD operations, UI interactions

## Code Style Rules

### Angular-Specific Rules

1. **Standalone Components Only**: All components, directives, and pipes must be standalone.

2. **Component Inputs**: Use `input()` function with type inference, not `@Input()` decorator.

3. **Signal-Based Reactivity**: Prefer signals over RxJS for component state. Use RxJS only for async operations (HTTP, timers, complex streams).

4. **File Naming**: Kebab-case for all files and folders (`user-profile.component.ts`).

5. **Effect Usage**: Avoid `effect()` except when necessary to sync with non-reactive APIs. Never use for state derivation (use `computed()` instead).

### TypeScript Rules

1. **Type Safety**: Never use `any` or `unknown` without explicit justification. All functions, variables, and interfaces must be strongly typed.

2. **Async Operations**: Prefer `async/await` for readability over raw promises where appropriate. Use RxJS operators for complex stream transformations.

3. **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`) to handle potential null/undefined values.

### Prettier Configuration

Applied automatically via `package.json` prettier config:
- Print width: 100 characters
- Single quotes: true
- HTML parser: angular (for proper Angular template formatting)

## Domain Models

### Core Interfaces

**Tour** (`src/app/shared/models/tour.models.ts`):
```typescript
interface Tour {
  id: string;
  title: string;
  distanceKm: number;
  durationMinutes: number;
  price: string;
  languageOptions: string[];
  routeGeoJsonUrl: string;
  coverImages: string[];
}
```

**POI (Point of Interest)**:
```typescript
interface Poi {
  id: string;
  tourId: string;
  orderIndex: number;
  lat: number;
  lng: number;
  title: string;
  address: string;
  descriptionByLanguage: { [code: string]: string };
  audioByLanguage: { [code: string]: string };
  images: string[];
  optionalMedia?: {
    musicUrl?: string;
    videoUrl?: string;
  };
}
```

## Supabase Integration

### Database Schema

- **tours** table: id, title, location, distance_km, duration_minutes, price_cents, currency, route_url, cover_image_url, is_published
- **pois** table: tour_id (FK), lat, lng, order_index, descriptions, audio files, media URLs

### Authentication

- Admin authentication via `supabase-auth.service.ts`
- Session management with Supabase client
- Protected routes use `adminAuthGuard` functional guard

### Storage

- Media files stored in Supabase Storage
- Public URLs for images, GeoJSON routes, and audio files
- `supabase-media.service.ts` handles uploads and deletions

## Admin Features

The admin interface (`/admin/*` routes) provides:
1. **Admin Dashboard**: Overview page with quick access to management features (`/admin/dashboard`)
2. **Tours Management**: Create, update, delete tours; manage metadata and route files (`/admin/tours`)
3. **POIs Management**: Add/edit stops for each tour; set coordinates and descriptions (`/admin/tours/:id/pois`)
4. **Media Management**: Upload images, audio files per POI and language (`/admin/pois/:id/media`)
5. **JSON Import**: Bulk import tour data from JSON files (see `SIMPLE-IMPORT-INSTRUCTIONS.md`)

## Important Notes

1. **No Direct DbContext Access**: All data access goes through Supabase services. Never bypass service layer to access Supabase client directly in components.

2. **PWA/Service Worker**: Enabled in production builds. Cache configuration in `ngsw-config.json`. Clear service worker cache when debugging production builds.

3. **Offline Support**: IndexedDB is used to cache tour data for offline access. The `OfflineToursService` seeds sample data on first load. Check browser IndexedDB tools for debugging offline data.

4. **Theme System**: The app supports light, dark, and auto (system preference) themes. Theme preference is persisted in localStorage. Theme changes update both the document class and mobile browser theme-color meta tag.

5. **Credentials in Cypress Config**: `cypress.config.ts` contains test credentials. Never commit production credentials. Use environment variables for sensitive data.

6. **MapLibre Style URL**: Map style URL must be configured per environment (dev vs prod). Check `map.service.ts` initialization.

7. **Tour Import Workflow**: See `MANUAL-IMPORT-GUIDE.md` and `SIMPLE-IMPORT-INSTRUCTIONS.md` for detailed instructions on importing tour data via JSON files.
