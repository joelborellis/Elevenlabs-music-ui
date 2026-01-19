# Mobile Responsiveness Improvement Plan

## Summary
Improve mobile usability by fixing touch targets, reducing fixed widths/padding, and adding intermediate `sm:` breakpoints for smoother responsive scaling.

---

## Files Modified

1. `src/app/App.tsx` - Container padding
2. `src/components/Step0UserNarrative.tsx` - Button width, textarea, headings
3. `src/components/Step1Selections.tsx` - Touch targets, Quick Start cards, grid
4. `src/components/Step3Player.tsx` - Waveform, player controls, headings
5. `src/components/Step2Editors.tsx` - Button widths, textarea heights

---

## Implementation Details

### 1. App.tsx - Container Padding (4 changes)

**Line 26** - Header:
```tsx
// FROM: <div className="container mx-auto px-6 py-5">
// TO:   <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-5">
```

**Line 68** - Stepper:
```tsx
// FROM: <div className="container mx-auto px-6 pt-10 pb-6">
// TO:   <div className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-4 sm:pb-6">
```

**Line 73** - Main content:
```tsx
// FROM: <main className="container mx-auto px-6 pb-20">
// TO:   <main className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-20">
```

**Line 87** - Footer:
```tsx
// FROM: <div className="container mx-auto px-6">
// TO:   <div className="container mx-auto px-4 sm:px-6">
```

### 2. Step0UserNarrative.tsx (3 changes)

**Line 245** - Hero heading (add `sm:` breakpoint):
```tsx
// FROM: className="font-display text-4xl md:text-5xl lg:text-6xl..."
// TO:   className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl..."
```

**Line 341** - Textarea height:
```tsx
// FROM: className="min-h-[220px] resize-y..."
// TO:   className="min-h-[160px] sm:min-h-[220px] resize-y..."
```

**Line 403** - Generate button width:
```tsx
// FROM: className="group gap-3 min-w-[280px]"
// TO:   className="group gap-3 w-full sm:w-auto sm:min-w-[280px]"
```

### 3. Step1Selections.tsx (4 changes)

**Touch targets** - Expand/collapse buttons with larger tap areas:
```tsx
// FROM: className="p-1 rounded-md hover:bg-muted/50 transition-colors"
// TO:   className="p-2 sm:p-1 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 rounded-md hover:bg-muted/50 transition-colors flex items-center justify-center"
```

**Quick Start cards** - Reduced fixed width:
```tsx
// FROM: className="flex-shrink-0 w-36 p-3..."
// TO:   className="flex-shrink-0 w-28 sm:w-36 p-2.5 sm:p-3..."
```

**Grid layout** - Added medium breakpoint:
```tsx
// FROM: className="grid gap-6 lg:grid-cols-3..."
// TO:   className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3..."
```

**Continue button**:
```tsx
// FROM: className="min-w-[280px] group gap-3"
// TO:   className="w-full sm:w-auto sm:min-w-[280px] group gap-3"
```

### 4. Step3Player.tsx (4 changes)

**Line 216** - Success heading:
```tsx
// FROM: className="font-display text-4xl md:text-5xl..."
// TO:   className="font-display text-3xl sm:text-4xl md:text-5xl..."
```

**Line 268** - Waveform height:
```tsx
// FROM: className="flex items-end justify-center gap-[3px] h-28..."
// TO:   className="flex items-end justify-center gap-[2px] sm:gap-[3px] h-20 sm:h-28..."
```

**Line 374** - Volume slider:
```tsx
// FROM: className="w-16 h-1..."
// TO:   className="hidden sm:block w-16 h-1..."
// Note: Volume slider hidden on mobile, keeping only mute button for easier touch interaction
```

### 5. Step2Editors.tsx (2 changes)

**Button widths**:
```tsx
// FROM: className="min-w-[280px]..."
// TO:   className="w-full sm:w-auto sm:min-w-[280px]..."
```

**Textarea heights**:
```tsx
// FROM: className="min-h-[320px]..."
// TO:   className="min-h-[200px] sm:min-h-[320px]..."
```

---

## Verification

1. Run dev server: `npm run dev`
2. Test viewports in browser DevTools:
   - 320px (iPhone SE)
   - 375px (iPhone X/12/13)
   - 390px (iPhone 14)
   - 768px (iPad portrait)
3. Check each step of the wizard flows properly
4. Verify buttons don't overflow containers
5. Test touch interactions on actual mobile device if possible
