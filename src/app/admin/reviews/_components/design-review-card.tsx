
'use client';

import Image from 'next/image';
import type { Design } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Loader2 } from 'lucide-react';
import { updateDesignStatus } from '@/app/actions/admin-actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { reviewAIGeneratedDesign } from '@/ai/flows/review-ai-generated-designs';

export function DesignReviewCard({ design }: { design: Design }) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (action: 'approve' | 'reject') => {
    setIsUpdating(true);
    // Call the AI flow
    const reviewResult = await reviewAIGeneratedDesign({
        designId: design.id,
        action,
        reason: action === 'reject' ? 'Does not meet community guidelines' : undefined,
    });
    
    // Call the database action
    const dbResult = await updateDesignStatus(design.id, design.userId, action === 'approve' ? 'Approved' : 'Rejected');

    if (dbResult.success) {
      toast({
        title: `Design ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        description: reviewResult.message,
      });
    } else {
      toast({
        title: 'Update Failed',
        description: dbResult.message,
        variant: 'destructive',
      });
    }
    setIsUpdating(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'default'; // Greenish
      case 'Rejected':
        return 'destructive'; // Reddish
      case 'Draft':
      default:
        return 'secondary'; // Grayish
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate text-base">{design.name}</CardTitle>
        <Badge variant={getStatusVariant(design.status)} className="w-fit">
          {design.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-md">
          <Image
            src={design.imageUrl}
            alt={design.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <p className="mt-2 text-sm text-muted-foreground">For: {design.product}</p>
        {design.prompt && <p className="mt-2 text-xs italic text-muted-foreground">&quot;{design.prompt}&quot;</p>}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusUpdate('reject')}
          disabled={isUpdating || design.status === 'Rejected'}
        >
          {isUpdating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <X className="mr-2 size-4" />}
          Reject
        </Button>
        <Button
          size="sm"
          onClick={() => handleStatusUpdate('approve')}
          disabled={isUpdating || design.status === 'Approved'}
        >
           {isUpdating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Check className="mr-2 size-4" />}
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}
