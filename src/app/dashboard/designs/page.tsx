'use client';

import { Card, CardContent } from "@/components/ui/card";
import { fetchUserDashboardData } from "@/lib/firestore-actions";
import { useUser } from "@/firebase";
import { useEffect, useState } from "react";
import type { Design } from "@/lib/types";
import Image from "next/image";
import { Loader2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DesignsPage() {
  const { user, loading } = useUser();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserDashboardData(user.uid).then((data) => {
        setDesigns(data.savedDesigns);
        setIsDataLoading(false);
      });
    }
  }, [user]);

  if (loading || isDataLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Designs</h1>
          <p className="text-muted-foreground">
            Your gallery of AI-generated masterpieces.
          </p>
        </div>
        <Button asChild>
          <Link href="/design-studio">Create New</Link>
        </Button>
      </div>

      {designs.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {designs.map((design) => (
            <Card key={design.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                <Image
                  src={design.imageUrl}
                  alt={design.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{design.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">{design.product}</span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {new Date(design.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Palette className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No designs yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              You haven&apos;t saved any designs. Visit the studio to create your first custom apparel.
            </p>
            <Button asChild>
              <Link href="/design-studio">Go to Design Studio</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
