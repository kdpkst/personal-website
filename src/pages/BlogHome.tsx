import PageLayout from '../components/common/PageLayout';
import BlogHomeContent from '../content/pages/blog-home.mdx';

export default function BlogHome() {
  return (
    <PageLayout
      title="My Blog (TBC: Still in Dev)"
      subtitle="Thoughts on software engineering, UI design, and 3D."
      accentColor="#fd79a8"
    >
      <BlogHomeContent />
    </PageLayout>
  );
}
