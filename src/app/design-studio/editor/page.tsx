"use client";

import { Suspense } from "react";
import { FabricEditor } from "@/components/canvas/FabricEditor";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function EditorContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  return (
    <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/design-studio">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <h1 className="text-3xl font-bold">Design Editor</h1>
            <p className="text-muted-foreground">
              Customize your design with text, shapes, and more
            </p>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <FabricEditor initialImage={imageUrl || undefined} />
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
