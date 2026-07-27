'use client';

import Link from 'next/link';
import { Map, Train, Navigation, AlertTriangle, Building2, LayoutDashboard, Radio } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Beranda', icon: LayoutDashboard },
    { href: '/live', label: 'Live Board', icon: Radio },
    { href: '/map', label: 'Track Map', icon: Map },
    { href: '/stations', label: 'Stasiun', icon: Navigation },
    { href: '/trains', label: 'Kereta', icon: Train },
    { href: '/operators', label: 'Operator', icon: Building2 },
    { href: '/disruptions', label: 'Gangguan', icon: AlertTriangle },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 border-r bg-card h-screen sticky top-0 shrink-0">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Train className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground leading-none">RailMap</h1>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Indonesia</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t">
        <p className="text-[10px] text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} RailMap Indonesia
        </p>
        <p className="text-[9px] text-muted-foreground/60 text-center mt-0.5">Data Simulasi • v0.1.0</p>
      </div>
    </aside>
  );
}
