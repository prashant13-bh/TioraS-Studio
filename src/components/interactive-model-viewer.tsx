'use client';

import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./model-viewer'), { 
  ssr: false,
  loading: () => (
    <div className="w-full aspect-square rounded-2xl overflow-hidden border bg-muted/20 flex items-center justify-center">
      <div className="text-center space-y-2">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Initializing 3D Environment...</p>
      </div>
    </div>
  )
});

export default function InteractiveModelViewer({ color }: { color?: string }) {
  return <ModelViewer color={color} />;
}
