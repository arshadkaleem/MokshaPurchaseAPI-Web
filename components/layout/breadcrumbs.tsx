'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

/**
 * Breadcrumbs Component
 * Shows navigation trail
 * 
 * C# equivalent: Breadcrumb navigation in layout
 * 
 * Like: Home > Projects > Edit Project
 */

export function Breadcrumbs() {
  const pathname = usePathname();

  // Parse pathname into breadcrumb segments
  const segments = pathname
    .split('/')
    .filter((segment) => segment !== '')
    .filter((segment) => segment !== 'dashboard');

  // If no segments or just dashboard, show nothing
  if (segments.length === 0) {
    return null;
  }

  // Format segment for display (kebab-case to Title Case)
  const formatSegment = (segment: string): string => {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Build breadcrumb items
  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    ...segments.map((segment, index) => {
      const href = `/dashboard/${segments.slice(0, index + 1).join('/')}`;
      return {
        label: formatSegment(segment),
        href,
      };
    }),
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-gray-900 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.slice(1).map((crumb, index) => (
        <div key={crumb.href} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {index === breadcrumbs.length - 2 ? (
            // Last item - not a link
            <span className="font-medium text-gray-900">{crumb.label}</span>
          ) : (
            // Other items - links
            <Link
              href={crumb.href}
              className="hover:text-gray-900 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}