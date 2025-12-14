
'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from './ui/input';

interface SearchProps {
  placeholder: string;
  onSearchChange: (query: string) => void;
  initialQuery?: string;
}

export function Search({ placeholder, onSearchChange, initialQuery }: SearchProps) {
  const handleSearch = useDebouncedCallback((term: string) => {
    onSearchChange(term);
  }, 300);

  return (
    <div className="relative flex-1">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="w-full rounded-lg bg-background pl-9"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={initialQuery}
      />
    </div>
  );
}
