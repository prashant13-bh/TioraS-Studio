"use client";

import ArchitectureMap from "@/components/admin/architecture-map";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SitemapPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Architecture</h1>
          <p className="text-muted-foreground">
            Interactive visual sitemap of the entire application.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <ArchitectureMap />
      </div>
    </div>
  );
}
