# Adding shadcn/ui Components to Storybook

This guide explains how to add shadcn/ui components to your Storybook UI library.

## Setup

The UI library is already configured with shadcn CLI. The `components.json` file in `ui/` directory configures:
- Component installation directory: `src/lib/components/`
- Path aliases: `@/` → `src/`
- Tailwind CSS configuration
- CSS variables support

## Adding Components

To add a new shadcn component:

1. **Navigate to the UI library directory:**
   ```bash
   cd ui
   ```

2. **Add the component using shadcn CLI:**
   ```bash
   npx shadcn@latest add <component-name>
   ```
   
   For example:
   ```bash
   npx shadcn@latest add table
   npx shadcn@latest add select
   npx shadcn@latest add tabs
   npx shadcn@latest add sheet
   npx shadcn@latest add tooltip
   ```

3. **The component will be installed to:**
   - `ui/src/lib/components/<component-name>.tsx`
   - Dependencies will be added automatically if needed

4. **Export the component from `ui/src/index.ts`:**
   ```typescript
   export * from './lib/components/<component-name>';
   ```

5. **Create a Storybook story (optional but recommended):**
   - Component stories should be in `ui/src/lib/components/<component-name>.stories.tsx`
   - Use the existing stories as templates (e.g., `button.stories.tsx`)

## Available shadcn Components

You can add any component from the [shadcn/ui component registry](https://ui.shadcn.com/docs/components):

- `accordion`
- `alert-dialog`
- `aspect-ratio`
- `avatar`
- `badge`
- `button` (already added)
- `calendar`
- `card` (already added)
- `carousel`
- `checkbox`
- `collapsible`
- `command`
- `context-menu`
- `data-table`
- `date-picker`
- `dialog` (already added)
- `drawer`
- `dropdown-menu` (already added)
- `form`
- `hover-card`
- `input` (already added)
- `label` (already added)
- `menubar`
- `navigation-menu` (already added)
- `popover`
- `progress`
- `radio-group`
- `resizable`
- `scroll-area`
- `select`
- `separator` (already added)
- `sheet`
- `skeleton`
- `slider`
- `sonner` (toast)
- `switch`
- `table`
- `tabs`
- `textarea`
- `toast`
- `toggle`
- `toggle-group`
- `tooltip`

## After Adding a Component

1. **Check Storybook:**
   ```bash
   pnpm storybook
   ```
   The new component should appear in Storybook (or create a story for it).

2. **Use in Web App:**
   Import from `@voli/ui`:
   ```typescript
   import { ComponentName } from '@voli/ui';
   ```

## Notes

- Components are installed to `ui/src/lib/components/` automatically
- All components use the same Tailwind CSS configuration
- CSS variables are configured in `ui/src/styles.css`
- Components are automatically exported when you add them to `ui/src/index.ts`
