import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import ProductsList from '@/components/ProductsList.jsx';

function StorePage() {
  return (
    <>
      <Helmet>
        <title>Store - Cipher</title>
        <meta name="description" content="Shop the latest tech products including Cipher, Samsung, Google, and accessories." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-[#f5f5f7] pt-[44px]">
        {/* Store Header */}
        <div className="max-w-[1024px] mx-auto px-4 pt-16 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end">
          <div>
            <h1 className="text-[40px] md:text-[48px] font-semibold text-[#1d1d1f] leading-tight tracking-tight">
              <span className="text-[#1d1d1f]">Cipher.</span> <span className="text-[#6e6e73]">The best place to buy the tech you love.</span>
            </h1>
          </div>
          
          <div className="mt-8 md:mt-0 md:pl-10 text-sm text-[#1d1d1f]">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 flex-shrink-0 bg-white rounded-full flex items-center justify-center border border-[#d2d2d7]">
                  <span className="text-xs">💬</span>
                </div>
                <div>
                  <p className="font-semibold">Need shopping help?</p>
                  <a href="#" className="text-[#0066cc] hover:underline">Ask a Specialist</a>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-8 h-8 flex-shrink-0 bg-white rounded-full flex items-center justify-center border border-[#d2d2d7]">
                  <span className="text-xs">📍</span>
                </div>
                <div>
                  <p className="font-semibold">Visit a Cipher Store</p>
                  <a href="#" className="text-[#0066cc] hover:underline">Find one near you {'>'}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="max-w-[1024px] mx-auto px-4 pb-28">
          <ProductsList />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default StorePage;