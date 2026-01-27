# Canvas Editor Documentation

## Overview

The **Fabric.js Canvas Editor** is a lightweight design editing tool integrated into TioraS Studio's AI Design Studio. It allows users to manually edit AI-generated designs by adding text, shapes, and other elements.

## Features

- ✅ **Canvas Editing**: Powered by fabric.js v5
- ✅ **Text Tool**: Add and edit text overlays
- ✅ **Shape Tools**: Rectangle and circle shapes
- ✅ **Layer Management**: View, select, and delete layers
- ✅ **Zoom Controls**: Zoom in/out for precision editing
- ✅ **Export**: Download designs as PNG files
- ✅ **Load Images**: Start with AI-generated designs

## Usage

### From AI Design Studio

1. Navigate to `/design-studio`
2. Generate an AI design with a prompt
3. Click **"Edit Design"** button
4. The design loads in the canvas editor

### Direct Access

Visit `/design-studio/editor` for a blank canvas.

### Workflow

1. **Load a Design**: AI-generated image auto-loads from query param
2. **Add Elements**:
   - Click **Text** icon to add editable text
   - Click **Rectangle** or **Circle** to add shapes
3. **Edit Objects**: Click any object to select and drag/resize
4. **Delete**: Select object → Click trash icon (or toolbar)
5. **Layers**: View all objects in right panel, click to select
6. **Export**: Click **Download** icon to export as PNG

## Components

### FabricEditor

**Location**: `src/components/canvas/FabricEditor.tsx`

Main canvas component with toolbar and layer panel.

```tsx
import { FabricEditor } from "@/components/canvas/FabricEditor";

<FabricEditor
  initialImage="https://example.com/image.png"
  width={800}
  height={600}
/>;
```

**Props**:

- `initialImage` (string, optional): URL of image to load on canvas
- `width` (number, optional): Canvas width in pixels (default: 800)
- `height` (number, optional): Canvas height in pixels (default: 600)

### Editor Page

**Location**: `src/app/design-studio/editor/page.tsx`

Standalone page for canvas editing.

**Query Parameters**:

- `image` (string): URL-encoded image URL to load

Example: `/design-studio/editor?image=https%3A%2F%2Fexample.com%2Fimage.png`

## Toolbar Actions

| Icon     | Tool      | Action                       |
| -------- | --------- | ---------------------------- |
| Move     | Select    | Click to select/move objects |
| Type     | Text      | Add text overlay             |
| Square   | Rectangle | Add rectangle shape          |
| Circle   | Circle    | Add circle shape             |
| Trash    | Delete    | Remove selected object       |
| Zoom In  | Zoom+     | Increase zoom level          |
| Zoom Out | Zoom-     | Decrease zoom level          |
| Download | Export    | Export canvas as PNG         |

## Technical Details

### Dependencies

- `fabric@5.3.0` - Canvas manipulation library
- `@types/fabric@5.3.6` - TypeScript types

### Object Types Supported

- **Text** (`fabric.IText`): Editable text with font customization
- **Rectangle** (`fabric.Rect`): Rectangular shapes
- **Circle** (`fabric.Circle`): Circular shapes
- **Image** (`fabric.Image`): Loaded images

### Layer Panel

The layer panel displays all objects on the canvas:

- Shows object type and preview text
- Click to select an object
- Delete button on each layer
- Auto-highlights active object

## Future Enhancements

Potential features to add:

- [ ] Color picker for shapes/text
- [ ] Font selector for text
- [ ] Undo/Redo functionality
- [ ] Image upload tool
- [ ] More shapes (triangle, polygon)
- [ ] Copy/paste objects
- [ ] Opacity/rotation controls
- [ ] Grid/snap guides

## Example Integration

### In a Custom Page

```tsx
"use client";

import { FabricEditor } from "@/components/canvas/FabricEditor";

export default function CustomEditorPage() {
  const myImage = "https://example.com/design.png";

  return (
    <div className="p-8">
      <h1>Custom Editor</h1>
      <FabricEditor initialImage={myImage} width={1000} height={700} />
    </div>
  );
}
```

### Programmatic Export

```typescript
// Access fabric canvas instance
const canvas = fabricCanvasRef.current;

// Export to different formats
const pngUrl = canvas.toDataURL({ format: "png", quality: 1 });
const jpegUrl = canvas.toDataURL({ format: "jpeg", quality: 0.8 });
```

## Troubleshooting

### Canvas not rendering

- Ensure `fabric` is properly imported: `import { fabric } from "fabric"`
- Check browser console for errors
- Verify canvas ref is attached to HTMLCanvasElement

### Images not loading

- Ensure image URL is accessible (CORS enabled)
- Check URL encoding in query parameter
- Verify image format is supported (PNG, JPEG, WebP)

### Layers not updating

- `updateLayers()` is called on object:added/removed/modified events
- Check React state updates in layer panel

---

For questions or issues, contact the development team.
