import React from 'react';
import { Helmet } from 'react-helmet';
import { Cpu, Monitor, Battery, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HeroSection from '@/components/HeroSection.jsx';
import SpecificationTable from '@/components/SpecificationTable.jsx';
import FeatureList from '@/components/FeatureList.jsx';

function MacPage() {
  const specifications = [
    { label: 'Processor', value: 'Apple M3 Pro or M3 Max chip' },
    { label: 'Memory', value: 'Up to 128GB unified memory' },
    { label: 'Display', value: '14.2-inch or 16.2-inch Liquid Retina XDR display' },
    { label: 'Storage', value: 'Up to 8TB SSD' },
    { label: 'Battery', value: 'Up to 22 hours video playback' },
    { label: 'Ports', value: 'Three Thunderbolt 4 ports, HDMI, SDXC card slot' },
  ];

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: 'M3 Pro and M3 Max',
      description: 'Game-changing performance and efficiency with Apple silicon',
    },
    {
      icon: <Monitor className="w-6 h-6 text-primary" />,
      title: 'Stunning display',
      description: 'Liquid Retina XDR display with extreme dynamic range and contrast',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'Blazing fast',
      description: 'Handle the most demanding workflows with ease',
    },
    {
      icon: <Battery className="w-6 h-6 text-primary" />,
      title: 'All-day battery',
      description: 'Work unplugged with exceptional battery life',
    },
  ];

  return (
    <>
      <Helmet>
        <title>MacBook Pro - Cipher</title>
        <meta name="description" content="Supercharged by M3 Pro and M3 Max chips for extreme performance and efficiency." />
      </Helmet>

      <Header />

      <main className="pt-16">
        <HeroSection
          image="https://images.unsplash.com/photo-1547075115-45017613e315"
          headline="MacBook Pro"
          subheading="Mind-blowing. Head-turning."
          primaryCTA="Buy now"
          secondaryCTA="Learn more"
        />

        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Technical specifications
            </h2>
            <SpecificationTable specifications={specifications} />
          </div>
        </section>

        <section className="py-20 bg-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Built for professionals
            </h2>
            <FeatureList features={features} />
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Ready to upgrade?
            </h2>
            <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the power of advanced technology with MacBook Pro
            </p>
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg">
              Buy now
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default MacPage;