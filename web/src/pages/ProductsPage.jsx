import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductCard from '@/components/ProductCard.jsx';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

function ProductsPage() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  const products = [
    {
      image: 'https://images.unsplash.com/photo-1592286927505-c0d6c9d1e29e',
      name: 'iPhone 16 Pro',
      price: 'Starting at $999',
      link: '/iphone',
      description: 'The most advanced iPhone ever with titanium design',
    },
    {
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      name: 'MacBook Pro',
      price: 'Starting at $1,999',
      link: '/mac',
      description: 'Supercharged by M3 Pro and M3 Max chips',
    },
    {
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
      name: 'iPad Pro',
      price: 'Starting at $799',
      link: '/ipad',
      description: 'The ultimate iPad experience with M2 chip',
    },
    {
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
      name: 'Apple Watch Series 9',
      price: 'Starting at $399',
      link: '/watch',
      description: 'Advanced health features on your wrist',
    },
    {
      image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7',
      name: 'AirPods Pro',
      price: 'Starting at $249',
      link: '/airpods',
      description: 'Immersive sound with active noise cancellation',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Products - Cipher</title>
        <meta name="description" content="Explore Cipher's complete product lineup including iPhone, Mac, iPad, Watch, and AirPods." />
      </Helmet>

      <Header />

      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                All products
              </h1>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Discover the complete Cipher ecosystem designed to work seamlessly together
              </p>
            </motion.div>

            <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProductsPage;