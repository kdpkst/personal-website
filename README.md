# Personal Website

A personal website built with React and Vite. The site opens with an immersive first-person 3D maze experience and then routes into three content pages: About, Portfolio, and Blog.

## Stack

- React 19
- Vite
- React Router
- MDX
- Tailwind CSS 4
- Three.js
- `@react-three/fiber`
- `@react-three/drei`

## Styling Approach

The frontend uses a hybrid styling system:

- Tailwind CSS for layout, spacing, sizing, responsive behavior, and most component styling
- custom CSS in `src/index.css` for global tokens, shared glass/effect classes, and small visual details only

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

- `/` -> first-person 3D maze landing experience
- `/about` -> About page
- `/portfolio` -> Portfolio page
- `/blog` -> Blog home
- `/blog/:slug` -> Blog post page

## Current App Structure

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
      AmbientAudio.tsx
      HUD.tsx
      MazeDoor.tsx
      MazeMinimap.tsx
      MazeScene.tsx
      MazeWalls.tsx
      Player.tsx
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

The landing page is a first-person Three.js maze with:

- WASD movement + mouse look
- visible hands/forearms
- ambient audio
- a top-left minimap with route guidance
- a single exit door that opens on `Enter` and redirects to `/about`

Key files:

- `src/pages/Maze.tsx` sets up the R3F canvas and door-to-route transition
- `src/maze/components/MazeScene.tsx` assembles lighting, atmosphere, ground, debris, walls, door, player, and audio
- `src/maze/components/Player.tsx` handles FPS movement, bobbing, hand sway, pointer lock, and collision
- `src/maze/components/MazeWalls.tsx` renders the tall maze walls
- `src/maze/components/MazeDoor.tsx` renders and animates the exit door
- `src/maze/components/MazeMinimap.tsx` renders the guidance map
- `src/maze/components/HUD.tsx` renders the menu, prompts, and minimap shell
- `src/maze/components/AmbientAudio.tsx` creates the ambient sound bed
- `src/maze/data/mazeData.ts` owns maze generation, player spawn/view, exit location, collision helpers, and minimap route helpers

### Content Pages

- `src/pages/About.tsx`, `src/pages/Portfolio.tsx`, and `src/pages/BlogHome.tsx` are route wrappers
- `src/components/common/PageLayout.tsx` provides the shared page shell and navbar
- content for those pages lives in `src/content/pages/*.mdx`

### Blog Posts

- blog post content lives in `src/content/blog/`
- the blog list lives in `src/content/pages/blog-home.mdx`
- `src/pages/BlogPost.tsx` currently renders a specific MDX post directly

That means adding another post still requires both:

1. adding/updating the MDX file in `src/content/blog/`
2. updating the blog route wiring in `src/pages/BlogPost.tsx`

## MDX Content Convention

For files in `src/content/pages/`:

- keep editable page data in exported variables near the top of the file
- render the UI from those variables below
- prefer mapping arrays/objects instead of hardcoding repeated markup

This keeps content edits maintainable and reduces layout drift.

## Search

Search is enabled on:

- Portfolio
- Blog home

Implementation notes:

- page-level search state lives in `src/pages/Portfolio.tsx` and `src/pages/BlogHome.tsx`
- shared filtering logic lives in `src/utils/search.ts`
- the shared navbar search UI lives in `src/components/common/PageLayout.tsx`

## Common Update Tasks

### Edit About / Portfolio / Blog Home

Update the corresponding MDX file:

- `src/content/pages/about.mdx`
- `src/content/pages/portfolio.mdx`
- `src/content/pages/blog-home.mdx`

### Add or Update Blog Posts

1. Add or edit the MDX file in `src/content/blog/`
2. Update the post listing data in `src/content/pages/blog-home.mdx`
3. Update `src/pages/BlogPost.tsx` so the route renders the intended post

### Change the Maze

Start here:

- `src/maze/data/mazeData.ts`
- `src/maze/components/MazeScene.tsx`
- `src/maze/components/Player.tsx`
- `src/maze/components/MazeDoor.tsx`
- `src/maze/components/HUD.tsx`

Typical maze changes include:

- maze layout / scale
- player spawn or initial view
- door position and route target
- lighting / atmosphere
- minimap behavior
- collision and movement feel

## Current Development Rules

- keep personal pages and maze changes isolated unless a task explicitly spans both
- prefer shared utilities/components over duplicating logic
- for `src/content/pages/*.mdx`, keep content in variables and render from data
- treat responsive behavior as a default requirement, not a follow-up fix
