# 3D Interactive Portfolio

Welcome to your personalized 3D portfolio! This project is a unique blend of a browser-based 3D exploratory experience and a traditional, content-rich portfolio website.

## 🚀 Quick Start

1. **Run Development Server**
   ```bash
   pnpm run dev
   ```

2. **Explore**
   Navigate the maze using **Arrow Keys** or **WASD**. Approach a portal (About, CV, or Portfolio) and press **Enter** to jump to that page.

---

## 🏗️ Architecture & Codebase Structure

The project uses a hybrid architecture that seamlessly transitions between a 3D scene and standard React pages. Content is managed using MDX, allowing you to write in Markdown with React components.

```text
src/
├── App.tsx                # Main router configuration
├── main.tsx               # App entry point
├── index.css              # Global styles and CSS variables
├── components/            # Reusable React components
│   ├── common/            # Shared UI elements (HUD, PageLayout, Cards)
│   └── Maze/              # 3D game engine components (Scene, Player, Walls)
├── content/               # MDX content files
│   ├── blogs/             # Individual blog post entries
│   └── pages/             # Page content (About, Portfolio, Blog Home)
└── pages/                 # Top-level route components
    ├── About.tsx          # About page route
    ├── BlogHome.tsx       # Main blog feed route
    ├── BlogPost.tsx       # Individual blog post layout
    ├── Maze.tsx           # The 3D maze homepage route  
    └── Portfolio.tsx      # Portfolio page route
```

### Key Technologies
- **@react-three/fiber & @react-three/drei**: Powers the 3D maze environment.
- **react-router-dom**: Handles page transitions and routing.
- **MDX**: Allows seamless mixing of Markdown and React components for content generation.

---

## 🛠️ How to Incrementally Develop

### 1. Adding More Blogs
Currently, `BlogPost.tsx` provides a generic container but is hardcoded to a single demo post. To add more posts:
1. **Create Content**: Create a new MDX file in `src/content/blogs/` (e.g., `my-new-post.mdx`). Write your content using standard Markdown.
2. **List It**: Open `src/content/pages/blog-home.mdx`. Add a new `<Link>` wrapping a `<Card>` component to list your new post, pointing to the desired route (e.g., `/blog/my-new-post`).
3. **Handle Routes**: Update `src/pages/BlogPost.tsx` to conditionally map the `useParams().slug` to the correct MDX import, or adjust `src/App.tsx` directly to manually register individual explicitly defined routes for each explicit post.

### 2. Upgrading the Maze Layout
1. Open `src/components/Maze/mazeData.ts`.
2. Edit the numbers in the `MAZE_GRID`. `1` is a wall, `0` is a path.
3. Make the maze bigger or create new paths.
4. To add a new portal, assign a new number to an empty space (e.g., `5`) and register its target route in the `PORTALS` array within the same file.

### 3. Modifying Existing Pages
- Content for the core text-heavy pages is isolated in `src/content/pages/` (like `about.mdx` or `portfolio.mdx`).
- Simply edit the Markdown and save. The changes flow instantly into the respective `src/pages/*.tsx` components, meaning you need little-to-no React knowledge to update your resume or portfolio entries!

### 4. Direct Navigation (Skip the Maze)
If you want to add a permanent sidebar or a different navigation style that persists across the site, modify `src/components/common/HUD.tsx`. It handles the ☰ menu state and direct overlay UI.

### 5. Tweak the 3D Visuals
- **Lighting**: In `src/components/Maze/MazeScene.tsx`, adjust the `intensity` of `ambientLight` or `directionalLight`.
- **Atmosphere**: Change the `#0a0a0f` color in the `<fog>` tag in `MazeScene.tsx` to change the "void" effect's color distance.
- **Materials**: In `src/components/Maze/MazeWalls.tsx` or `Player.tsx`, adjust properties like `color`, `metalness`, or `roughness` of the `meshStandardMaterial`.

---

## 🎨 Styling Tips
Most styling is controlled via **CSS Variables** defined in `src/index.css`. Changing variables like `--accent-primary` or root colors there will re-theme the highlight colors and glowing effects across the entire site instantly!
