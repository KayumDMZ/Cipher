import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Lightbulb, Palette, Leaf } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

function AboutPage() {
  const [heroRef, heroVisible] = useScrollAnimation({ threshold: 0.2, once: true });
  const [valuesRef, valuesVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: 'Innovation',
      description: 'We push the boundaries of what technology can do, creating products that change the world.',
    },
    {
      icon: <Palette className="w-8 h-8 text-primary" />,
      title: 'Design',
      description: 'Every detail matters. We craft products that are as beautiful as they are functional.',
    },
    {
      icon: <Leaf className="w-8 h-8 text-primary" />,
      title: 'Sustainability',
      description: 'We are committed to leaving the world better than we found it through environmental responsibility.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>About - Cipher</title>
        <meta name="description" content="Learn about Cipher's mission, values, and commitment to innovation, design, and sustainability." />
      </Helmet>

      <Header />

      <main className="pt-16">
        {/* Hero Section */}
        <section ref={heroRef} className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                Designed by Cipher
              </h1>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                At Cipher, we believe that technology should be intuitive, powerful, and accessible to everyone. Our mission is to create products that enrich people's lives and inspire creativity.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section ref={valuesRef} className="py-20 bg-secondary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-12 text-center"
              style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              Our core values
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Heritage Section */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Our heritage
                </h2>
                <p className="text-foreground/60 leading-relaxed mb-4">
                  Since our inception, Cipher has been at the forefront of innovation, creating products that have transformed entire industries. From high-performance computing to personal electronics, we've consistently pushed the boundaries of what's possible.
                </p>
                <p className="text-foreground/60 leading-relaxed">
                  Today, we continue that legacy with a focus on creating technology that empowers people to do amazing things while protecting their privacy and the environment.
                </p>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9"
                  alt="Cipher headquarters"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
              Join our team
            </h2>
            <p className="text-lg text-foreground/60 mb-8 max-w-2xl mx-auto leading-relaxed">
              We're always looking for talented individuals who share our passion for innovation and excellence.
            </p>
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-lg">
              View careers
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default AboutPage;