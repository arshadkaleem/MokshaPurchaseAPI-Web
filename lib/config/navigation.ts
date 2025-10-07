import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Package,
  ShoppingCart,
  FileText,
  CreditCard,
  Warehouse,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

/**
 * Navigation Configuration
 * 
 * C# equivalent: Route configuration or menu structure
 * 
 * Like defining your menu items in _Layout.cshtml:
 * <li><a asp-controller="Projects" asp-action="Index">Projects</a></li>
 */

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  description?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/**
 * Main navigation items
 */
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
    description: 'Manage construction projects',
  },
  {
    title: 'Suppliers',
    href: '/dashboard/suppliers',
    icon: Users,
    description: 'Manage suppliers and vendors',
  },
  {
    title: 'Materials',
    href: '/dashboard/materials',
    icon: Package,
    description: 'Material catalog',
  },
  {
    title: 'Purchase Orders',
    href: '/dashboard/purchase-orders',
    icon: ShoppingCart,
    badge: 'New',
    description: 'Create and manage POs',
  },
  {
    title: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
    description: 'Invoice management',
  },
  {
    title: 'Payments',
    href: '/dashboard/payments',
    icon: CreditCard,
    description: 'Payment tracking',
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: Warehouse,
    description: 'Stock management',
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    description: 'Analytics and reports',
  },
];

/**
 * Grouped navigation (for future use)
 */
export const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [navItems[0]], // Dashboard
  },
  {
    title: 'Core Management',
    items: [
      navItems[1], // Projects
      navItems[2], // Suppliers
      navItems[3], // Materials
    ],
  },
  {
    title: 'Procurement',
    items: [
      navItems[4], // Purchase Orders
      navItems[5], // Invoices
      navItems[6], // Payments
    ],
  },
  {
    title: 'Operations',
    items: [
      navItems[7], // Inventory
      navItems[8], // Reports
    ],
  },
];