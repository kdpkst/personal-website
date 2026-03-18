import { Routes, Route } from "react-router-dom";
import Maze from "./pages/Maze";
import About from "./pages/About";
import BlogHome from "./pages/BlogHome";
import Portfolio from "./pages/Portfolio";
import BlogPost from "./pages/BlogPost";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Maze />} />
      <Route path="/about" element={<About />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/blog" element={<BlogHome />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
    </Routes>
  );
}

export default App;
