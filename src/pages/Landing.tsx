import { Header } from '../components/site/Header';
import { Hero } from '../components/site/Hero';
import { WhatIs, HowItWorks, WhatWeProvide } from '../components/site/Sections';
import { FeatureTrio, AISolutions, DashboardPreview } from '../components/site/Solutions';
import { Pricing, Integrations } from '../components/site/Pricing';
import { Footer } from '../components/site/Footer';

export function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <WhatIs />
        <HowItWorks />
        <WhatWeProvide />
        <FeatureTrio />
        <AISolutions />
        <DashboardPreview />
        <Pricing />
        <Integrations />
      </main>
      <Footer />
    </div>
  );
}
