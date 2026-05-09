import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Cpu, Camera, Battery, Smartphone, Zap, Shield, ChevronRight } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const specRows = [
  { label: 'Display', value: '6.3" / 6.9" Super Retina XDR with ProMotion (1-120Hz)' },
  { label: 'Chip', value: 'A18 Pro with 6-core CPU, 6-core GPU, 16-core Neural Engine' },
  { label: 'Camera', value: '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto' },
  { label: 'Battery', value: 'Up to 33 hours video playback (iPhone 16 Pro Max)' },
  { label: 'Storage', value: '256GB · 512GB · 1TB' },
  { label: 'Material', value: 'Grade 5 Titanium with Ceramic Shield front & back glass' },
  { label: 'Connectivity', value: 'Wi-Fi 7, Bluetooth 5.3, Thread, UWB' },
  { label: 'Water resistance', value: 'IP68 — 6 metres for 30 minutes' },
];

const features = [
  { icon: Smartphone, title: 'Titanium Design', desc: 'Grade 5 titanium — the same used in spacecraft. Strongest, lightest iPhone Pro ever.' },
  { icon: Zap, title: 'A18 Pro Chip', desc: 'The first 3nm chip in a smartphone. Handles Apple Intelligence with unprecedented power.' },
  { icon: Camera, title: 'Pro Camera System', desc: '48MP main camera with second-generation quad-pixel sensor and 4K 120fps video.' },
  { icon: Battery, title: 'All-Day Battery', desc: 'The longest battery life ever in an iPhone Pro. Up to 33 hours of video playback.' },
  { icon: Shield, title: 'Crash Detection', desc: 'Can detect a severe car crash and call for help automatically — even if you can\'t.' },
  { icon: Cpu, title: 'Apple Intelligence', desc: 'On-device AI for writing, photos, and Siri — powered by the Neural Engine.' },
];

const colors = [
  { name: 'Black Titanium', style: { background: '#1c1c1e' } },
  { name: 'White Titanium', style: { background: '#f5f5f0', border: '1px solid #d2d2d7' } },
  { name: 'Natural Titanium', style: { background: '#a5a09a' } },
  { name: 'Desert Titanium', style: { background: '#c9a96e' } },
];

const models = [
  { name: 'iPhone 16 Pro', price: 'From $999', storage: '256GB — 1TB', screen: '6.3"', link: '/product/iphone-16-pro' },
  { name: 'iPhone 16 Pro Max', price: 'From $1199', storage: '256GB — 1TB', screen: '6.9"', link: '/product/iphone-16-pro' },
];

function IPhonePage() {
  return (
    <>
      <Helmet>
        <title>iPhone 16 Pro — Cipher</title>
        <meta name="description" content="iPhone 16 Pro. Titanium. A18 Pro chip. 48MP Pro camera system. Designed for Apple Intelligence." />
      </Helmet>

      <div className="bg-black min-h-screen text-white pt-[44px]">
        <Header />

        <main>
          {/* ── Hero ──────────────────────────────────────────── */}
          <section className="relative w-full h-[700px] flex flex-col items-center justify-between overflow-hidden pt-20">
            <div className="relative z-10 text-center px-4 max-w-3xl">
              <p className="text-[#f5f5f7] text-[21px] font-semibold mb-2">
                iPhone 16 Pro
              </p>
              <h1 className="text-[56px] md:text-[80px] font-semibold leading-[1.05] tracking-tight mb-4">
                Titanium.
              </h1>
              <p className="text-[24px] md:text-[28px] text-[#86868b] leading-snug">
                Hello, Apple Intelligence.
              </p>
              <div className="flex items-center justify-center gap-4 mt-8">
                <Link to="/product/iphone-16-pro" className="btn-apple text-[17px] px-8 py-3">
                  Buy
                </Link>
              </div>
            </div>
            
            <div className="w-full flex-1 relative mt-10">
              <img
                src="https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409_GEO_US?wid=1600"
                alt="iPhone 16 Pro"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-80"
              />
            </div>
          </section>

          {/* ── Subtitle strip ───────────────────────────────── */}
          <div className="py-6 border-y border-[#424245] bg-[#141414]">
            <div className="max-w-[1024px] mx-auto px-4 text-center">
              <p className="text-[#f5f5f7] text-[14px]">
                <span className="font-semibold">Apple Intelligence</span> &nbsp;|&nbsp; <span className="font-semibold">Camera Control</span> &nbsp;|&nbsp; <span className="font-semibold">4K 120fps Dolby Vision</span> &nbsp;|&nbsp; <span className="font-semibold">A18 Pro chip</span>
              </p>
            </div>
          </div>

          {/* ── Features grid ────────────────────────────────── */}
          <section className="py-28 bg-black">
            <div className="max-w-[1024px] mx-auto px-4">
              <div className="text-center mb-20">
                <h2 className="text-[48px] md:text-[64px] font-semibold leading-tight tracking-tight">
                  Pro features.<br />
                  <span className="text-[#86868b]">Pro results.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.title} className="bg-[#141414] p-8 rounded-3xl">
                      <div className="mb-6">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-[21px] font-semibold text-white mb-3">{f.title}</h3>
                      <p className="text-[#86868b] text-[17px] leading-relaxed">{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── Colors ───────────────────────────────────────── */}
          <section className="py-24 bg-[#141414]">
            <div className="max-w-[1024px] mx-auto px-4 text-center">
              <h2 className="text-[40px] md:text-[56px] font-semibold leading-tight tracking-tight mb-4">
                Four stunning finishes.
              </h2>
              <p className="text-[#86868b] text-[21px] mb-16">All in titanium. All iconic.</p>

              <div className="flex justify-center gap-10 flex-wrap">
                {colors.map((c) => (
                  <div key={c.name} className="text-center">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4"
                      style={c.style}
                    />
                    <p className="text-[#f5f5f7] text-[14px] font-medium">{c.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Specs ────────────────────────────────────────── */}
          <section className="py-24 bg-black">
            <div className="max-w-[800px] mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-[40px] md:text-[56px] font-semibold tracking-tight">Technical Specifications</h2>
              </div>

              <div className="border-t border-[#424245]">
                {specRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col sm:flex-row py-6 border-b border-[#424245]"
                  >
                    <span className="text-[#f5f5f7] text-[17px] font-semibold w-full sm:w-1/3 mb-2 sm:mb-0">
                      {row.label}
                    </span>
                    <span className="text-[#86868b] text-[17px] w-full sm:w-2/3 leading-relaxed">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Models ───────────────────────────────────────── */}
          <section className="py-24 bg-[#141414]">
            <div className="max-w-[1024px] mx-auto px-4">
              <h2 className="text-[40px] font-semibold tracking-tight text-center mb-16">Choose your iPhone 16 Pro.</h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {models.map((m) => (
                  <div key={m.name} className="bg-black p-10 rounded-3xl text-center">
                    <h3 className="text-[28px] font-semibold mb-2">{m.name}</h3>
                    <p className="text-[#86868b] text-[17px] mb-8">{m.screen} Super Retina XDR display</p>
                    <p className="text-[21px] font-semibold mb-8">{m.price}</p>
                    <Link to={m.link} className="btn-apple px-8 py-3 text-[17px]">
                      Buy
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default IPhonePage;