import PageLayout from '../components/common/PageLayout';
import PortfolioContent from '../content/pages/portfolio.mdx';

export default function Portfolio() {
  return (
    <PageLayout
      title="Portfolio"
      subtitle="A selection of projects I've worked on."
      accentColor="#fdcb6e"
    >
      <PortfolioContent />
    </PageLayout>
  );
}
