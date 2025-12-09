import { getAllDesigns } from '@/app/actions/admin-actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DesignReviewCard } from './_components/design-review-card';

export const metadata = {
    title: 'Design Reviews | TioraS Admin',
    description: 'Review and approve AI-generated designs.',
};

export default async function DesignReviewsPage() {
  const designs = await getAllDesigns();

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Design Reviews</CardTitle>
        <CardDescription>
          Review, approve, or reject designs submitted by users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {designs.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {designs.map((design) => (
              <DesignReviewCard key={design.id} design={design} />
            ))}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-semibold">No Designs to Review</h2>
            <p className="mt-2 text-muted-foreground">
              There are no new designs awaiting review.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
