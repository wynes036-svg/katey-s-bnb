# 📸 How to Add Your Room Images

## Quick Start

### Step 1: Add Your Photos
1. Take high-quality photos of your room
2. Save them in the `public/images/room/` folder with these names:
   - `main-view.jpg` - Main room overview
   - `cozy-corner.jpg` - Reading nook or seating area  
   - `bathroom.jpg` - Bathroom view
   - `window-view.jpg` - View from the window

### Step 2: Update the Code
Open `app/page.tsx` and uncomment the image paths:

```typescript
// Change this:
const ROOM_IMAGES: string[] = [
  // '/images/room/main-view.jpg',
  // '/images/room/cozy-corner.jpg', 
  // '/images/room/bathroom.jpg',
  // '/images/room/window-view.jpg',
]

// To this:
const ROOM_IMAGES: string[] = [
  '/images/room/main-view.jpg',
  '/images/room/cozy-corner.jpg', 
  '/images/room/bathroom.jpg',
  '/images/room/window-view.jpg',
]
```

### Step 3: Refresh Your Browser
The images will appear automatically!

## Image Requirements
- **Format**: JPG, PNG, or WebP
- **Size**: At least 1200px wide
- **Aspect Ratio**: 4:3 works best
- **File Size**: Under 2MB each

## Adding More Images
You can add as many images as you want:
1. Put them in `public/images/room/`
2. Add the paths to the `ROOM_IMAGES` array
3. The gallery will automatically show thumbnails

## Example File Structure
```
public/
  images/
    room/
      main-view.jpg
      cozy-corner.jpg
      bathroom.jpg
      window-view.jpg
      bed-detail.jpg
      amenities.jpg
```

## Tips
- Use descriptive filenames
- Optimize images for web (compress if large)
- Take photos in good lighting
- Show different angles of your room
- Include special amenities and details