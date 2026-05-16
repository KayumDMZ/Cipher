import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { getProducts, getProductQuantities } from '@/api/EcommerceApi';

const placeholderImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY3Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iI2FlYWViMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K";

// ── Brand config ────────────────────────────────────────────────────────────
const BRANDS = [
  { id: 'all',     label: 'All Brands',  color: '#1d1d1f', dot: null },
  { id: 'apple',   label: 'Apple',       color: '#1d1d1f', dot: '#555' },
  { id: 'samsung', label: 'Samsung',     color: '#1428a0', dot: '#1428a0' },
  { id: 'google',  label: 'Google',      color: '#4285f4', dot: '#4285f4' },
];

const BRAND_BADGE = {
  apple:   { label: 'Apple',   bg: 'bg-gray-100',   text: 'text-gray-600'  },
  samsung: { label: 'Samsung', bg: 'bg-blue-50',    text: 'text-blue-700'  },
  google:  { label: 'Google',  bg: 'bg-sky-50',     text: 'text-sky-700'   },
};

// ── Category config ─────────────────────────────────────────────────────────
const ALL_CATEGORIES = [
  { id: 'all',         label: 'All'        },
  { id: 'phone',       label: 'Phones'     },
  { id: 'tablet',      label: 'Tablets'    },
  { id: 'laptop',      label: 'Laptops'    },
  { id: 'watch',       label: 'Watches'    },
  { id: 'audio',       label: 'Audio'      },
  { id: 'tv',          label: 'TV & Home'  },
  { id: 'accessories', label: 'Accessories'},
];

// ── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const displayVariant = useMemo(() => (product.variants ?? [])[0], [product]);
  const displayPrice = useMemo(() =>
    displayVariant?.sale_price_formatted ?? displayVariant?.price_formatted,
  [displayVariant]);

  const badge = BRAND_BADGE[product.brand];

  const cardRef = React.useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glintX, setGlintX] = useState(50);
  const [glintY, setGlintY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    setRotateX(-(yPct - 0.5) * 10);
    setRotateY((xPct - 0.5) * 10);
    setGlintX(Math.round(xPct * 100));
    setGlintY(Math.round(yPct * 100));
  };
  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };
  const handleMouseEnter = () => setIsHovered(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      style={{ perspective: '1000px' }}
    >
      <Link to={`/product/${product.id}`} id={`product-card-${product.id}`} className="block h-full outline-none">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          animate={{ rotateX, rotateY, transformPerspective: 1000 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="apple-card flex flex-col h-full cursor-pointer relative bg-white transform-gpu overflow-hidden"
        >
          {/* Specular glint overlay — follows cursor */}
          <div
            className="absolute inset-0 pointer-events-none z-20 transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle at ${glintX}% ${glintY}%, rgba(255,255,255,0.18) 0%, transparent 65%)`,
            }}
          />

          {/* Ribbon */}
          {product.ribbon_text && (
            <div className="absolute top-4 left-4 z-10">
              <span className="ribbon-apple font-medium">{product.ribbon_text}</span>
            </div>
          )}

          {/* Brand badge */}
          {badge && (
            <div className={`absolute top-4 right-4 z-10 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${badge.bg} ${badge.text}`}>
              {badge.label}
            </div>
          )}

          {/* Image */}
          <div className="relative pt-12 px-8 pb-4 flex-shrink-0 flex items-center justify-center bg-white aspect-[4/3]">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="skeleton w-full h-full rounded-xl" />
              </div>
            )}
            <motion.img
              animate={{ scale: isHovered ? 1.06 : 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              src={imageError ? placeholderImage : (product.image || placeholderImage)}
              alt={product.title}
              onLoad={() => setImageLoaded(true)}
              onError={() => { setImageError(true); setImageLoaded(true); }}
              className={`w-[85%] max-w-[240px] h-auto object-contain mix-blend-multiply transition-opacity duration-500 drop-shadow-xl bg-white ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-6 pt-2 flex flex-col flex-1 justify-between text-center items-center">
            <div>
              <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-1 leading-tight">{product.title}</h3>
              <p className="text-[15px] text-[#6e6e73] mb-4 line-clamp-2">{product.subtitle}</p>
            </div>
            <div className="mt-auto">
              <p className="text-[15px] text-[#1d1d1f] mb-4">From {displayPrice}</p>
              <Link
                to={`/product/${product.id}`}
                id={`buy-${product.id}`}
                className="btn-apple px-6 py-2 inline-block"
              >
                Buy
              </Link>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ── Main ProductsList ────────────────────────────────────────────────────────
const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial filters from URL
  const urlCategory = searchParams.get('category') || 'all';
  const urlBrand    = searchParams.get('brand')    || 'all';

  const [activeBrand,    setActiveBrand]    = useState(urlBrand);
  const [activeCategory, setActiveCategory] = useState(urlCategory);

  // Sync state when URL params change (e.g. clicking header links)
  useEffect(() => {
    setActiveBrand(searchParams.get('brand') || 'all');
    setActiveCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { products: raw } = await getProducts();
        
        // Only fetch quantities if we actually have products
        if (raw && raw.length > 0) {
          const productIds = raw.map(p => p.id);
          const { variants: qv } = await getProductQuantities({ product_ids: productIds });
          const qMap = new Map((qv || []).map(v => [v.id, v.inventory_quantity]));
          setProducts(raw.map(p => ({
            ...p,
            variants: (p.variants ?? []).map(v => ({
              ...v,
              inventory_quantity: qMap.get(v.id) ?? v.inventory_quantity,
            })),
          })));
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Reset category when brand changes
  const handleBrandChange = (brand) => {
    setActiveBrand(brand);
    setActiveCategory('all');
    setSearchParams(brand !== 'all' ? { brand } : {});
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const params = {};
    if (activeBrand !== 'all') params.brand = activeBrand;
    if (cat !== 'all') params.category = cat;
    setSearchParams(params);
  };

  // Which categories are available for the selected brand?
  const availableCategories = useMemo(() => {
    const brandProducts = activeBrand === 'all'
      ? products
      : products.filter(p => p.brand === activeBrand);
    const cats = new Set(brandProducts.map(p => p.category).filter(Boolean));
    return ALL_CATEGORIES.filter(c => c.id === 'all' || cats.has(c.id));
  }, [products, activeBrand]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeBrand !== 'all') result = result.filter(p => p.brand === activeBrand);
    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
    return result;
  }, [products, activeBrand, activeCategory]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-[#0071e3] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-white rounded-2xl">
        <p className="text-red-500 font-semibold mb-2">Error loading products</p>
        <p className="text-[#6e6e73] text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Brand filter row ── */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {BRANDS.map(b => (
          <button
            key={b.id}
            id={`brand-${b.id}`}
            onClick={() => handleBrandChange(b.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[15px] font-normal transition-all duration-200 ${
              activeBrand === b.id
                ? 'bg-[#1d1d1f] text-white'
                : 'bg-white text-[#1d1d1f] hover:bg-[#e8e8ed]'
            }`}
          >
            {b.dot && activeBrand !== b.id && (
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: b.dot }} />
            )}
            {b.label}
          </button>
        ))}
        <span className="ml-auto text-[13px] text-[#6e6e73] flex-shrink-0">{filteredProducts.length} products</span>
      </div>

      {/* ── Category filter row ── */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 scrollbar-none">
        {availableCategories.map(c => (
          <button
            key={c.id}
            id={`cat-${c.id}`}
            onClick={() => handleCategoryChange(c.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-normal transition-all duration-200 border ${
              activeCategory === c.id
                ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white'
                : 'border-[#d2d2d7] bg-transparent text-[#1d1d1f] hover:border-[#1d1d1f]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ── Grid ── */}
      <AnimatePresence mode="popLayout">
        {filteredProducts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 text-[#6e6e73]"
          >
            We'll start adding these items once we're rich
          </motion.div>
        ) : (
          <motion.div
            key={`${activeBrand}-${activeCategory}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsList;