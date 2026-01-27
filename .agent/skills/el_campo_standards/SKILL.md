---
name: El Campo Frontend Standards
description: Comprehensive guide and standards for the "Software El Campo" frontend project. MUST BE READ before any coding task.
---

# El Campo Frontend Architecture & Standards

## 1. Project Overview
- **Stack**: Vite + React + Tailwind CSS (v4) + React Router v7
- **Language**: **JavaScript (.jsx)** (TypeScript migration aborted, ensure all files are .js/.jsx)
- **State Management**: React Query (@tanstack/react-query) + Context API (Auth, Proyecto)
- **PWA**: vite-plugin-pwa (Offline first approach)
- **Icons**: lucide-react

## 2. Directory Structure
- **src/modules/**: Feature-based modules (Finanzas, Producción, Alimentación, etc.). Each module contains its own pages, components, and specific logic.
- **src/components/common/**: **CORE UI LIBRARY**. 
- **src/api/**: Centralized API layer. `api/modules/*.js` contains per-module endpoints.
- **src/hooks/**: 
    - `queries/`: React Query GET hooks (useGastos, useLotes, etc.)
    - `mutations/`: React Query mutation hooks (useCreateGasto, etc.)
- **src/context/**: Global state (AuthContext, ProyectoContext).
- **src/utils/**: Helpers (formatters, constants, haptic).

## 3. CORE COMPONENT LIBRARY (Use exclusively)
**ALWAYS import from `src/components/common`**. Do not implement custom UI if a component exists.

| Component | Description | Usage Rule |
|-----------|-------------|------------|
| **`PageHeader`** | Standard header with title, subtitle, and desktop action. | **MANDATORY** for every page top. |
| **`EmptyState`** | Illustration + Title + Action for empty lists. | **MANDATORY** when lists are empty. |
| **`BottomSheet`** | Sliding sheet (mobile) / Center modal (desktop). | **PREFERRED** for forms and details over `Modal`. |
| **`FAB`** | Floating Action Button. | **MANDATORY** for primary actions on Mobile. |
| **`LoadingSpinner`** | Circular loader. | Use for full-page or section loading. |
| **`Card`** | Container with shadow/rounded corners. | Base for lists and details. |
| **`Button`** | Standard buttons (primary, secondary). | Use for all interactions. |
| **`Input` / `Textarea`** | Form fields with consistent styling. | Use for all forms. |
| **`Select`** | Styled dropdown. | Use for all selections. |
| **`Toast`** | Notification popup. | Use for success/error feedback. |

## 4. Design Patterns & UI/UX Standards

### A. Page Structure
Every page (`src/modules/*/pages/*.jsx`) must follow this logical structure:
1. **Hooks**: Data fetching & mutations.
2. **State**: Local UI state (modals, forms).
3. **Render**:
   - `LoadingSpinner` if loading.
   - `PageHeader` at the top.
   - List/Grid content OR `EmptyState`.
   - `FAB` (fixed bottom-right) for mobile main action.
   - `BottomSheet` containing the creation/edit form.
   - `Toast` component at the bottom.

### B. Mobile-First & PWA
- **Forms**: Use `BottomSheet` with `height="auto"`. It handles mobile drag gestures and desktop centering automatically.
- **Actions**:
    - **Desktop**: Button inside `PageHeader` (`action` prop).
    - **Mobile**: `FAB` component.
- **Touch**: Targets must be >44px.
- **Offline**: Use React Query caching. Handle errors gracefully.

### C. Forms & Validation
- Reset form state after successful submission.
- Use `useMemo` for dropdown options derived from queries.
- Do not use inline `style`, use Tailwind classes.

## 5. Coding Workflow
1. **Check API**: Ensure endpoints exist in `src/api/modules/*.js`.
2. **Check Hooks**: Ensure React Query hooks exist in `src/hooks/{queries,mutations}/*.js`.
3. **Build UI**: Assemble using **Shared Components**.
4. **Mobile Check**: Verify `FAB` and `BottomSheet` behavior.

## 6. API & Data
- **Client**: `src/api/client.js` (Interceptor for Auth Token & 401 handling).
- **Queries**: `use*` (e.g., `useGastos`). Returns `{ data, isLoading, error }`.
- **Mutations**: `useCreate*`, `useUpdate*`. Returns `{ mutateAsync, isPending }`.

## 7. Key Files
- `src/App.jsx`: Routing.
- `src/components/common/index.js`: Barrel file for all UI components.
- `src/index.css`: Global styles & Tailwind directives.
