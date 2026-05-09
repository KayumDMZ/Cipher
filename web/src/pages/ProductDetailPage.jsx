import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct, getProductQuantities } from '@/api/EcommerceApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import {
  Loader2, CheckCircle, Minus, Plus, XCircle,
  ChevronLeft, ChevronRight, Truck, ShoppingCart, GitCompare, MessageCircle
} from 'lucide-react';

const placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY3Ii8+PC9zdmc+";

// Infer category from product id for breadcrumb
function getBreadcrumb(productId = '') {
  if (/iphone|pixel|galaxy-s|galaxy-a|nothing|oneplus|xiaomi/.test(productId)) return 'Mobile Phone';
  if (/macbook|mac-mini|imac/.test(productId)) return 'Laptop';
  if (/ipad|galaxy-tab|xiaomi-pad/.test(productId)) return 'Tablet';
  if (/watch/.test(productId)) return 'Smart Watch';
  if (/airpods|buds|headphone/.test(productId)) return 'Audio';
  return 'Gadgets';
}

// Infer brand label from product id
function getBrand(productId = '') {
  if (/iphone|macbook|ipad|airpods|apple-watch|mac-mini|imac/.test(productId)) return 'APPLE';
  if (/galaxy|samsung/.test(productId)) return 'SAMSUNG';
  if (/pixel|google/.test(productId)) return 'GOOGLE';
  if (/xiaomi/.test(productId)) return 'XIAOMI';
  if (/nothing/.test(productId)) return 'NOTHING';
  return null;
}

const TABS = ['Specification', 'Description', 'Warranty'];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('Specification');
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' | '3d'
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Memoize images to prevent identity changes on every render
  const images = React.useMemo(() => product?.images ?? [], [product]);

  // Sync image with selected color
  useEffect(() => {
    if (selectedColor && product?.colorImages?.[selectedColor]) {
      const colorUrl = product.colorImages[selectedColor];
      const idx = images.findIndex(img => img.url === colorUrl);
      if (idx !== -1) {
        setCurrentImageIndex(idx);
      }
    }
  }, [selectedColor, product?.colorImages, images]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { product: p } = await getProduct(id);
        const qRes = await getProductQuantities({ fields: 'inventory_quantity', product_ids: [p.id] });
        const qMap = new Map(qRes.variants.map(v => [v.id, v.inventory_quantity]));
        const full = {
          ...p,
          images: p.images ?? [],
          variants: (p.variants ?? []).map(v => ({ ...v, inventory_quantity: qMap.get(v.id) ?? v.inventory_quantity }))
        };
        setProduct(full);
        if (full.variants.length > 0) setSelectedVariant(full.variants[0]);
        if (full.colors?.length > 0) setSelectedColor(full.colors[0]);
      } catch (e) {
        setError(e.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant) return;
    setAddingToCart(true);
    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
      toast({ title: 'Added to Bag', description: `${quantity} × ${product.title} added.` });
    } catch (e) {
      toast({ variant: 'destructive', title: "Couldn't add to bag", description: e.message });
    } finally {
      setAddingToCart(false);
    }
  }, [product, selectedVariant, quantity, addToCart, toast]);

  const handleBuyNow = useCallback(async () => {
    if (!product || !selectedVariant) return;
    setAddingToCart(true);
    try {
      await addToCart(product, selectedVariant, quantity, selectedVariant.inventory_quantity);
      navigate('/checkout');
    } catch (e) {
      toast({ variant: 'destructive', title: "Couldn't add to bag", description: e.message });
    } finally {
      setAddingToCart(false);
    }
  }, [product, selectedVariant, quantity, addToCart, navigate, toast]);

  // Derived values MUST be above early returns to satisfy Rules of Hooks
  const brand = React.useMemo(() => getBrand(id), [id]);
  const category = React.useMemo(() => getBreadcrumb(id), [id]);
  
  const price = selectedVariant?.sale_price_formatted ?? selectedVariant?.price_formatted ?? '';
  const originalPrice = selectedVariant?.sale_price_in_cents ? selectedVariant.price_formatted : null;
  const saving = selectedVariant?.sale_price_in_cents
    ? Math.round((selectedVariant.price_in_cents - selectedVariant.sale_price_in_cents) / 100)
    : 0;
  
  const availableStock = selectedVariant?.inventory_quantity ?? 0;
  const isManaged = selectedVariant?.manage_inventory ?? false;
  const inStock = !isManaged || availableStock > 0;
  const canBuy = inStock && product?.purchasable !== false;
  
  const colorSyncImage = (selectedColor && product?.colorImages?.[selectedColor]) || null;
  const currentImage = colorSyncImage || images[currentImageIndex]?.url || product?.image || placeholder;
  const hasMultiple = images.length > 1;

  const specRows = React.useMemo(() => [
    { label: 'Brand', value: brand || product?.title?.split(' ')[0] || 'Unknown' },
    ...(product?.specs ?? []),
    { label: 'Model', value: product?.title || 'Unknown' },
  ], [brand, product?.title, product?.specs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white pt-[44px]">
        <Header />
        <div className="max-w-[1200px] mx-auto px-4 pt-24 text-center">
          <XCircle className="mx-auto w-14 h-14 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/store" className="btn-apple">Back to Store</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.title} — Cipher</title>
        <meta name="description" content={product.description?.substring(0, 160) || product.title} />
      </Helmet>
      <Header />

      <main className="min-h-screen bg-white pt-[44px]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 py-3">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <span>›</span>
            <Link to="/store" className="hover:text-orange-500 transition-colors">{category}</Link>
            {brand && (
              <>
                <span>›</span>
                <span className="text-orange-500">{brand.charAt(0) + brand.slice(1).toLowerCase()}</span>
              </>
            )}
          </nav>

          {/* ── Main Product Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[480px_1fr] gap-8 pb-10">

            {/* Left: Image Gallery */}
            <div className="sticky top-[60px] self-start">
              {/* Mode Toggles */}
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setViewMode('gallery')}
                  className={`flex-1 py-2 text-xs font-bold rounded-full transition-all border ${viewMode === 'gallery' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                >
                  Gallery
                </button>
                {product.gsmArenaId && (
                  <button 
                    onClick={() => setViewMode('3d')}
                    className={`flex-1 py-2 text-xs font-bold rounded-full transition-all border flex items-center justify-center gap-1.5 ${viewMode === '3d' ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                  >
                    <GitCompare className="w-3.5 h-3.5" /> 3D View
                  </button>
                )}
              </div>

              {/* Main Display */}
              <div className="border border-gray-100 rounded-2xl bg-white flex items-center justify-center overflow-hidden relative" style={{ height: '440px' }}>
                <AnimatePresence mode="wait">
                  {viewMode === 'gallery' ? (
                    <motion.img
                      key={currentImage}
                      src={currentImage}
                      alt={product.title}
                      className="w-[85%] h-[85%] object-contain mix-blend-multiply bg-white"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      onError={e => { e.target.src = placeholder; }}
                    />
                  ) : (
                    <motion.div
                      key="3d-viewer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50"
                    >
                      {product.gsmArenaId ? (
                        <>
                          <iframe 
                            src={`https://www.gsmarena.com/size-compare-3d.php3?idPhone1=${product.gsmArenaId}`}
                            className="w-full h-full border-none"
                            title="3D Product View"
                          />
                          <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-100 text-[10px] text-gray-500 text-center">
                            Interact with the model to rotate and view colors (Power by GSMArena)
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <GitCompare className="w-8 h-8" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">3D View Not Available</h3>
                            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">3D models are not yet available for futuristic or concept products.</p>
                          </div>
                          <button 
                            onClick={() => setViewMode('gallery')}
                            className="mt-2 text-xs font-bold text-orange-500 hover:underline"
                          >
                            Back to Gallery
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Thumbnails */}
              {viewMode === 'gallery' && hasMultiple && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`flex-shrink-0 w-[72px] h-[72px] rounded-xl border-2 bg-white flex items-center justify-center transition-all ${i === currentImageIndex && !colorSyncImage ? 'border-orange-500' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      <img src={img.url} alt={`view ${i + 1}`} className="w-[80%] h-[80%] object-contain mix-blend-multiply" onError={e => { e.target.src = placeholder; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="flex flex-col gap-5 pt-2">
              {/* Brand + Compare */}
              <div className="flex items-center justify-between">
                {brand && <span className="text-xs font-bold tracking-[0.15em] text-gray-500 uppercase">{brand}</span>}
                <button className="flex items-center gap-1.5 text-xs text-orange-500 hover:underline font-medium">
                  <GitCompare className="w-3.5 h-3.5" /> Add to Compare
                </button>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.title}</h1>

              {/* Price row */}
              <div className="flex items-center flex-wrap gap-3">
                <span className="text-2xl font-bold text-gray-900">{price}</span>
                <span className="text-sm text-gray-400 font-medium">(Cash Price)</span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">{originalPrice}</span>
                )}
                {saving > 0 && (
                  <span className="text-xs font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">
                    ৳{new Intl.NumberFormat('en-IN').format(saving)} OFF
                  </span>
                )}
                <span className={`ml-auto text-sm font-semibold ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                  Availability: {inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* ── Color Selector ── */}
              {product.colors && product.colors.length > 0 && (() => {
                const swatchMap = {
                  // Apple
                  'Black Titanium': '#2c2c2e', 'White Titanium': '#f0f0ee', 'Natural Titanium': '#c8b89a', 
                  'Desert Titanium': '#c9a87c', 'Dark Blue Titanium': '#1e3a5f', 'Silver': '#b8b8b8', 
                  'Space Black': '#2c2c2e',
                  // Samsung
                  'Titanium Black': '#2c2c2e', 'Titanium Gray': '#707070', 'Titanium Violet': '#7c5c8c', 
                  'Titanium Yellow': '#d4c144', 'Titanium SilverBlue': '#a5b8d0', 'Titanium WhiteSilver': '#e8e8e8',
                  'Silver Shadow': '#b0b0b0', 'Pink': '#e8a0b0', 'Navy': '#202a44', 
                  'Moonstone Gray': '#9a9a8a', 'Platinum Silver': '#d5d5d5',
                  'Titanium Silver': '#c0c0c0', 'Titanium White': '#f0f0f0',
                  // Google
                  'Obsidian': '#1c1c1c', 'Porcelain': '#f5f0e8', 'Hazel': '#8b9b6e', 'Rose Quartz': '#e8c0c0', 
                  'Iris': '#7b5ea7', 'Peony': '#c44b78', 'Moonstone': '#7e8a96', 'Jade': '#7b917b',
                };
                return (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Color: <span className="font-normal text-gray-500">{selectedColor}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(color => {
                        const bg = swatchMap[color] || '#888';
                        const isSelected = selectedColor === color;
                        return (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            title={color}
                            style={{ background: bg, width: 30, height: 30, borderRadius: '50%',
                              boxShadow: isSelected ? `0 0 0 3px white, 0 0 0 5px #f97316` : '0 0 0 1px #e5e7eb' }}
                            className="flex-shrink-0 transition-all"
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* ── Storage / Option Selector ── */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Storage:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${
                            isSelected ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-gray-200 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {variant.storage || variant.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Select Quantity:</p>
                <div className="flex items-center border-2 border-gray-200 rounded-xl w-fit overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleBuyNow}
                  disabled={!canBuy || addingToCart}
                  className="col-span-2 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  Shop Now
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={!canBuy || addingToCart}
                  className="py-3 rounded-xl border-2 border-gray-200 hover:border-gray-400 text-gray-800 font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> Add To Cart
                </button>
                <a
                  href={`https://wa.me/+8801711105888?text=Hi, I want to buy ${encodeURIComponent(product.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Whatsapp
                </a>
              </div>

              {/* Info strip */}
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500 font-bold text-base">%</span>
                  <span>EMI Available <button className="text-orange-500 underline font-medium">View Plans</button></span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <span>Delivery Timescale: <strong>3–5 Days</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabbed Section ── */}
          <div className="border-t border-gray-100 mt-4 pb-20">
            {/* Tab bar */}
            <div className="flex gap-0 border-b border-gray-200 mt-6">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-semibold transition-all rounded-t-lg mr-1 ${activeTab === tab ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
              {/* Main tab content */}
              <div>
                {activeTab === 'Specification' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Specification</h2>
                    <table className="w-full text-sm border-collapse">
                      <tbody>
                        {specRows.map((row, i) => (
                          <tr key={i} className="border border-gray-100">
                            <td className="py-3 px-4 text-orange-500 font-semibold w-[140px] bg-gray-50 align-top whitespace-nowrap">{row.label}</td>
                            <td className="py-3 px-4 text-gray-700 leading-relaxed">{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'Description' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Descriptions</h2>
                    {/* Banner image */}
                    <div className="rounded-2xl overflow-hidden mb-6 bg-gray-100" style={{ maxHeight: '380px' }}>
                      <img src={product.image || placeholder} alt={product.title} className="w-full h-full object-cover" onError={e => { e.target.src = placeholder; }} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{product.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {activeTab === 'Warranty' && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Warranty Information</h2>
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
                      <p className="font-semibold text-gray-900 mb-2">Official Warranty</p>
                      <p>This product comes with an official manufacturer's warranty. Warranty period and terms vary by brand. Please contact our support team or WhatsApp for warranty verification and claims.</p>
                      <ul className="mt-4 list-disc list-inside space-y-1 text-gray-600">
                        <li>1 year manufacturer warranty (standard)</li>
                        <li>Service center support across Bangladesh</li>
                        <li>30-day exchange on defective units</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Recently Viewed sidebar placeholder */}
              <div className="hidden lg:block">
                <h3 className="text-base font-bold text-gray-900 mb-4">Recently Viewed</h3>
                <div className="border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  <img src={product.image || placeholder} alt={product.title} className="w-16 h-16 object-contain rounded-xl bg-gray-50 mix-blend-multiply" onError={e => { e.target.src = placeholder; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{product.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">{price}</span>
                      {originalPrice && <span className="text-xs text-gray-400 line-through">{originalPrice}</span>}
                    </div>
                    {saving > 0 && (
                      <span className="inline-block mt-1 text-[11px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">
                        ৳{new Intl.NumberFormat('en-IN').format(saving)} OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}