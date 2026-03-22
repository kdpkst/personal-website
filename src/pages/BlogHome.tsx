import { useDeferredValue, useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import BlogHomeContent from '../content/pages/blog-home.mdx';

export default function BlogHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  return (
    <PageLayout
      title="My Blog (TBC: Still in Dev)"
      subtitle="Thoughts on software engineering, UI design, and 3D."
      accentColor="#fd79a8"
      searchValue={searchQuery}
      searchPlaceholder="Search posts"
      onSearchChange={setSearchQuery}
    >
      <BlogHomeContent searchQuery={deferredSearchQuery} />
    </PageLayout>
  );
}
