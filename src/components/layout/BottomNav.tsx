'use client';

import Link from 'next/link';
import { Search, Map, Train, Navigation, AlertTriangle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Beranda', icon: Navigation },
    { href: '/live', label: 'Live', icon: Train },
    { href: '/map', label: 'Peta', icon: Map },
    { href: '/disruptions', label: 'Info', icon: AlertTriangle },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-background border-t flex items-center justify-around p-2 pb-safe z-50">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
