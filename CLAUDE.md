# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code with Prettier
npm run format
```

## Architecture Overview

This is a **Next.js 14 App Router** application for construction purchase management, built with TypeScript, React, and TailwindCSS. The codebase is designed with C# developers in mind (comments include C# equivalents).

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + shadcn/ui (Radix UI primitives)
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios
- **Icons**: Lucide React

### API Integration

**Base URL Configuration**: Set via `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Default: `http://localhost:5000`
- Production: `https://backend.manishainfra.com/`

**API Client** (`lib/api/client.ts`):
- Centralized Axios instance with request/response interceptors
- Automatic Bearer token injection from `tokenStorage`
- Global error handling (401 → logout, etc.)
- All API routes follow pattern: `/api/v1/{Resource}`

### Authentication Architecture

**Flow**: JWT-based authentication with access/refresh tokens stored in localStorage

1. **Middleware** (`middleware.ts`): Server-side route protection
   - Redirects unauthenticated users from `/dashboard/*` to `/login`
   - Redirects authenticated users from `/login` to `/dashboard/projects`
   - Redirects `/` to appropriate dashboard/login based on auth status

2. **Auth Context** (`lib/contexts/auth-context.tsx`): Client-side auth state
   - Provides `user`, `isAuthenticated`, `login()`, `logout()`, `checkAuth()`
   - Wraps dashboard layout via `AuthProvider`

3. **Token Storage** (`lib/utils/token-storage.ts`): Manages tokens in localStorage
   - `getToken()`, `setToken()`, `clearTokens()`

### Data Fetching Pattern

Uses **React Query (TanStack Query)** for all server state:

```
lib/api/{resource}.ts        → API client functions (like C# repositories)
lib/hooks/use{Resource}.ts   → React Query hooks (like C# services)
```

**Standard Pattern**:
1. Define API functions in `lib/api/{resource}.ts` using shared `apiClient`
2. Create custom hooks in `lib/hooks/use{Resource}.ts`:
   - `use{Resource}s()` - List query
   - `use{Resource}(id)` - Detail query
   - `useCreate{Resource}()` - Create mutation
   - `useUpdate{Resource}()` - Update mutation
   - `useDelete{Resource}()` - Delete mutation
3. All mutations automatically:
   - Show toast notifications on success/error
   - Invalidate relevant query cache
   - Handle loading states via `isPending`

**Query Keys**: Hierarchical structure for cache management
```typescript
{resource}Keys = {
  all: ['{resource}s'],
  lists: () => [...{resource}Keys.all, 'list'],
  list: (filters) => [...{resource}Keys.lists(), filters],
  details: () => [...{resource}Keys.all, 'detail'],
  detail: (id) => [...{resource}Keys.details(), id]
}
```

### Routing & Pages

**App Router Structure** (`app/` directory):
```
app/
├── login/page.tsx                          → Login page
├── dashboard/
│   ├── layout.tsx                          → Sidebar + auth wrapper
│   ├── page.tsx                            → Dashboard home
│   ├── {resource}/
│   │   ├── page.tsx                        → List view
│   │   ├── new/page.tsx                    → Create form (optional)
│   │   ├── [id]/edit/page.tsx              → Edit form
│   │   └── [id]/page.tsx                   → Detail view (optional)
```

**Resources**: projects, suppliers, materials, purchase-orders, invoices, payments, inventory, reports

### Forms & Validation

**Pattern**:
1. Define Zod schema in `lib/validations/{resource}-schema.ts`
2. Create form component in `components/forms/{action}-{resource}-form.tsx`
3. Use React Hook Form with `@hookform/resolvers/zod`
4. Form components call mutation hooks from `lib/hooks/`

**shadcn/ui Form Components**: All in `components/ui/`, generated from shadcn CLI

### Layout Components

**Sidebar Navigation** (`components/layout/sidebar.tsx`):
- Menu items configured in `lib/config/navigation.ts`
- Edit `navItems` array to modify menu

**Dashboard Layout** (`app/dashboard/layout.tsx`):
- Responsive: Desktop sidebar, mobile drawer
- Includes `QueryProvider` (React Query) and `AuthProvider`
- Fixed header with breadcrumbs and user menu

### Type Definitions

All TypeScript types in `types/` directory:
- `api.types.ts` - Generic API response types (`ApiResponse<T>`, `PaginatedResponse<T>`)
- `{resource}.types.ts` - Resource-specific types (Request/Response DTOs matching backend)
- `auth.types.ts` - User, LoginRequest, AuthResponse types

### Path Aliases

TypeScript paths configured with `@/*` → root directory:
```typescript
import { Button } from '@/components/ui/button'
import { useSuppliers } from '@/lib/hooks/useSuppliers'
```

### Styling Conventions

- **TailwindCSS utility-first**: All styling via className
- **Component variants**: Use `class-variance-authority` (CVA) in ui components
- **Theme**: Configured in `tailwind.config.ts`
- **Responsive**: Mobile-first breakpoints (md:, lg:, xl:)

## Code Style Notes

- **C# Comments**: Many files include C# equivalents in comments (e.g., "C# equivalent: ISupplierRepository") for developer context
- **Client Components**: Mark with `'use client'` when using hooks, context, or browser APIs
- **Server Components**: Default in App Router; no `'use client'` needed
- **Error Handling**: Use `getErrorMessage()` helper from `lib/api/client.ts` to extract API error messages
