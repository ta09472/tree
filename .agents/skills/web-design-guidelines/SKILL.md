---
name: web-design-guidelines
description: Review UI code for Zandi Design System compliance. Use when asked to "review my UI", "check design system", "audit components", or "check my code against design tokens".
metadata:
  author: zandi
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Zandi Web Design Guidelines

Review files for compliance with Zandi Design System based on `@zandi/design-token` and `@zandi/ui`.

## How It Works

1. Read the specified files (or prompt user for files/pattern)
2. Check against all rules below
3. Output findings in the terse `file:line` format

## Zandi Design System Rules

### 1. Color Usage - Semantic Tokens

**Rule**: Always use semantic color tokens instead of hardcoded colors or arbitrary Tailwind colors.

**Allowed Patterns**:
- `bg-semantic-primary`, `bg-semantic-secondary`, `bg-semantic-accent`
- `bg-semantic-destructive`, `bg-semantic-muted`
- `text-semantic-primary-foreground`, `text-semantic-secondary-foreground`
- `border-semantic-border-default`, `border-semantic-border-focus`
- CSS variables: `var(--colors-primary)`, `var(--colors-border-default)`

**Avoid**:
- Hardcoded hex: `#ff0000`, `#201f1e`
- Arbitrary Tailwind: `bg-[#123456]`, `text-[rgb(0,0,0)]`
- Direct palette colors without semantic meaning: `bg-red-500`, `text-gray-900` (unless intentional)

### 2. Color Usage - Status Colors

**Rule**: Use status colors only for their intended semantic purposes.

**Allowed Status Colors**:
- `status.base.move` - Robot moving state
- `status.base.stop` - Robot stopped state  
- `status.base.task` - Robot task state
- `status.base.unstable` - Robot unstable state
- `status.base.charging` - Robot charging state
- `status.base.emergency` - Robot emergency state
- `status.zone.working` - Zone working state
- `status.zone.allocated` - Zone allocated state
- `status.zone.error` - Zone error state

**Tailwind Class**: `text-status-base-move`, `bg-status-zone-error`, etc.

### 3. Typography - Text Styles

**Rule**: Use predefined text style classes from design tokens.

**Allowed Text Styles**:
- Headings: `heading-xl`, `heading-lg`, `heading-md`, `heading-sm`, `heading-xs`
- Body: `body-lg`, `body-base`, `body-md`, `body-sm`, `body-md-bold`, `body-base-bold`
- Labels: `label-xl`, `label-lg`, `label-md`, `label-sm`
- Display: `display-xl`, `display-lg`, `display-md`, `display-sm`

**Avoid**:
- Arbitrary font sizes: `text-[14px]`, `text-[1.25rem]`
- Direct font-weight without style class: `font-bold`, `font-semibold` (use text style instead)
- Arbitrary line-height: `leading-[1.5]`, `leading-[24px]`

### 4. Spacing - Token-based

**Rule**: Use spacing tokens from the design system.

**Allowed Spacing**:
- `spacing-xxs` (2px), `spacing-xs` (4px), `spacing-sm` (8px)
- `spacing-md` (16px), `spacing-lg` (24px), `spacing-xl` (32px)
- `spacing-2xl` (48px), `spacing-3xl` (64px), `spacing-4xl` (80px)

**Tailwind Usage**: `p-spacing-md`, `m-spacing-lg`, `gap-spacing-sm`, etc.

**Avoid**:
- Arbitrary values: `p-[10px]`, `m-[15px]`, `gap-[20px]`
- Non-token values: `p-3`, `m-5` (unless mapped to tokens)

### 5. Border Radius

**Rule**: Use predefined radius tokens.

**Allowed Radius**:
- `radius-none` (0px), `radius-sm` (4px), `radius-md` (8px)
- `radius-lg` (16px), `radius-xl` (24px), `radius-full` (9999px)

**Avoid**:
- Arbitrary radius: `rounded-[10px]`, `rounded-[12px]`
- Use `rounded-md` instead of `rounded-lg` for small components

### 6. Shadow Usage

**Rule**: Use predefined shadow tokens.

**Allowed Shadows**:
- `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

**Avoid**:
- Custom shadows: `shadow-[0_2px_4px_rgba(0,0,0,0.1)]`

### 7. Component Patterns - CVA

**Rule**: Use `cva` (class-variance-authority) for component variants.

**Required Pattern**:
```typescript
import { cva, type VariantProps } from "class-variance-authority";

const componentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "...",
        primary: "...",
      },
      size: {
        sm: "...",
        md: "...",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

### 8. Class Name Utility

**Rule**: Always use `cn()` utility from `@zandi/ui` for class merging.

**Required**:
```typescript
import { cn } from "@zandi/ui/lib/utils";
// or
import { cn } from "../lib/utils";
```

**Usage**: `className={cn(baseClasses, conditional && "conditional-class", className)}`

### 9. Interactive States

**Rule**: Include proper interactive states for all interactive elements.

**Required States**:
- Hover: `hover:` variants
- Focus: `focus-visible:ring-2 focus-visible:ring-semantic-brand-primary`
- Active/Pressed: `active:scale-[0.94]` for buttons
- Disabled: `disabled:pointer-events-none disabled:opacity-50`
- Loading: `data-loading` attribute or `isLoading` prop

### 10. Accessibility

**Rule**: Follow accessibility best practices.

**Requirements**:
- Focus indicators: `focus-visible:outline-none focus-visible:ring-2`
- ARIA labels for icon-only buttons
- `aria-label`, `aria-labelledby`, `aria-describedby` where needed
- Keyboard navigation support
- Color contrast compliance (semantic tokens ensure this)

### 11. Dark Mode Support

**Rule**: Components must support dark mode via CSS variables.

**Required**:
- Use semantic tokens that have dark mode values
- Avoid hardcoded light-only colors
- Test with `.dark` class or `data-theme="default"`

### 12. Map Component Specifics

**Rule**: Map components have specific color conventions.

**Map Colors**:
- `map.button-bg` - Map control buttons
- `map.green-fill` - Golf green areas
- `map.boundary-fill` - Course boundaries
- `map.hole-fill` / `map.hole-stroke` - Hole areas
- `map.fairway-fill` / `map.fairway-stroke` - Fairway areas

## Output Format

Report findings in this format:

```
file.tsx:10  [ERROR] Use semantic color token instead of hardcoded color: #ff0000 -> use bg-semantic-destructive
file.tsx:15  [WARN]  Missing hover state for interactive element
file.tsx:22  [ERROR] Use text style class instead of arbitrary font-size: text-[14px] -> use body-sm or label-md
file.tsx:30  [ERROR] Use spacing token: p-[12px] -> use p-spacing-md
file.tsx:45  [WARN]  Consider adding aria-label for icon-only button
```

## Usage

When user provides a file or pattern:
1. Read the specified files
2. Apply all rules from above
3. Output findings using the format above

If no files specified, ask the user which files to review.
