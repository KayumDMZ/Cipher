import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation.js';

function SpecificationTable({ specifications }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.2, once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="divide-y divide-border">
        {specifications.map((spec, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 hover:bg-secondary/50 transition-all duration-200"
          >
            <div className="font-medium text-foreground/80">{spec.label}</div>
            <div className="text-foreground">{spec.value}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default SpecificationTable;