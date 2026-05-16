import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ContactForm from '@/components/ContactForm.jsx';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

function ContactPage() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      label: 'Email',
      value: 'support@cipher.com',
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      label: 'Phone',
      value: '+880 1XXX-XXXXXX',
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      label: 'Address',
      value: 'Cipher Plaza, Dhaka, Bangladesh',
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      label: 'Business hours',
      value: 'Monday - Friday: 9:00 AM - 6:00 PM PST',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Contact - Cipher</title>
        <meta name="description" content="Get in touch with Cipher. Send us a message or find our contact information." />
      </Helmet>

      <Header />

      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                Get in touch
              </h1>
              <p className="text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Have a question or need support? We're here to help.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-sm"
              >
                <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
                <ContactForm />
              </motion.div>

              {/* Contact Information */}
              <div ref={ref} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-semibold mb-6">Contact information</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <motion.div
                        key={info.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-start space-x-4"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          {info.icon}
                        </div>
                        <div>
                          <p className="font-medium mb-1">{info.label}</p>
                          <p className="text-foreground/60">{info.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="bg-secondary rounded-2xl p-6 mt-8"
                >
                  <h3 className="font-semibold mb-3">Need immediate assistance?</h3>
                  <p className="text-sm text-foreground/60 mb-4">
                    For urgent technical support, please call our support line or visit your nearest Cipher Store.
                  </p>
                  <button className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200">
                    Find a store near you
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ContactPage;