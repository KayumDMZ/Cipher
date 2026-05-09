import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Truck, RefreshCw, Tag, Headphones, CreditCard } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getProducts } from '@/api/EcommerceApi.js';

// ── SVG CATEGORY ICONS ────────────────────────────────────────────────────────
const SVG_ICONS = {
  'Mobile Phone': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="16" y="4" width="32" height="56" rx="6" fill="#f97316"/><rect x="20" y="12" width="24" height="36" rx="2" fill="white"/><circle cx="32" cy="54" r="3" fill="white"/></svg>
  ),
  'Home Appliances': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><path d="M8 28L32 8l24 20v28H8z" fill="#6366f1"/><rect x="24" y="36" width="16" height="20" rx="2" fill="white"/><rect x="28" y="20" width="8" height="10" rx="1" fill="white"/></svg>
  ),
  'Tablet & Accessories': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="10" y="6" width="44" height="52" rx="5" fill="#3b82f6"/><rect x="15" y="12" width="34" height="38" rx="2" fill="white"/><circle cx="32" cy="55" r="2.5" fill="white"/></svg>
  ),
  'Wired Headphone': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><path d="M14 32c0-10 8-18 18-18s18 8 18 18" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/><rect x="8" y="30" width="10" height="14" rx="4" fill="#f97316"/><rect x="46" y="30" width="10" height="14" rx="4" fill="#f97316"/><path d="M32 44v10" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/><circle cx="32" cy="55" r="3" fill="#f97316"/></svg>
  ),
  'Laptop': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="8" y="14" width="48" height="30" rx="4" fill="#1d1d1f"/><rect x="12" y="18" width="40" height="22" rx="2" fill="#86efac"/><rect x="2" y="44" width="60" height="6" rx="3" fill="#374151"/></svg>
  ),
  'Airpods': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><ellipse cx="22" cy="28" rx="7" ry="14" fill="white" stroke="#d1d5db" strokeWidth="1.5"/><ellipse cx="42" cy="28" rx="7" ry="14" fill="white" stroke="#d1d5db" strokeWidth="1.5"/><circle cx="22" cy="36" r="4" fill="#3b82f6"/><circle cx="42" cy="36" r="4" fill="#3b82f6"/><path d="M22 42v8M42 42v8" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
  'Wireless Headphone': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><path d="M12 34c0-11 9-20 20-20s20 9 20 20" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/><rect x="6" y="32" width="10" height="14" rx="3" fill="#ef4444"/><rect x="48" y="32" width="10" height="14" rx="3" fill="#ef4444"/></svg>
  ),
  'Headphone': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><path d="M12 34c0-11 9-20 20-20s20 9 20 20" fill="none" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round"/><rect x="6" y="30" width="12" height="20" rx="5" fill="#1d1d1f"/><rect x="46" y="30" width="12" height="20" rx="5" fill="#1d1d1f"/></svg>
  ),
  'Smart Watch': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="24" y="14" width="16" height="36" rx="5" fill="#f97316"/><rect x="27" y="18" width="10" height="24" rx="2" fill="white"/><rect x="26" y="8" width="12" height="8" rx="2" fill="#ea580c"/><rect x="26" y="48" width="12" height="8" rx="2" fill="#ea580c"/><line x1="32" y1="22" x2="32" y2="28" stroke="#f97316" strokeWidth="1.5"/><line x1="32" y1="28" x2="36" y2="31" stroke="#f97316" strokeWidth="1.5"/></svg>
  ),
  'Speakers': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="14" y="10" width="36" height="44" rx="8" fill="#2563eb"/><circle cx="32" cy="30" r="10" fill="#1d4ed8"/><circle cx="32" cy="30" r="5" fill="#60a5fa"/><circle cx="32" cy="14" r="3" fill="#93c5fd"/></svg>
  ),
  'Starlink': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><ellipse cx="32" cy="24" rx="22" ry="13" fill="#374151" stroke="#6b7280" strokeWidth="1.5"/><ellipse cx="32" cy="24" rx="13" ry="8" fill="#4b5563"/><line x1="32" y1="37" x2="32" y2="54" stroke="#6b7280" strokeWidth="3" strokeLinecap="round"/><line x1="20" y1="54" x2="44" y2="54" stroke="#6b7280" strokeWidth="3" strokeLinecap="round"/></svg>
  ),
  'Adapter': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="16" y="12" width="32" height="28" rx="6" fill="#1d1d1f"/><rect x="26" y="40" width="12" height="8" rx="2" fill="#374151"/><rect x="24" y="20" width="6" height="8" rx="1" fill="white"/><rect x="34" y="20" width="6" height="8" rx="1" fill="white"/><rect x="28" y="48" width="8" height="4" rx="1" fill="#6b7280"/></svg>
  ),
  'Cables': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="4" y="28" width="10" height="8" rx="2" fill="#374151"/><rect x="50" y="28" width="10" height="8" rx="2" fill="#374151"/><path d="M14 32 Q32 10 50 32" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/></svg>
  ),
  'Hubs & Docks': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="8" y="24" width="48" height="16" rx="4" fill="#6366f1"/><rect x="14" y="28" width="7" height="8" rx="2" fill="white"/><rect x="25" y="28" width="7" height="8" rx="2" fill="white"/><rect x="36" y="28" width="7" height="8" rx="2" fill="white"/><rect x="46" y="28" width="5" height="8" rx="2" fill="#a5b4fc"/></svg>
  ),
  'Wireless Charger': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><ellipse cx="32" cy="44" rx="22" ry="8" fill="#d1d5db"/><ellipse cx="32" cy="42" rx="20" ry="6" fill="#e5e7eb"/><path d="M27 28l4-12 2 8h6l-5 14-2-10z" fill="#f97316"/></svg>
  ),
  'Smart Pen': (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2"><rect x="28" y="6" width="8" height="44" rx="4" fill="#d1d5db"/><polygon points="28,50 36,50 32,60" fill="#9ca3af"/><circle cx="32" cy="12" r="3" fill="#6b7280"/></svg>
  ),
};

const CATEGORIES = [
  { label: 'Mobile Phone',         link: '/store?category=phone' },
  { label: 'Home Appliances',      link: '/store?category=tv' },
  { label: 'Tablet & Accessories', link: '/store?category=tablet' },
  { label: 'Wired Headphone',      link: '/store?category=audio' },
  { label: 'Laptop',               link: '/store?category=laptop' },
  { label: 'Airpods',              link: '/store?category=audio' },
  { label: 'Wireless Headphone',   link: '/store?category=audio' },
  { label: 'Headphone',            link: '/store?category=audio' },
  { label: 'Smart Watch',          link: '/store?category=watch' },
  { label: 'Speakers',             link: '/store?category=audio' },
  { label: 'Starlink',             link: '/store?category=accessories' },
  { label: 'Adapter',              link: '/store?category=accessories' },
  { label: 'Cables',               link: '/store?category=accessories' },
  { label: 'Hubs & Docks',         link: '/store?category=accessories' },
  { label: 'Wireless Charger',     link: '/store?category=accessories' },
  { label: 'Smart Pen',            link: '/store?category=accessories' },
];

const BADGES = [
  { icon: CreditCard, label: '36 Months EMI' },
  { icon: Truck,      label: 'Fastest Home Delivery' },
  { icon: RefreshCw,  label: 'Exchange Facility' },
  { icon: Tag,        label: 'Best Price Deals' },
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
  useEffect(() => { timer.current = setInterval(() => setCur(c => (c+1)%SLIDES.length), 4500); return () => clearInterval(timer.current); }, []);
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
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" style={{ color: s.accentColor }}/>Best Price</span>
          <span className="flex items-center gap-1"><Truck className="w-3 h-3" style={{ color: s.accentColor }}/>Same Day Delivery</span>
          <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" style={{ color: s.accentColor }}/>36 Month EMI</span>
        </div>
      </div>
      <div className="absolute right-0 top-0 h-full w-[55%] flex items-center justify-center pr-4">
        <img src={s.img} alt={s.title} className="h-full max-h-[360px] w-auto object-contain drop-shadow-xl animate-float mix-blend-multiply bg-white"/>
      </div>
      <button onClick={() => go(cur-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow z-10 hover:bg-white transition-all"><ChevronLeft className="w-4 h-4 text-gray-700"/></button>
      <button onClick={() => go(cur+1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 shadow z-10 hover:bg-white transition-all"><ChevronRight className="w-4 h-4 text-gray-700"/></button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {SLIDES.map((_,i) => <button key={i} onClick={() => go(i)} className="h-1.5 rounded-full transition-all" style={{ width: i===cur?'20px':'6px', background: i===cur?s.accentColor:'#cbd5e1' }}/>)}
      </div>
    </div>
  );
}

function SideBanners() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex-1 rounded-2xl overflow-hidden flex items-center justify-between px-5" style={{ background:'linear-gradient(135deg,#1a1a3e,#2d1b69)', minHeight:'160px' }}>
        <div>
          <p className="text-orange-400 text-xs font-bold uppercase tracking-wider">Latest Series</p>
          <h3 className="text-white text-xl font-black mt-1">iPhone 17<br/><span className="text-orange-400">Series</span></h3>
          <p className="text-white/50 text-xs mt-1">A studio in your pocket</p>
          <Link to="/store?brand=apple" className="mt-3 inline-block text-orange-400 text-xs font-semibold hover:underline">Shop Now →</Link>
        </div>
        <img src="/products/iphone-17-pro.png" alt="iPhone" className="h-28 object-contain mix-blend-multiply bg-white opacity-90"/>
      </div>
      <div className="flex-1 rounded-2xl overflow-hidden flex items-center justify-between px-5" style={{ background:'linear-gradient(135deg,#0f4c75,#1b6ca8)', minHeight:'160px' }}>
        <div>
          <p className="text-cyan-300 text-xs font-bold uppercase tracking-wider">Best Seller</p>
          <h3 className="text-white text-xl font-black mt-1">Galaxy<br/><span className="text-cyan-300">S26 Ultra</span></h3>
          <p className="text-white/50 text-xs mt-1">200MP Under-Display Camera</p>
          <Link to="/store?brand=samsung" className="mt-3 inline-block text-cyan-300 text-xs font-semibold hover:underline">Shop Now →</Link>
        </div>
        <img src="/products/s26-ultra.png" alt="Galaxy S26" className="h-28 object-contain mix-blend-multiply bg-white opacity-80"/>
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
            <Icon className="w-5 h-5 text-orange-500"/>
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
              {SVG_ICONS[label] || <span className="text-2xl">📦</span>}
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
  useEffect(() => { getProducts().then(({ products }) => setProducts(products)); }, []);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900">New <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">Trends</span></h2>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all"><ChevronLeft className="w-4 h-4 text-gray-600"/></button>
          <button onClick={() => scroll(1)} className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-all"><ChevronRight className="w-4 h-4 text-white"/></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth:'none' }}>
        {products.map((product) => {
          const v = product.variants[0];
          const price = v.sale_price_formatted || v.price_formatted;
          const orig = v.sale_price_in_cents ? v.price_formatted : null;
          const saving = v.sale_price_in_cents ? Math.round((v.price_in_cents - v.sale_price_in_cents)/100) : null;
          return (
            <Link key={product.id} to={`/product/${product.id}`} className="flex-shrink-0 w-[200px] group">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md hover:border-gray-200 transition-all h-full flex flex-col">
                <div className="h-[140px] flex items-center justify-center mb-3 bg-gray-50 rounded-xl overflow-hidden">
                  <img src={product.image} alt={product.title} className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 bg-white" onError={e => { e.target.style.opacity='0.3'; }}/>
                </div>
                {product.ribbon_text && <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-1">{product.ribbon_text}</span>}
                <p className="text-gray-900 font-semibold text-sm leading-tight flex-1">{product.title}</p>
                <div className="mt-2">
                  <p className="text-gray-900 font-bold text-base">৳ {price.replace('৳','')}</p>
                  {orig && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-400 text-xs line-through">৳ {orig.replace('৳','')}</span>
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
    { id:'apple-watch-ultra-3',    title:'Apple Watch Ultra 3',  sub:'Adventure awaits.',          bg:'#f5f5f7',                                                          dark:false, img:'/products/watch-ultra.png',                                                                                                          cls:'animate-float-spin mix-blend-multiply' },
    { id:'google-pixel-9-pro-fold',title:'Pixel 9 Pro Fold',     sub:'An epic display of AI.',     bg:'#f5f5f7',                                                          dark:false, img:'https://fdn2.gsmarena.com/vv/pics/google/google-pixel-9-pro-fold-1.jpg',                                                                                                   cls:'animate-float mix-blend-multiply' },
    { id:'samsung-galaxy-z-fold6', title:'Galaxy Z Fold6',       sub:'Unfold a whole new world.',  bg:'#f5f5f7',                                                          dark:false, img:'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-z-fold6-1.jpg',                                                                                                  cls:'animate-float mix-blend-multiply' },
    { id:'ipad-pro-m4',            title:'iPad Pro M4',          sub:'Thin. Powerful. Stunning.',  bg:'#f5f5f7',                                                          dark:false, img:'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spaceblack-202405?wid=800&fmt=png-alpha',                                        cls:'animate-float' },
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
              <Link to="/store" className="btn-apple-outline text-xs px-4 py-2" style={item.dark ? { borderColor:'rgba(255,255,255,0.35)', color:'white' } : {}}>Buy</Link>
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
        <meta name="description" content="Shop the latest iPhone, Samsung, Google and more. Best prices in Bangladesh with 36 month EMI and same-day delivery."/>
      </Helmet>
      <Header/>
      <main className="bg-[#f5f5f7] pt-[44px]">
        <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-4">
          <section className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
            <HeroSlider/>
            <div className="hidden lg:block"><SideBanners/></div>
          </section>
          <TrustBadges/>
          <FeaturedCategories/>
          <NewTrends/>
          <BentoShowcase/>
        </div>
      </main>
      <Footer/>
    </>
  );
}