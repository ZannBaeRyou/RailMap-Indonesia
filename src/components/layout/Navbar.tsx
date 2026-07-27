'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, Wifi } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ThemeSwitcher from '@/components/ui/ThemeSwitcher';

export default function Navbar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Mobile Logo */}
        <div className="md:hidden font-bold text-primary flex items-center gap-2 shrink-0">
          🚆 RailMap
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Cari kereta, nomor KA, stasiun, operator, atau rute..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pl-9"
            />
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-mono text-xs">{format(time, 'HH:mm:ss')} WIB</span>
          </div>
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
            <Wifi className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Online</span>
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
