import React from 'react';
import { Helmet } from 'react-helmet';
import { Heart, Activity, Moon, Zap } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HeroSection from '@/components/HeroSection.jsx';
import SpecificationTable from '@/components/SpecificationTable.jsx';
import FeatureList from '@/components/FeatureList.jsx';

function WatchPage() {
  const specifications = [
    { label: 'Display', value: 'Always-On Retina display up to 2000 nits' },
    { label: 'Processor', value: 'S9 SiP with custom Apple silicon' },
    { label: 'Health sensors', value: 'Blood oxygen, ECG, heart rate, temperature' },
    { label: 'Battery', value: 'Up to 18 hours of all-day battery life' },
    { label: 'Water resistance', value: 'Water resistant to 50 meters' },
    { label: 'Connectivity', value: 'GPS, Cellular, Wi-Fi, Bluetooth 5.3' },
  ];

  const features = [
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: 'Advanced health features',
      description: 'Monitor your heart health with ECG and irregular rhythm notifications',
    },
    {
      icon: <Activity className="w-6 h-6 text-primary" />,
      title: 'Fitness tracking',
      description: 'Track your workouts and daily activity with precision',
    },
    {
      icon: <Moon className="w-6 h-6 text-primary" />,
      title: 'Sleep tracking',
      description: 'Understand your sleep patterns and improve your rest',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: 'Fast charging',
      description: 'Get up to 80% charge in about 45 minutes',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Apple Watch Series 9 - Cipher</title>
        <meta name="description" content="Advanced health features and fitness tracking on your wrist with Apple Watch Series 9." />
      </Helmet>

      <Header />

      <main className="pt-16">
        <HeroSection
          image="https://images.unsplash.com/photo-1672298958427-2bf1fd043217"
          headline="Apple Watch Series 9"
          subheading="Smarter. Brighter. Mightier."
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
              Your health companion
            </h2>
            <FeatureList features={features} />
          </div>
        </section>

        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              A healthier you
            </h2>
            <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              Take charge of your health and fitness with Apple Watch Series 9
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

export default WatchPage;