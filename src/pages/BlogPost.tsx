import PageLayout from "../components/common/PageLayout";
import ReactBasicsContent from "../content/blog/react-basics.mdx";

export default function BlogPost() {
  return (
    <PageLayout
      title="React Basics: Understanding the Virtual DOM"
      accentColor="#fd79a8"
    >
      <article className="liquid-glass markdown-content mx-auto max-w-[860px] overflow-hidden rounded-[32px] border border-white/50 bg-white/52 px-6 py-8 shadow-[0_18px_48px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.84)] backdrop-blur-2xl sm:px-8 sm:py-10 md:px-12">
        <ReactBasicsContent />
      </article>
    </PageLayout>
  );
}
