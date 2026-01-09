'use client';

import { Button } from '@/components/ui/button';
import { useStore, type StoreVibe } from '@/lib/store-context';
import { cn } from '@/lib/utils';
import { Sparkles, Briefcase, Gem } from 'lucide-react';

export function StoreSwitcher() {
  const { vibe, setVibe } = useStore();

  const vibes: { id: StoreVibe; label: string; icon: any }[] = [
    { id: 'gen-z', label: 'Gen Z', icon: Sparkles },
    { id: 'luxury', label: 'Luxury', icon: Gem },
    { id: 'professional', label: 'Pro', icon: Briefcase },
  ];

  return (
    <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-full border">
      {vibes.map((v) => {
        const Icon = v.icon;
        const isActive = vibe === v.id;
        return (
          <Button
            key={v.id}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setVibe(v.id)}
            className={cn(
              "rounded-full gap-2 transition-all",
              isActive && "shadow-md"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className={isActive ? 'inline-block' : 'hidden md:inline-block'}>
              {v.label}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
