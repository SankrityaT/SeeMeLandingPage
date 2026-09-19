# Scroll System Debugging Status

## Current State

### ✅ What's Working
1. **GSAP loads properly** - Exposed to window object successfully
2. **V2 system runs** - Console logs confirm `[V2 System] Running at progress: X`
3. **ScrollTrigger exists** - `window.ScrollTrigger.getById('main-scroll')` returns valid object
4. **iOS simplification** - Simple scroll system ready for iOS devices
5. **Old hook removed** - No more conflicts between old and V2 systems

### ❌ Current Problem
**Multiple sections showing full opacity simultaneously**

At 85% page scroll (90% ScrollTrigger progress):
- Insights (Section 2): 1.00 opacity
- Notifs (Section 3): 1.00 opacity  
- Privacy (Section 4): 1.00 opacity
- Background 2: 1.00 opacity

**Expected behavior:**
- Only 1-2 sections visible at any time
- At 90% progress, should show Section 7 (CTA) or Section 6-7 transition
- Background should match the visible section

## Root Cause Analysis

The V2 `onUpdate` callback IS running (confirmed by logs), but the opacity values it calculates aren't matching what appears in the DOM.

**Possible causes:**
1. ✅ ~~Old hook conflict~~ - FIXED by removing old import
2. ✅ ~~React conditional hook issue~~ - FIXED by calling both hooks
3. ✅ ~~GSAP not loading~~ - FIXED by window exposure
4. ❓ **V2 opacity calculation logic bug** - LIKELY ISSUE
5. ❓ **Section range calculations incorrect** - POSSIBLE
6. ❓ **CSS or other animations overriding** - UNLIKELY (no other animations found)

## V2 System Design

### Section Ranges (8 sections, each 12.5% of scroll)
```
Section 0 (Hero):     0.000 - 0.125
Section 1 (Coaches):  0.125 - 0.250
Section 2 (Insights): 0.250 - 0.375
Section 3 (Notifs):   0.375 - 0.500
Section 4 (Privacy):  0.500 - 0.625
Section 5 (Rise):     0.625 - 0.750
Section 6 (Reviews):  0.750 - 0.875
Section 7 (CTA):      0.875 - 1.000
```

### Fade Zones (10% of section width = 1.25% of total scroll)
```
For Section 1 (0.125 - 0.250):
  fadeInStart:  0.125
  fadeInEnd:    0.138 (0.125 + 0.0125)
  fadeOutStart: 0.237 (0.250 - 0.0125)
  fadeOutEnd:   0.250
```

### Expected Opacity at 90% Progress
```
Progress: 0.900
Current Section: floor(0.900 * 8) = 7 (CTA)

Section 7 range: 0.875 - 1.000
  fadeInStart: 0.875
  fadeInEnd: 0.887
  fadeOutStart: 0.988
  fadeOutEnd: 1.000

At progress 0.900:
  - 0.900 > fadeInEnd (0.887) ✓
  - 0.900 < fadeOutStart (0.988) ✓
  - Therefore: opacity = 1.00 ✓

All other sections should be 0.00
```

## Next Steps

1. **Add detailed logging** to V2 `onUpdate` to see what opacities are being calculated
2. **Compare calculated vs actual** DOM opacities
3. **Check if gsap.set is actually applying** the values
4. **Verify section refs** are pointing to correct DOM elements
5. **Test with simpler opacity logic** to isolate the issue

## Files Modified

- ✅ `components/landing/LandingPage.tsx` - Using V2 system, old hook removed
- ✅ `components/landing/hooks/useScrollAnimationV2.ts` - Created with mathematical system
- ✅ `components/landing/hooks/useSimpleScrollAnimation.ts` - Created for iOS
- ✅ `components/FinalLanding.tsx` - Commented out (deprecated)

## Test Results

```
Test: Scroll to 85% of page height
Expected: Section 6 or 7 visible (Reviews or CTA)
Actual: Sections 2, 3, 4 visible (Insights, Notifs, Privacy)
Result: ❌ FAIL - Wrong sections showing
```

## User's Original Issue

From screenshot: "Loved by people like you" and "Begin your journey today" text overlapping, with previous background visible.

This is exactly what we're seeing - multiple sections visible when only one should be.
