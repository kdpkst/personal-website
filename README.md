# Personal Website

This repo is a React + Vite personal website with two main parts:

- a 3D maze landing page built with React Three Fiber
- a set of content pages for About, Portfolio, and Blog

The site uses a hybrid styling approach:

- Tailwind CSS for layout, spacing, sizing, and most component styling
- custom CSS in `src/index.css` for global tokens, shared effects, and fine visual details

## Stack

- React 19
- Vite
- React Router
- MDX
- Tailwind CSS 4
- Three.js
- `@react-three/fiber`
- `@react-three/drei`

## Scripts

Install dependencies:

```bash
pnpm install
```

Run the dev server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Run lint:

```bash
pnpm lint
```

## Routes

- `/` -> 3D maze landing page
- `/about` -> About page
- `/portfolio` -> Portfolio page
- `/blog` -> Blog home
- `/blog/:slug` -> Blog post page

## Current Structure

```text
src/
  App.tsx
  main.tsx
  index.css
  mdx.d.ts

  components/
    About/
      SectionTitle.tsx
    common/
      Card.tsx
      Grid.tsx
      PageLayout.tsx
      ScrollToTop.tsx
      Tag.tsx
      TagList.tsx

  content/
    blog/
      react-basics.mdx
    pages/
      about.mdx
      blog-home.mdx
      portfolio.mdx

  maze/
    components/
      CameraRig.tsx
      HUD.tsx
      MazeScene.tsx
      MazeWalls.tsx
      Player.tsx
      Portals.tsx
    data/
      mazeData.ts

  pages/
    About.tsx
    BlogHome.tsx
    BlogPost.tsx
    Maze.tsx
    Portfolio.tsx

  utils/
    cn.ts
    search.ts
```

## Architecture Notes

### App Shell

- `src/main.tsx` mounts the app inside `BrowserRouter`
- `src/App.tsx` defines the route table
- `src/components/common/ScrollToTop.tsx` resets scroll position on route changes

### Maze

- `src/pages/Maze.tsx` is the landing page
- maze rendering lives under `src/maze/components/`
- maze layout, player spawn, and portal definitions live in `src/maze/data/mazeData.ts`

### Content Pages

- `src/pages/About.tsx`, `src/pages/Portfolio.tsx`, and `src/pages/BlogHome.tsx` are route wrappers
- shared page chrome lives in `src/components/common/PageLayout.tsx`
- page content is stored in `src/content/pages/*.mdx`

### Blog Posts

- blog post content lives in `src/content/blog/`
- the blog list is defined in `src/content/pages/blog-home.mdx`
- the current post page is rendered by `src/pages/BlogPost.tsx`
- right now, `BlogPost.tsx` imports a specific MDX post directly, so adding more posts requires updating both the blog list and the post page wiring

## MDX Content Convention

For files in `src/content/pages/`:

- keep page data in exported variables near the top of the file
- render the page UI from those variables below
- prefer mapping arrays/objects instead of hardcoding repeated markup

This keeps content edits maintainable and reduces layout drift.

## Search

Search is currently enabled in:

- Portfolio
- Blog home

Implementation notes:

- page-level search state lives in `src/pages/Portfolio.tsx` and `src/pages/BlogHome.tsx`
- shared filtering logic lives in `src/utils/search.ts`
- the navbar search UI is provided by `src/components/common/PageLayout.tsx`

## Styling

Primary styling sources:

- Tailwind utility classes in route components, MDX content, and shared components
- global theme tokens and custom effects in `src/index.css`

If you want to change the overall look first, start in:

- `src/index.css`
- `src/components/common/PageLayout.tsx`

If you want to change content-page layout pieces, look at:

- `src/components/common/Card.tsx`
- `src/components/common/Grid.tsx`
- `src/components/common/Tag.tsx`
- `src/components/common/TagList.tsx`

## Common Update Tasks

### Edit About / Portfolio / Blog Home

Update the corresponding MDX file in:

- `src/content/pages/about.mdx`
- `src/content/pages/portfolio.mdx`
- `src/content/pages/blog-home.mdx`

### Add or Update Blog Posts

1. Add or edit the MDX file under `src/content/blog/`
2. Update the post listing in `src/content/pages/blog-home.mdx`
3. Update `src/pages/BlogPost.tsx` so the route renders the correct MDX content

### Change Maze Layout or Portals

Edit:

- `src/maze/data/mazeData.ts`

That file controls:

- maze grid layout
- portal positions
- portal route targets
- player start position

## Current Development Rules

- keep maze-related behavior isolated unless the task is explicitly about the maze
- prefer shared utilities/components over duplicating logic
- for `src/content/pages/*.mdx`, keep data in variables and render from them
- keep responsive behavior correct by default, not as a follow-up fix
