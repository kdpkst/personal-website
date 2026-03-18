import PageLayout from '../components/common/PageLayout';
import AboutContent from '../content/pages/about.mdx';

export default function About() {
  return (
    <PageLayout
      title="About Me"
      subtitle="Developer, creator, and lifelong learner."
      accentColor="#00cec9"
    >
      <AboutContent />
    </PageLayout>
  );
}
