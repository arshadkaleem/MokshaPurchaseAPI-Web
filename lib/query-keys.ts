/**
 * Centralized query keys for TanStack Query
 * WHY: Organized cache invalidation and type safety
 */

export const queryKeys = {
  // Auth
  auth: {
    currentUser: ['auth', 'currentUser'] as const,
  },

  // Projects
  projects: {
    all: ['projects'] as const,
    lists: () => [...queryKeys.projects.all, 'list'] as const,
    list: (filters?: { status?: string; projectType?: string; page?: number }) =>
      [...queryKeys.projects.lists(), { filters }] as const,
    details: () => [...queryKeys.projects.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.projects.details(), id] as const,
  },

  // Suppliers
  suppliers: {
    all: ['suppliers'] as const,
    lists: () => [...queryKeys.suppliers.all, 'list'] as const,
    list: (filters?: { isGSTRegistered?: boolean; page?: number }) =>
      [...queryKeys.suppliers.lists(), { filters }] as const,
    details: () => [...queryKeys.suppliers.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.suppliers.details(), id] as const,
  },

  // Materials
  materials: {
    all: ['materials'] as const,
    lists: () => [...queryKeys.materials.all, 'list'] as const,
    list: (filters?: { category?: string; page?: number }) =>
      [...queryKeys.materials.lists(), { filters }] as const,
    details: () => [...queryKeys.materials.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.materials.details(), id] as const,
  },

  // Purchase Orders
  purchaseOrders: {
    all: ['purchase-orders'] as const,
    lists: () => [...queryKeys.purchaseOrders.all, 'list'] as const,
    list: (filters?: { status?: string; projectId?: number; page?: number }) =>
      [...queryKeys.purchaseOrders.lists(), { filters }] as const,
    details: () => [...queryKeys.purchaseOrders.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.purchaseOrders.details(), id] as const,
  },

  // Invoices
  invoices: {
    all: ['invoices'] as const,
    lists: () => [...queryKeys.invoices.all, 'list'] as const,
    list: (filters?: { status?: string; page?: number }) =>
      [...queryKeys.invoices.lists(), { filters }] as const,
    details: () => [...queryKeys.invoices.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.invoices.details(), id] as const,
  },
} as const;