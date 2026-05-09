import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

function ProductCard({ image, name, price, link, description }) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        {description && (
          <p className="text-sm text-foreground/60 mb-3 line-clamp-2">{description}</p>
        )}
        <p className="text-lg font-medium text-primary mb-4">{price}</p>
        <Link
          to={link}
          className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200 group/link"
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
}

export default ProductCard;