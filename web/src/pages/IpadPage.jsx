import React from 'react';
import { Helmet } from 'react-helmet';
import { Cpu, Monitor, Pencil, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HeroSection from '@/components/HeroSection.jsx';
import SpecificationTable from '@/components/SpecificationTable.jsx';
import FeatureList from '@/components/FeatureList.jsx';

function IpadPage() {
  const specifications = [
    { label: 'Display', value: '12.9-inch Liquid Retina XDR display' },
    { label: 'Processor', value: 'Apple M2 chip with 8-core CPU and 10-core GPU' },
    { label: 'Storage', value: '128GB, 256GB, 512GB, 1TB, or 2TB' },
    { label: 'Camera', value: '12MP Wide and 10MP Ultra Wide cameras' },
    { label: 'Battery', value: 'Up to 10 hours of surfing the web' },
    { label: 'Accessories', value: 'Compatible with Apple Pencil and Magic Keyboard' },
  ];

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-primary" />,
      title: 'M2 chip',
      description: 'Desktop-class performance in an incredibly thin and light design',
    },
    {
      icon: <Monitor className="w-6 h-6 text-primary" />,
      title: 'Stunning display',
      description: 'Liquid Retina XDR display with ProMotion technology',
    },
    {
      icon: <Pencil className="w-6 h-6 text-primary" />,
      title: 'Apple Pencil',
      description: 'Pixel-perfect precision for drawing, note-taking, and more',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'All-day battery',
      description: 'Work and play all day with exceptional battery life',
    },
  ];

  return (
    <>
      <Helmet>
        <title>iPad Pro - Cipher</title>
        <meta name="description" content="The ultimate iPad experience with M2 chip and stunning Liquid Retina XDR display." />
      </Helmet>

      <Header />

      <main className="pt-16">
        <HeroSection
          image="https://images.unsplash.com/photo-1426690150587-3459d187eca6"
          headline="iPad Pro"
          subheading="Supercharged by M2."
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
              Your creative studio
            </h2>
            <FeatureList features={features} />
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              The ultimate iPad experience
            </h2>
            <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Powerful, portable, and versatile. iPad Pro is ready for anything.
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

export default IpadPage;