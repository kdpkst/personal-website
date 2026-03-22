import { useDeferredValue, useState } from 'react';
import PageLayout from '../components/common/PageLayout';
import PortfolioContent from '../content/pages/portfolio.mdx';

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  return (
    <PageLayout
      title="Portfolio"
      subtitle="A selection of projects I've worked on."
      accentColor="#fdcb6e"
      searchValue={searchQuery}
      searchPlaceholder="Search projects"
      onSearchChange={setSearchQuery}
    >
      <PortfolioContent searchQuery={deferredSearchQuery} />
    </PageLayout>
  );
}
