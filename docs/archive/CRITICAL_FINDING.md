# Critical Finding - GSAP Not Applying Values

## The Smoking Gun

Console log shows:
```
[V2 Debug] Section 7: Setting 1.00, Current DOM: 0.00
```

**V2 is calculating correct values and calling `gsap.set`, but the values aren't being applied to the DOM.**

## Evidence

At progress 0.900 (90%):

### What V2 Calculates (CORRECT):
- Section 7 (CTA): opacity 1.000 ✓
- All other sections: opacity 0.000 ✓

### What's Actually in DOM (WRONG):
- Section 2 (Insights): opacity 1.00 (inline style: "1")
- Section 3 (Notifs): opacity 1.00 (no inline style)
- Section 4 (Privacy): opacity 1.00 (no inline style)
- Section 7 (CTA): opacity 0.00 ❌

### V2 Debug Log Shows:
```
Section 7: Setting 1.00, Current DOM: 0.00
```

This proves V2 is:
1. ✓ Calculating the right opacity (1.00 for Section 7)
2. ✓ Calling `gsap.set(ref.current, { opacity: 1.00 })`
3. ✗ But the value doesn't stick in the DOM

## Why GSAP Isn't Working

Possible causes:
1. **Refs are null/undefined** - GSAP can't set styles on non-existent elements
2. **GSAP context issue** - The gsap.context() might be reverting changes
3. **Timing issue** - Something else is setting opacity AFTER GSAP
4. **GSAP not initialized properly** - Despite being in window, it might not work correctly
5. **React strict mode** - Double rendering might be causing issues

## Next Steps

1. Verify refs are valid when gsap.set is called
2. Check if gsap.context().revert() is clearing the styles
3. Try using direct DOM manipulation instead of GSAP
4. Check React strict mode behavior

## The Real Problem

The sections showing opacity 1.00 (Insights, Notifs, Privacy) have NO connection to the current scroll position. They're stuck at 1.00 from some previous state, and V2 can't change them.

This suggests the refs might be stale or the GSAP context is preventing updates.
