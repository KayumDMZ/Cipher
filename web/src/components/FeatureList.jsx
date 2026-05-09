import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

function FeatureList({ features }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <div ref={ref} className="space-y-8">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-start space-x-4"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            {feature.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default FeatureList;