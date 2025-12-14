
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Design } from '@/lib/types';

const statuses: (Design['status'] | 'All')[] = ['All', 'Draft', 'Approved', 'Rejected'];

export function DesignFilterTabs({ currentStatus }: { currentStatus: Design['status'] | 'All' }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleValueChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'All') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-4">
      <Tabs value={currentStatus} onValueChange={handleValueChange}>
        <TabsList>
          {statuses.map((status) => (
            <TabsTrigger key={status} value={status}>
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
