import PageLayout from "../components/common/PageLayout";
import ReactBasicsContent from "../content/blog/react-basics.mdx";

export default function BlogPost() {
  return (
    <PageLayout
      title="React Basics: Understanding the Virtual DOM"
      accentColor="#fd79a8"
    >
      <article className="markdown-content mx-auto max-w-[820px]">
        <ReactBasicsContent />
      </article>
    </PageLayout>
  );
}
