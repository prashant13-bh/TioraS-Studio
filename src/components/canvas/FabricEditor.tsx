"use client";

import { useEffect, useRef, useState } from "react";
import type { fabric } from "fabric";
import { Button } from "@/components/ui/button";
import {  
  Download,
  Type,
  Square,
  Circle,
  Trash2,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FabricEditorProps {
  initialImage?: string;
  width?: number;
  height?: number;
}

export function FabricEditor({
  initialImage,
  width = 800,
  height = 600,
}: FabricEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>("select");
  const [layers, setLayers] = useState<fabric.Object[]>([]);
  const [fabricLoaded, setFabricLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Dynamically import fabric to avoid SSR issues
    import("fabric").then((fabricModule) => {
      const fabric = fabricModule.fabric;

      // Initialize fabric canvas
      const canvas = new fabric.Canvas(canvasRef.current!, {
        width,
        height,
        backgroundColor: "#f0f0f0",
      });

      fabricCanvasRef.current = canvas;
      setFabricLoaded(true);

      // Load initial image if provided
      if (initialImage) {
        fabric.Image.fromURL(initialImage, (img) => {
          img.scaleToWidth(width * 0.8);
          canvas.centerObject(img);
          canvas.add(img);
          canvas.renderAll();
          updateLayers();
        });
      }

      // Update layers when canvas changes
      canvas.on("object:added", updateLayers);
      canvas.on("object:removed", updateLayers);
      canvas.on("object:modified", updateLayers);
    });

    return () => {
      fabricCanvasRef.current?.dispose();
    };
  }, [initialImage, width, height]);

  const updateLayers = () => {
    if (fabricCanvasRef.current) {
      setLayers([...fabricCanvasRef.current.getObjects()]);
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.IText("Edit text", {
      left: 100,
      top: 100,
      fontFamily: "Arial",
      fill: "#000000",
      fontSize: 32,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    setSelectedTool("select");
  };

  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;

    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      fill: "#3b82f6",
      width: 200,
      height: 100,
      stroke: "#1e40af",
      strokeWidth: 2,
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
    setSelectedTool("select");
  };

  const addCircle = () => {
    if (!fabricCanvasRef.current) return;

    const circle = new fabric.Circle({
      left: 200,
      top: 200,
      radius: 80,
      fill: "#ef4444",
      stroke: "#b91c1c",
      strokeWidth: 2,
    });

    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    fabricCanvasRef.current.renderAll();
    setSelectedTool("select");
  };

  const deleteSelected = () => {
    if (!fabricCanvasRef.current) return;

    const activeObjects = fabricCanvasRef.current.getActiveObjects();
    if (activeObjects.length === 0) {
      toast.error("No object selected");
      return;
    }

    activeObjects.forEach((obj) => {
      fabricCanvasRef.current?.remove(obj);
    });

    fabricCanvasRef.current.discardActiveObject();
    fabricCanvasRef.current.renderAll();
    toast.success("Deleted selected object(s)");
  };

  const zoomIn = () => {
    if (!fabricCanvasRef.current) return;
    const zoom = fabricCanvasRef.current.getZoom();
    fabricCanvasRef.current.setZoom(Math.min(zoom * 1.1, 5));
  };

  const zoomOut = () => {
    if (!fabricCanvasRef.current) return;
    const zoom = fabricCanvasRef.current.getZoom();
    fabricCanvasRef.current.setZoom(Math.max(zoom * 0.9, 0.1));
  };

  const exportToPNG = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `design-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Design exported successfully!");
  };

  const deleteLayer = (index: number) => {
    if (!fabricCanvasRef.current) return;
    const objects = fabricCanvasRef.current.getObjects();
    if (objects[index]) {
      fabricCanvasRef.current.remove(objects[index]);
      fabricCanvasRef.current.renderAll();
    }
  };

  const selectLayer = (index: number) => {
    if (!fabricCanvasRef.current) return;
    const objects = fabricCanvasRef.current.getObjects();
    if (objects[index]) {
      fabricCanvasRef.current.setActiveObject(objects[index]);
      fabricCanvasRef.current.renderAll();
    }
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Toolbar */}
      <div className="flex flex-col gap-2 p-4 bg-card border rounded-lg w-fit">
        <div className="text-sm font-semibold mb-2">Tools</div>

        <Button
          variant={selectedTool === "select" ? "default" : "outline"}
          size="icon"
          onClick={() => setSelectedTool("select")}
          title="Select"
        >
          <Move className="h-4 w-4" />
        </Button>

        <Button
          variant={selectedTool === "text" ? "default" : "outline"}
          size="icon"
          onClick={addText}
          title="Add Text"
        >
          <Type className="h-4 w-4" />
        </Button>

        <Button
          variant={selectedTool === "rectangle" ? "default" : "outline"}
          size="icon"
          onClick={addRectangle}
          title="Add Rectangle"
        >
          <Square className="h-4 w-4" />
        </Button>

        <Button
          variant={selectedTool === "circle" ? "default" : "outline"}
          size="icon"
          onClick={addCircle}
          title="Add Circle"
        >
          <Circle className="h-4 w-4" />
        </Button>

        <div className="border-t my-2" />

        <Button
          variant="outline"
          size="icon"
          onClick={deleteSelected}
          title="Delete Selected"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>

        <div className="border-t my-2" />

        <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom In">
          <ZoomIn className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom Out">
          <ZoomOut className="h-4 w-4" />
        </Button>

        <div className="border-t my-2" />

        <Button
          variant="default"
          size="icon"
          onClick={exportToPNG}
          title="Export PNG"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center bg-muted rounded-lg p-4 overflow-auto">
        <canvas ref={canvasRef} className="border shadow-lg bg-white" />
      </div>

      {/* Layer Panel */}
      <div className="w-64 p-4 bg-card border rounded-lg">
        <div className="text-sm font-semibold mb-3">Layers ({layers.length})</div>

        <div className="space-y-1 max-h-[600px] overflow-y-auto">
          {layers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No layers yet</p>
          ) : (
            layers.map((layer, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer text-sm",
                  fabricCanvasRef.current?.getActiveObject() === layer &&
                    "bg-accent"
                )}
                onClick={() => selectLayer(index)}
              >
                <span className="truncate">
                  {layer.type === "i-text" || layer.type === "text"
                    ? `Text: ${(layer as fabric.IText).text?.substring(0, 15) || "Empty"}`
                    : layer.type === "rect"
                    ? "Rectangle"
                    : layer.type === "circle"
                    ? "Circle"
                    : layer.type === "image"
                    ? "Image"
                    : `Layer ${index + 1}`}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteLayer(index);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
