'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/utils';
import { navItems } from '@/lib/config/navigation';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-full flex-col border-r bg-white"> {/* Changed: Added w-full */}
      {/* Logo Section - Made more compact */}
      <div className="flex h-14 items-center border-b px-4"> {/* Changed: h-16 to h-14, px-6 to px-4 */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground"> {/* Changed: h-8 w-8 to h-7 w-7 */}
            <span className="text-base font-bold">M</span> {/* Changed: text-lg to text-base */}
          </div>
          <span className="text-base font-semibold">Moksha</span> {/* Changed: text-lg to text-base */}
        </Link>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-2 py-4"> {/* Changed: px-3 to px-2 */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" /> {/* Changed: h-5 w-5 to h-4 w-4, added flex-shrink-0 */}
                <span className="flex-1 truncate">{item.title}</span> {/* Added truncate */}
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs"> {/* Added text-xs */}
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer Section - Made more compact */}
      <div className="border-t p-3"> {/* Changed: p-4 to p-3 */}
        <p className="text-xs text-gray-500 text-center">
          v1.0.0
        </p>
      </div>
    </div>
  );
}