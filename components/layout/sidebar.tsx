'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Package,
  ShoppingCart,
  FileText,
  DollarSign,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[]; // If undefined, visible to all roles
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
  },
  {
    title: 'Suppliers',
    href: '/dashboard/suppliers',
    icon: Users,
  },
  {
    title: 'Materials',
    href: '/dashboard/materials',
    icon: Package,
  },
  {
    title: 'Purchase Orders',
    href: '/dashboard/purchase-orders',
    icon: ShoppingCart,
  },
  {
    title: 'Invoices',
    href: '/dashboard/invoices',
    icon: FileText,
    roles: ['Admin', 'Manager', 'Finance'], // Only these roles can see
  },
  {
    title: 'Payments',
    href: '/dashboard/payments',
    icon: DollarSign,
    roles: ['Admin', 'Finance'],
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['Admin', 'Manager'],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Filter nav items based on user role
  const visibleNavItems = navItems.filter((item) => {
    if (!item.roles) return true; // Visible to all
    return user?.role && item.roles.includes(user.role);
  });

  return (
    <div
      className={cn(
        'relative h-screen border-r bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <span className="text-lg">Moksha</span>
          </Link>
        )}
        
        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn('ml-auto', isCollapsed && 'mx-auto')}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isCollapsed && 'justify-center px-2',
                  isActive && 'bg-primary/10 text-primary hover:bg-primary/15'
                )}
                title={isCollapsed ? item.title : undefined}
              >
                <Icon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
                {!isCollapsed && <span>{item.title}</span>}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* User Info at Bottom */}
      {!isCollapsed && (
        <>
          <Separator />
          <div className="p-4">
            <div className="text-sm">
              <p className="font-medium truncate">{user?.userName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user?.role}
                </span>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}