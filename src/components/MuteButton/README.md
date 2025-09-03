# MuteButton Component

A reusable mute button component with active/inactive states.

## Files

- `MuteButton.tsx` - The main component implementation
- `style.css` - Component-specific styles
- `index.ts` - Export file for easy importing

## Props

- `isMute`: Whether the channel is currently muted
- `onMuteToggle`: Callback function when the mute button is clicked
- `className`: Additional CSS class names

## Usage

```tsx
import { MuteButton } from "../MuteButton";

<MuteButton
  isMute={isMute}
  onMuteToggle={handleMuteToggle}
  className="custom-mute"
/>;
```

## Styling

The component includes its own CSS file with:

- Button sizing and typography
- Mute button specific colors (red theme)
- Active/inactive state styling
- Consistent button appearance
