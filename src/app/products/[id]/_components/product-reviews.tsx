'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { initializeFirebase } from '@/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useUser();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { firestore: db } = initializeFirebase();
        const reviewsRef = collection(db, 'products', productId, 'reviews');
        const q = query(reviewsRef, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const reviewsData = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Review));
        setReviews(reviewsData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to leave a review.",
        variant: "destructive"
      });
      return;
    }

    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const { firestore: db } = initializeFirebase();
      const reviewsRef = collection(db, 'products', productId, 'reviews');
      const newReview = {
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating,
        comment,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(reviewsRef, newReview);
      
      setReviews(prev => [{
        id: docRef.id,
        ...newReview,
        createdAt: { toDate: () => new Date() } // Temporary date for UI
      }, ...prev]);

      setComment('');
      setRating(5);
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Could not submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="mt-16 border-t pt-16">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Review Summary */}
        <div className="lg:w-1/3">
          <h2 className="font-headline text-2xl font-bold tracking-tighter md:text-3xl">Customer Reviews</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1 text-primary">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star 
                  key={s} 
                  className={cn("size-6", s <= Math.round(averageRating) ? "fill-current" : "text-muted")} 
                />
              ))}
            </div>
            <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
            <p className="text-muted-foreground">({reviews.length} reviews)</p>
          </div>

          {/* Review Form */}
          <div className="mt-8 rounded-2xl bg-accent/30 p-6 border border-border/50">
            <h3 className="mb-4 font-bold">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={cn(
                        "transition-all hover:scale-110",
                        s <= rating ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <Star className={cn("size-6", s <= rating && "fill-current")} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Your Feedback</label>
                <Textarea
                  placeholder="Share your thoughts on this design..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px] rounded-xl bg-background"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full font-bold" 
                disabled={isSubmitting || !comment.trim()}
              >
                {isSubmitting ? "Submitting..." : "Post Review"}
              </Button>
            </form>
          </div>
        </div>

        {/* Review List */}
        <div className="flex-1">
          <div className="space-y-6">
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                <MessageSquare className="mb-4 size-12 opacity-20" />
                <p>No reviews yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              <AnimatePresence>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-2xl border border-border/50 p-6 transition-all hover:bg-accent/10"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <User className="size-5" />
                        </div>
                        <div>
                          <p className="font-bold">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {review.createdAt?.toDate ? format(review.createdAt.toDate(), 'MMM d, yyyy') : 'Just now'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 text-primary">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star 
                            key={s} 
                            className={cn("size-4", s <= review.rating ? "fill-current" : "text-muted")} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
