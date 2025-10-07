import { Sidebar } from '@/components/layout/sidebar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { UserMenu } from '@/components/layout/user-menu';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';

/**
 * Dashboard Layout
 * 
 * C# equivalent: _Layout.cshtml with sidebar
 * 
 * Structure:
 * ┌─────────────────────────────────┐
 * │ Sidebar │   Header (breadcrumb)  │
 * │         ├────────────────────────┤
 * │         │                        │
 * │  Menu   │    Main Content        │
 * │         │                        │
 * │         │                        │
 * └─────────────────────────────────┘
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Reduced width from w-64 to w-56 */}
      <aside className="hidden md:flex w-56 flex-shrink-0"> {/* Changed: w-64 to w-56 */}
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-white px-4"> {/* Changed: h-16 to h-14, px-6 to px-4 */}
          {/* Mobile Menu Button */}
          <MobileSidebar />

          {/* Breadcrumbs */}
          <Breadcrumbs />

          {/* Spacer */}
          <div className="flex-1" />

          {/* User Menu */}
          <UserMenu />
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4"> {/* Changed: p-6 to p-4 */}
          {children}
        </main>
      </div>
    </div>
  );
}