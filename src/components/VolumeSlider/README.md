# VolumeSlider Component

A reusable vertical volume slider component that uses Material-UI's Slider component with custom styling.

## Files

- `VolumeSlider.tsx` - The main component implementation
- `style.css` - Component-specific styles
- `index.ts` - Export file for easy importing

## Props

- `volume`: The current volume value in gain units
- `normalizedVolume`: The normalized volume value (0-1) for the slider
- `onVolumeChange`: Callback function when the volume changes
- `showDbValue`: Whether to show the dB value below the slider (default: true)
- `className`: Additional CSS class names

## Usage

```tsx
import { VolumeSlider } from "../VolumeSlider";

<VolumeSlider
  volume={volume}
  normalizedVolume={normalizedVolume}
  onVolumeChange={handleVolumeChange}
  className="custom-slider"
/>;
```

## Styling

The component includes its own CSS file with:

- Vertical slider layout
- MUI Slider customization
- Volume value display formatting
- Responsive design considerations
