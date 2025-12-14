
import { getAllDesigns } from '@/app/actions/admin-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DesignReviewCard } from './_components/design-review-card';
import { DesignFilterTabs } from './_components/design-filter-tabs';
import type { Design } from '@/lib/types';

export const metadata = {
    title: 'Design Reviews | TioraS Admin',
    description: 'Review and approve AI-generated designs.',
};

export default async function DesignReviewsPage({ searchParams }: {
    searchParams?: {
        status?: Design['status'] | 'All';
    }
}) {
  const status = searchParams?.status || 'All';
  const designs = await getAllDesigns({ status });

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Design Reviews</CardTitle>
        <CardDescription>
          Review, approve, or reject designs submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DesignFilterTabs currentStatus={status} />
        {designs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((design) => (
              <DesignReviewCard key={design.id} design={design} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold">No Designs Found</h2>
            <p className="mt-2 text-muted-foreground">
              There are no designs with the status &quot;{status}&quot;.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
