# Recipes App - Frontend

## Description

A modern, responsive frontend application for discovering, cooking, and saving recipes, built with React, TypeScript, and Vite. The app lets users browse a recipe catalog, save favorites, track their viewing history, compare recipes side by side, find dishes they can cook with the ingredients on hand (Smart Matcher), and for admin users — create, edit, and delete recipes. Recommendations are personalized using content-based filtering with a weighted-sum scoring model that takes into account a user's favorite tags, saved recipes, dietary restrictions, and disliked ingredients.

The app currently ships with a fully in-browser mock backend (no server required): recipes, profiles, favorites, and viewing history are persisted to `localStorage`, and auth state survives browser restarts.

## Quick Start

### Prerequisites

Before setting up the project, ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (comes with Node.js) (v9 or higher)

### Installation

### Steps

1. Clone the repository

```
git clone <repository-url>
```

2. Navigate to the frontend directory:

```bash
cd frontend-app/recipes
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

> **Note:** No backend or environment variables are required. The application uses an in-browser mock API layer (`src/api/`) backed by `localStorage`. See [Mock API Layer](#mock-api-layer) for details.

## Available Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start development server                 |
| `npm run build`       | Build for production                     |
| `npm run lint`        | Check for linting errors                 |
| `npm run lint:fix`    | Fix linting errors automatically         |
| `npm run format`      | Format code with Prettier                |
| `npm run lint-staged` | Run lint-staged manually (used by Husky) |

## Project Structure

```
frontend-app/recipes/
├── src/
│   ├── api/                    # Mock API layer (client + router + handlers)
│   │   ├── handlers/          # Per-resource handlers (recipes, users, favorites, auth)
│   │   ├── client.ts          # Public apiClient wrapper around mockRouter
│   │   ├── endpoints.ts       # Centralized endpoint URLs
│   │   ├── mockRouter.ts      # Pattern-based route matcher
│   │   └── types.ts           # Request/response shapes
│   ├── assets/
│   │   ├── images/            # SVG sprites and icons
│   │   └── styles/            # Global SCSS (_colors.scss, _variables.scss)
│   ├── components/
│   │   ├── catalog/           # Catalog-page-specific UI (filter panel, toolbar)
│   │   ├── common/            # Reusable UI primitives (Button, Modal, Toast, etc.)
│   │   ├── home/              # Home-page-specific UI (step list)
│   │   ├── profile/           # Profile area (settings, preferences, favorites, admin, recipe-form)
│   │   ├── recipe-comparison/ # Comparison-page UI
│   │   ├── recipe-details/    # Recipe-details-page UI (hero, ingredients, steps, comments)
│   │   └── smart-matcher/     # Smart Matcher UI (pantry input, match cards)
│   ├── context/               # React Context providers (Auth, Comparison, SearchFocus, Toast)
│   ├── data/                  # JSON seed data (recipes.json, users.json)
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components (one folder per route)
│   ├── router/                # Route guards (ProtectedRoute)
│   ├── types/                 # Shared TypeScript type definitions
│   ├── utils/                 # Shared utility functions
│   │   ├── validation/        # Form validation rules
│   │   ├── classNames.ts      # Conditional className helper
│   │   ├── recommendations.ts # Scoring + similarity + filtering algorithms
│   │   └── recommendationService.ts # High-level wrapper used by pages
│   ├── App.tsx                # Root application component
│   ├── AppRoutes.tsx          # Route definitions
│   ├── Layout.tsx             # Main layout wrapper (Header + Outlet + Footer)
│   └── index.tsx              # Application entry point
├── index.html
├── package.json
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── README.md
```

## Mock API Layer

This is a temporary solution that lets the project focus on frontend development and UI/UX without depending on a server. The structure intentionally mirrors a real HTTP API — `apiClient` mimics `fetch`, endpoints are centralized in one file, and handlers are organized by resource — so swapping the mock layer for a real backend in the future is a localized change (replace `mockRouter` dispatch with a real `fetch` call inside `apiClient`) and leaves the rest of the app untouched.

All data operations go through this in-browser mock API:

- **`apiClient<T>(path, options)`** — public entry point used by all pages and hooks. Mirrors a real `fetch`-style API (`method`, `body`, `params`).
- **`mockRouter`** — matches pattern-based routes like `GET /api/recipes/:id` and dispatches to the appropriate handler.
- **Handlers** (`src/api/handlers/`) — implement business logic per resource. Each mutation is persisted to `localStorage` via a per-handler overlay key (e.g. `user_recipes_overlay`, `user_profiles_overlay`), so user-created recipes, favorites, and viewing history survive reloads and browser restarts.
- **Auth** — `AuthContext` persists the logged-in user in `localStorage`. Two pre-seeded accounts are available:
  - `admin@recipeapp.com` / `admin123` — admin role (can create/edit/delete recipes)
  - `maria@recipeapp.com` / `maria123` — regular user

Any code that talks to the API uses `apiClient` directly — there is no awareness inside the rest of the app that the backend is mocked.

## Key Components and Modules

### Core Pages

- **Home** (`/`): Personalized "Recommended For You" rail (or "Worth a Try" for guests) + "Top Recipes"
- **Catalog** (`/catalog`): Full recipe list with filters (diet, difficulty, cooking time, ingredients), search, and sort
- **Smart Matcher** (`/smart-matcher`): Find recipes you can cook with what's in your pantry, ranked by overlap coefficient
- **Recipe Comparison** (`/recipe-comparison`): Side-by-side comparison of up to several recipes (nutrition, cooking time, difficulty, etc.)
- **Recipe Details** (`/recipes/:id`): Full recipe view (ingredients, steps, nutrition, comments). Logs to viewing history.
- **Profile** (`/profile`, `/profile/:tab`): Settings, Preferences, Favorites & History, and (admin only) recipe authoring

### Context Providers

- **AuthProvider**: Login/register/logout state; persists to `localStorage`; exposes `openAuthModal` for guest-only actions
- **ComparisonProvider**: Tracks recipes currently added to the side-by-side comparison
- **SearchFocusProvider**: Lets any component request focus on the header search input (used by Catalog toolbar)
- **ToastProvider**: Centralized toast notifications with optional action button (top-right portal `#toast-root`)

### Custom Hooks

- `useApi<T>()`: Imperative async wrapper exposing `{ data, loading, error, execute, reset }`
- `useFetch<T>()`: Declarative fetch (auto-runs on URL change)
- `useAuth`, `useComparison`, `useFavorites`, `useRecipes`, `useSearch`: Thin wrappers around the corresponding contexts/endpoints
- `useFieldValidation`: Form field validation
- `useRecipeAdminActions`: Shared edit/delete flow for admin (Home/Catalog/Profile)
- `useRecentSearches`: Persisted recent-search history for the header search panel

### Reusable Components

Located in `src/components/common/`:

- **Button**, **IconButton**: Button primitives with multiple variants and sizes
- **Input**: Form input with caption, error, surfaces, and optional required marker
- **Modal**, **ConfirmModal**: Portal-based dialog and a higher-level confirmation pattern
- **Toast**, **ToastContainer**: Notification system with tone/action/duration
- **ChipGroup**: Tag/diet/disliked-ingredient editor with suggestions and quick picks
- **SuggestionList**: Dropdown suggestion picker used by Search, ChipGroup, and ingredient inputs
- **RecipeCard**, **RecipeGrid**: Recipe browsing primitives (favorite/compare toggles, admin edit/delete, disliked-ingredient warning badge)
- **RangeFilter**, **ProgressBar**, **Rating** equivalents: Catalog filtering and visual feedback
- **Header**, **Footer**, **NavLink**: Site chrome with active-state highlighting
- **StatusPill**: Small status indicator (used by the recipe form section headers)
- **Tabs**, **SectionHeading**: Structural primitives

## Recommendation Engine

Personalization is implemented in `src/utils/recommendations.ts` using established information-retrieval and data-mining techniques:

- **Jaccard similarity** between recipe tags and a user's favorite tags
- **Content-based filtering** with a weighted-sum model:
  - Tag similarity 35% + similarity to already-favorited recipes 30% + rating 20% + view-history bonus 15%
  - Penalty multipliers: dietary mismatch ×0.3, disliked ingredient ×0.2 (soft constraint, not hard filter)
- **Top-K ranking** after scoring
- **Overlap coefficient (Szymkiewicz–Simpson)** for Smart Matcher ingredient ranking
- **Match-tier classification** ("ready" / "almost" / "explore") so users don't have to tune a cutoff

Disliked-ingredient matches are surfaced visually on recipe cards via a warning badge (`findDislikedMatches` helper), so users always know why a recipe slipped through despite the penalty.

## Styling

The project uses SCSS (Sass) for styling with a modular approach:

- Global styles in `src/assets/styles/` (`_colors.scss`, `_variables.scss`)
- Component-specific styles using CSS Modules (`.module.scss`), co-located with their component
- BEM naming convention (`block__element--modifier`)
- All colors must come from `_colors.scss` — no raw color values

## Code Quality

### Linting and Formatting

The project uses ESLint and Prettier to maintain code quality:

- ESLint flat config in `eslint.config.js`
- Prettier configuration in `.prettierrc` / package config
- Pre-commit hooks via Husky + lint-staged ensure code is formatted and linted before commits

### Pre-commit Hooks

Husky automatically runs `lint-staged` on staged files before each commit:

- JavaScript/TypeScript files are formatted (Prettier) and linted (ESLint with autofix)
- JSON, CSS, SCSS, Markdown, and HTML files are formatted

## Development Guidelines

### Adding New Components

1. Create a new directory in the appropriate folder (`components/common/`, `components/<feature>/`, `pages/`, etc.)
   - Directory name should be in **kebab-case** (e.g., `recipe-card`, `confirm-modal`)
2. Inside the directory, create files using these naming conventions:
   - Component file: **PascalCase** (e.g., `RecipeCard.tsx`, `ConfirmModal.tsx`)
   - Styles: **PascalCase.module.scss** (e.g., `RecipeCard.module.scss`)
   - Types: `types.ts` (if component-specific types are needed)
   - Utils: `utils.ts` (if component-specific utility functions are needed)
3. Use **camelCase** for utility functions and custom hooks (e.g., `findDislikedMatches`, `useRecipeAdminActions`)

**Example structure:**

```
components/common/
  recipe-card/
    RecipeCard.tsx
    RecipeCard.module.scss
    types.ts
    utils.ts
```

### State Management

- Use React Context for global state (auth, comparison, search-focus, toast)
- Use local component state for UI-specific state
- Custom hooks for reusable logic
- Mutations go through `apiClient` so they are persisted via the mock backend

### API Integration

- Use `useApi<T>()` for imperative requests with `loading`/`error` state
- Use `useFetch<T>()` for declarative auto-fetching tied to a URL
- All endpoints are listed in `src/api/endpoints.ts` — do not hardcode paths

### Form Validation

- Validation rules defined in `src/utils/validation/`
- Use `useFieldValidation` hook for form field validation
- Recipe-form-specific validation lives in `components/profile/recipe-form/utils.ts`

## Contributing

1. Create a feature branch from `develop`
2. Make your changes following the existing code style
3. Ensure linting and formatting passes (`npm run lint:fix`, `npm run format`)
4. Test your changes locally
5. Commit your changes
6. Submit a pull request

### Commit Message Guidelines

Follow these naming conventions for branches and commits:

**Branch Naming:**

- Format: `feat/<short-slug>` or `fix/<short-slug>`

**Commit Message Format:**

- Format: `[FE] short description`
- `short description` — brief description starting with a verb in base form (e.g., add, fix, create, update, remove)

### Important Considerations

- Follow the existing project structure and naming conventions
- Write TypeScript types for all new components and utilities
- Keep components small and focused on a single responsibility
- Reuse `src/components/common/` before creating new components
- All colors must come from `_colors.scss` — no raw color values

## Technology Stack

- **React 19** + **TypeScript** - UI framework with type safety
- **Vite 7** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Sass (SCSS)** + **CSS Modules** - Component-scoped styling
- **ESLint** + **Prettier** + **Husky** + **lint-staged** - Code quality tools
- **In-browser mock backend** with `localStorage` persistence — no external service required

## Authors

- **Anastasiia Khliborob** - JS (React) Developer
