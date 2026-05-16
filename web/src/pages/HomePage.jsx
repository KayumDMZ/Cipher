import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, RefreshCw, Tag, Headphones, CreditCard } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getProducts } from '@/api/EcommerceApi.js';

// ── CATEGORY IMAGES ──────────────────────────────────────────────────────────
const CATEGORY_IMAGES = {
  'Mobile Phone': '/categories/phone.png',
  'Home Appliances': '/categories/home.png',
  'Tablet & Accessories': '/categories/tablet.png',
  'Wired Headphone': '/categories/audio.png',
  'Laptop': '/categories/laptop.png',
  'Airpods': '/categories/airpods.png',
  'Wireless Headphone': '/categories/audio.png',
  'Headphone': '/categories/audio.png',
  'Smart Watch': '/categories/watch.png',
  'Speakers': '/categories/speaker.png',
  'Starlink': '/categories/starlink.png',
  'Adapter': '/categories/accessories.png',
  'Cables': '/categories/accessories.png',
  'Hubs & Docks': '/categories/accessories.png',
  'Wireless Charger': '/categories/accessories.png',
  'Smart Pen': '/categories/pen.png',
};

const CATEGORIES = [
  { label: 'Mobile Phone', link: '/store?category=phone' },
  { label: 'Home Appliances', link: '/store?category=tv' },
  { label: 'Tablet & Accessories', link: '/store?category=tablet' },
  { label: 'Wired Headphone', link: '/store?category=audio' },
  { label: 'Laptop', link: '/store?category=laptop' },
  { label: 'Airpods', link: '/store?category=audio' },
  { label: 'Wireless Headphone', link: '/store?category=audio' },
  { label: 'Headphone', link: '/store?category=audio' },
  { label: 'Smart Watch', link: '/store?category=watch' },
  { label: 'Speakers', link: '/store?category=audio' },
  { label: 'Starlink', link: '/store?category=accessories' },
  { label: 'Adapter', link: '/store?category=accessories' },
  { label: 'Cables', link: '/store?category=accessories' },
  { label: 'Hubs & Docks', link: '/store?category=accessories' },
  { label: 'Wireless Charger', link: '/store?category=accessories' },
  { label: 'Smart Pen', link: '/store?category=accessories' },
];

const BADGES = [
  { icon: CreditCard, label: '36 Months EMI' },
  { icon: Truck, label: 'Fastest Home Delivery' },
  { icon: RefreshCw, label: 'Exchange Facility' },
  { icon: Tag, label: 'Best Price Deals' },
  { icon: Headphones, label: 'After-Sales Service' },
];

const SLIDES = [
  { id: 'iphone-17-pro', title: 'iPhone 17 Pro', sub: 'A19 Pro chip. Pro Fusion camera.', badge: 'New 2025', accentColor: '#6366f1', bg: 'linear-gradient(135deg,#e8f0ff,#f5f0ff)', img: '/products/iphone-17-pro.png', link: '/product/iphone-17-pro', storeLink: '/store?brand=apple' },
  { id: 'galaxy-s26-ultra', title: 'Galaxy S26 Ultra', sub: 'Snapdragon 9 Elite. 200MP Under-Display Camera.', badge: 'Latest Samsung', accentColor: '#0ea5e9', bg: 'linear-gradient(135deg,#e8f5ff,#e8f0ff)', img: '/products/s26-ultra.png', link: '/product/samsung-galaxy-s26-ultra', storeLink: '/store?brand=samsung' },
  { id: 'macbook-pro-m5', title: 'MacBook Pro M5', sub: 'Supercharged for professionals.', badge: '2026 Model', accentColor: '#8b5cf6', bg: 'linear-gradient(135deg,#f0f4ff,#f5f0ff)', img: '/products/macbook-pro.png', link: '/product/macbook-pro-m5', storeLink: '/store?brand=apple' },
  { id: 'pixel-9a', title: 'Pixel 9a', sub: 'Google AI at a smarter price.', badge: 'Best Value', accentColor: '#10b981', bg: 'linear-gradient(135deg,#f0fff4,#f0fffe)', img: '/products/pixel-9-pro.png', link: '/product/google-pixel-9a', storeLink: '/store?brand=google' },
];

function HeroSlider() {
  const [cur, setCur] = useState(0);
  const timer = useRef(null);
  const go = (i) => setCur((i + SLIDES.length) % SLIDES.length);
  useEffect(() => { timer.current = setInterval(() => setCur(c => (c + 1) % SLIDES.length), 4500); return () => clearInterval(timer.current); }, []);
  const s = SLIDES[cur];
  return (
    <div className="relative rounded-2xl overflow-hidden h-[340px] md:h-[400px]" style={{ background: s.bg, transition: 'background .5s' }}>
      <span className="absolute top-4 left-5 text-xs font-bold px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm z-10" style={{ color: s.accentColor }}>{s.badge}</span>
      <div className="absolute left-7 bottom-10 z-10">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900">{s.title}</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-[200px]">{s.sub}</p>
        <div className="flex gap-3 mt-4">
          <Link to={s.link} className="btn-apple text-xs px-4 py-2">Learn more</Link>
          <Link to={s.storeLink} className="btn-apple-outline text-xs px-4 py-2">Buy</Link>
        </div>
        <div className="flex gap-4 mt-4 text-[11px] text-gray-400 font-medium">
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" style={{ color: s.accentColor }} />Best Price</span>
          <span className="flex items-center gap-1"><Truck className="w-3 h-3" style={{ color: s.accentColor }} />Same Day Delivery</span>
          <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" style={{ color: s.accentColor }} />36 Month EMI</span>
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-[55%] flex items-center justify-center pr-4">
        <img src={s.img} alt={s.title} className="h-full max-h-[360px] w-auto object-contain drop-shadow-xl animate-float mix-blend-multiply bg-white" />
      </div>
      <button onClick={() => go(cur - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow z-10 hover:bg-white transition-all"><ChevronLeft className="w-4 h-4 text-gray-700" /></button>
      <button onClick={() => go(cur + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow z-10 hover:bg-white transition-all"><ChevronRight className="w-4 h-4 text-gray-700" /></button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {SLIDES.map((_, i) => <button key={i} onClick={() => go(i)} className="h-1.5 rounded-full transition-all" style={{ width: i === cur ? '20px' : '6px', background: i === cur ? s.accentColor : '#cbd5e1' }} />)}
      </div>
    </div>
  );
}

function SideBanners() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex-1 rounded-2xl overflow-hidden flex items-center justify-between px-5" style={{ background: 'linear-gradient(135deg,#1a1a3e,#2d1b69)', minHeight: '160px' }}>
        <div>
          <p className="text-orange-400 text-xs font-bold uppercase tracking-wider">Latest Series</p>
          <h3 className="text-white text-xl font-black mt-1">iPhone 17<br /><span className="text-orange-400">Series</span></h3>
          <p className="text-white/50 text-xs mt-1">A studio in your pocket</p>
          <Link to="/store?brand=apple" className="mt-3 inline-block text-orange-400 text-xs font-semibold hover:underline">Shop Now →</Link>
        </div>
        <img src="/products/iphone-17-pro.png" alt="iPhone" className="h-28 object-contain mix-blend-multiply bg-white opacity-90" />
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden flex items-center justify-between px-5" style={{ background: 'linear-gradient(135deg,#0f4c75,#1b6ca8)', minHeight: '160px' }}>
        <div>
          <p className="text-cyan-300 text-xs font-bold uppercase tracking-wider">Best Seller</p>
          <h3 className="text-white text-xl font-black mt-1">Galaxy<br /><span className="text-cyan-300">S26 Ultra</span></h3>
          <p className="text-white/50 text-xs mt-1">200MP Under-Display Camera</p>
          <Link to="/store?brand=samsung" className="mt-3 inline-block text-cyan-300 text-xs font-semibold hover:underline">Shop Now →</Link>
        </div>
        <img src="/products/s26-ultra.png" alt="Galaxy S26" className="h-28 object-contain mix-blend-multiply bg-white opacity-80" />
      </div>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl py-4 px-2 flex items-center justify-around shadow-sm">
      {BADGES.map(({ icon: Icon, label }) => (
        <div key={label} className="flex flex-col items-center gap-1.5 text-center flex-1">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <Icon className="w-5 h-5 text-orange-500" />
          </div>
          <span className="text-[11px] text-gray-600 font-medium leading-tight">{label}</span>
        </div>
      ))}
    </div>
  );
}

function FeaturedCategories() {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-6">
        Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Categories</span>
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
        {CATEGORIES.map(({ label, link }) => (
          <Link key={label} to={link} className="flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center group-hover:border-orange-200 group-hover:scale-105 group-hover:shadow-md transition-all duration-200">
              <img
                src={CATEGORY_IMAGES[label]}
                alt={label}
                className="w-12 h-12 object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=📦'; }}
              />
            </div>
            <span className="text-[11px] text-gray-600 text-center leading-tight group-hover:text-orange-500 transition-colors font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function NewTrends() {
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  useEffect(() => { getProducts().then(({ products: p }) => setProducts(p || [])); }, []);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

  // Only show products that have at least one variant with pricing
  const displayProducts = products.filter(p => Array.isArray(p.variants) && p.variants.length > 0);

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900">New <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Trends</span></h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"><ChevronLeft className="w-4 h-4 text-gray-600" /></button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-all"><ChevronRight className="w-4 h-4 text-white" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {displayProducts.map((product) => {
          const v = product.variants[0];
          const price = v?.sale_price_formatted || v?.price_formatted || '—';
          const orig = v?.sale_price_in_cents ? v?.price_formatted : null;
          const saving = v?.sale_price_in_cents ? Math.round(((v?.price_in_cents || 0) - v.sale_price_in_cents) / 100) : null;
          return (
            <Link key={product.id} to={`/product/${product.id}`} className="flex-shrink-0 w-[200px] group">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 transition-all h-full flex flex-col">
                <div className="h-[140px] flex items-center justify-center mb-3 bg-gray-50 rounded-xl overflow-hidden">
                  <img src={product.image} alt={product.title} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 bg-white" onError={e => { e.target.style.opacity = '0.3'; }} />
                </div>
                {product.ribbon_text && <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">{product.ribbon_text}</span>}
                <p className="text-gray-900 font-semibold text-sm leading-tight flex-1">{product.title}</p>
                <div className="mt-2">
                  <p className="text-gray-900 font-bold text-base">৳ {String(price).replace('৳', '')}</p>
                  {orig && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-400 text-xs line-through">৳ {String(orig).replace('৳', '')}</span>
                      <span className="text-xs font-bold text-white bg-green-500 rounded px-1.5 py-0.5">৳{new Intl.NumberFormat('en-IN').format(saving)} OFF</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function BentoShowcase() {
  const items = [
    { id: 'apple-watch-ultra-3', title: 'Apple Watch Ultra 3', sub: 'Adventure awaits.', bg: 'linear-gradient(135deg,#f5f5f7,#e8eaf0)', dark: false, img: '/products/watch-ultra.png', cls: 'animate-float-spin mix-blend-multiply' },
    { id: 'google-pixel-9-pro-fold', title: 'Pixel 9 Pro Fold', sub: 'An epic display of AI.', bg: 'linear-gradient(135deg,#f0fff4,#e8f5ff)', dark: false, img: '/products/pixel-9-pro.png', cls: 'animate-float mix-blend-multiply' },
    { id: 'samsung-galaxy-z-fold6', title: 'Galaxy Z Fold6', sub: 'Unfold a whole new world.', bg: 'linear-gradient(135deg,#e8f0ff,#f0e8ff)', dark: false, img: '/products/z-fold-6.png', cls: 'animate-float mix-blend-multiply' },
    { id: 'ipad-pro-m4', title: 'iPad Pro M4', sub: 'Thin. Powerful. Stunning.', bg: 'linear-gradient(135deg,#f5f0ff,#f0f4ff)', dark: false, img: '/products/ipad-pro-m4.png', cls: 'animate-float' },
  ];
  return (
    <div className="bento-grid">
      {items.map(item => (
        <div key={item.id} className="bento-item h-[460px] md:h-[520px] flex flex-col rounded-2xl overflow-hidden" style={{ background: item.bg }}>
          {/* Text block — always on top, never overlapped */}
          <div className="relative z-10 text-center px-6 pt-10 pb-4 flex-shrink-0">
            <h4 className="text-[28px] md:text-[32px] font-black leading-tight" style={{ color: item.dark ? '#f5f5f7' : '#1d1d1f' }}>{item.title}</h4>
            <p className="text-[15px] mt-1" style={{ color: item.dark ? 'rgba(245,245,247,0.6)' : 'rgba(29,29,31,0.55)' }}>{item.sub}</p>
            <div className="flex justify-center gap-3 mt-4">
              <Link to={`/product/${item.id}`} className="btn-apple text-xs px-4 py-2">Learn more</Link>
              <Link to="/store" className="btn-apple-outline text-xs px-4 py-2" style={item.dark ? { borderColor: 'rgba(255,255,255,0.35)', color: 'white' } : {}}>Buy</Link>
            </div>
          </div>
          {/* Image block — fills remaining space, never overlaps text */}
          <div className="flex-1 flex items-end justify-center overflow-hidden pb-6 px-4">
            <img
              src={item.img}
              alt={item.title}
              className={`w-full max-w-[300px] h-full max-h-[280px] object-contain bg-white ${item.cls}`}
              onError={e => { e.target.style.opacity = '0.15'; }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Cipher | Top Tech Brands</title>
        <meta name="description" content="Shop the latest iPhone, Samsung, Google and more. Best prices in Bangladesh with 36 month EMI and same-day delivery." />
      </Helmet>
      <Header />
      <main className="bg-[#f5f5f7] pt-[44px]">
        <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
            <HeroSlider />
            <div className="hidden lg:block"><SideBanners /></div>
          </section>
          <TrustBadges />
          <FeaturedCategories />
          <NewTrends />
          <BentoShowcase />
        </div>
      </main>
      <Footer />
    </>
  );
}