---
name: El Campo Frontend Standards
description: Comprehensive guide and standards for the "Software El Campo" frontend project. MUST BE READ before any coding task.
---

# El Campo Frontend Architecture & Standards

## 1. Project Overview
- **Stack**: Vite + React + Tailwind CSS (v4) + React Router v7
- **State Management**: React Query (@tanstack/react-query) + Context API (Auth, Proyecto)
- **PWA**: vite-plugin-pwa (Offline first approach)
- **Icons**: lucide-react

## 2. Directory Structure
- **src/modules/**: Feature-based modules (Finanzas, Producción, Alimentación, etc.). Each module contains its own pages, components, and specific logic.
- **src/components/common/**: **CORE UI LIBRARY**. 
- **src/api/**: Centralized API layer. `api/modules/*.js` contains per-module endpoints.
- **src/hooks/**: 
    - `queries/`: React Query GET hooks (useGastos, useLotes, etc.)
    - `mutations/`: React Query mutation hooks (useCrearGasto, etc.)
- **src/context/**: Global state (AuthContext, ProyectoContext).
- **src/utils/**: Helpers (formatters, constants, haptic).

## 3. EXISTING COMMON COMPONENTS (DO NOT RECREATE)
**ALWAYS check `src/components/common/index.js` first.**
- **`LoadingSpinner`**: Use for all loading states.
- **`Button`**: Standard buttons (primary, secondary, danger).
- **`Input`**: Text inputs with label and error support.
- **`Select`**: Dropdowns.
- **`Card`**: Basic container with shadow/rounded corners.
- **`Modal`**: Center dialogs (desktop/mobile).
- **`BottomSheet`**: Sliding bottom sheet for Mobile actions/forms. **PREFERRED for mobile forms over Modals.**
- **`FAB`**: Floating Action Button (bottom-right).
- **`Toast`**: Notification system.
- **`Skeleton`**: Loading placeholders (`SkeletonCard`, `SkeletonRow`, `SkeletonPage`).
- **`PWAInstallBanner`**: Custom install prompt.

## 4. Coding Standards (Senior Architect Mode)

### A. Mobile-First & PWA
- **Touch Targets**: All interactive elements must be at least 44x44px.
- **Layout**: Use `MainLayout` which handles the responsive sidebar/navbar.
- **Offline**: Assume low connectivity. Use React Query's caching.
- **Haptics**: Use `src/utils/haptic.js` for significant user actions (success, error, heavy clicks).

### B. State & Data Fetching
- **React Query**: 
    - Use efficiently. Invalidations should be precise.
    - Separation of concerns: Keep API calls in `src/api` and hooks in `src/hooks`.
    - **Do not** write `fetch` or `axios` calls directly in components.

### C. Validation & Forms
- **Validation**: Centralized. Prefer Zod or existing utils.
- **Feedback**: 
    - Success -> `toast.success()` + Haptic success.
    - Error -> `toast.error()` + Haptic error.

### D. CSS / Styling
- **Tailwind**: Use utility classes.
- **Colors**: Adhere to the defined palette (likely in `index.css` or Tailwind config).
- **Dark Mode**: Ensure compatibility if implemented.

## 5. Workflow Checklist
Before implementing any feature:
1. [ ] **Check Common**: Does a component already exist in `src/components/common`?
2. [ ] **Check API**: Does the endpoint exist in `src/api/modules`?
3. [ ] **Check Hooks**: Is there a React Query hook in `src/hooks`?
4. [ ] **Mobile Review**: Will this look good on a phone? (Use BottomSheet for complex actions on mobile).

## 6. API Structure
- **Base URL**: Configured in `src/api/client.js`.
- **Modules**:
    - `finanzas.js`
    - `produccion.js`
    - `alimentacion.js`
    - `salud.js`
    - `inventario.js`
    - `calendario.js`

## 7. Key Files
- `src/App.jsx`: Routing & Suspense boundaries.
- `src/components/layout/Layout.jsx`: Main application wrapper.
- `src/context/AuthContext.jsx`: Authentication logic.
