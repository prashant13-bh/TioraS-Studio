"use client";

import ArchitectureMap from "@/components/admin/architecture-map";

export default function SitemapPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Architecture</h1>
          <p className="text-muted-foreground">
            Interactive visual sitemap of the entire application.
          </p>
        </div>
      </div>
      <ArchitectureMap />
    </div>
  );
}
