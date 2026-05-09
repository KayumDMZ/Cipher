import React from 'react';
import { Helmet } from 'react-helmet';
import { Volume2, Mic, Battery, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HeroSection from '@/components/HeroSection.jsx';
import SpecificationTable from '@/components/SpecificationTable.jsx';
import FeatureList from '@/components/FeatureList.jsx';

function AirpodsPage() {
  const specifications = [
    { label: 'Audio', value: 'Adaptive Audio with Active Noise Cancellation' },
    { label: 'Chip', value: 'Apple H2 chip for advanced audio processing' },
    { label: 'Battery', value: 'Up to 6 hours listening time with ANC on' },
    { label: 'Charging case', value: 'Up to 30 hours total listening time' },
    { label: 'Spatial audio', value: 'Personalized Spatial Audio with dynamic head tracking' },
    { label: 'Water resistance', value: 'IPX4 sweat and water resistant' },
  ];

  const features = [
    {
      icon: <Volume2 className="w-6 h-6 text-primary" />,
      title: 'Adaptive Audio',
      description: 'Automatically adjusts noise control to your environment',
    },
    {
      icon: <Mic className="w-6 h-6 text-primary" />,
      title: 'Active Noise Cancellation',
      description: 'Block out unwanted noise for immersive listening',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'Spatial Audio',
      description: 'Immersive three-dimensional sound experience',
    },
    {
      icon: <Battery className="w-6 h-6 text-primary" />,
      title: 'All-day battery',
      description: 'Listen all day with the charging case',
    },
  ];

  return (
    <>
      <Helmet>
        <title>AirPods Pro - Cipher</title>
        <meta name="description" content="Immersive sound with active noise cancellation and adaptive audio technology." />
      </Helmet>

      <Header />

      <main className="pt-16">
        <HeroSection
          image="https://images.unsplash.com/photo-1683798511985-9260ad11193b"
          headline="AirPods Pro"
          subheading="Adaptive Audio. Now playing."
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
              Immersive audio experience
            </h2>
            <FeatureList features={features} />
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Sound that surrounds you
            </h2>
            <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience audio like never before with AirPods Pro
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

export default AirpodsPage;