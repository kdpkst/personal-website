import PageLayout from '../components/common/PageLayout';
import ReactBasicsContent from '../content/blogs/react-basics.mdx';

export default function BlogPost() {
  return (
    <PageLayout
      title="React Basics: Understanding the Virtual DOM"
      accentColor="#fd79a8"
    >
      <article className="prose markdown-content">
        <ReactBasicsContent />
      </article>
    </PageLayout>
  );
}
