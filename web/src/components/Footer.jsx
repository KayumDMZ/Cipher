import React from 'react';
import { Link } from 'react-router-dom';

const footerSections = [
  {
    title: 'Shop',
    links: [
      { label: 'Store',        to: '/store' },
      { label: 'Phones',       to: '/store?category=phone' },
      { label: 'Tablets',      to: '/store?category=tablet' },
      { label: 'Laptops',      to: '/store?category=laptop' },
      { label: 'Watches',      to: '/store?category=watch' },
      { label: 'Audio',        to: '/store?category=audio' },
      { label: 'TV & Home',    to: '/store?category=tv' },
      { label: 'Accessories',  to: '/store?category=accessories' },
    ],
  },
  {
    title: 'Brands',
    links: [
      { label: 'Apple',   to: '/store?brand=apple' },
      { label: 'Samsung', to: '/store?brand=samsung' },
      { label: 'Google',  to: '/store?brand=google' },
      { label: 'Sony',    to: '/store' },
      { label: 'OnePlus', to: '/store' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Manage Your Account', to: '#' },
      { label: 'Order Status',        to: '#' },
      { label: 'Returns & Refunds',   to: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center',          to: '#' },
      { label: 'Repair Services',      to: '#' },
      { label: 'Contact Us',           to: '#' },
      { label: 'Product Registration', to: '#' },
    ],
  },
  {
    title: 'About Cipher',
    links: [
      { label: 'Our Story',             to: '#' },
      { label: 'Careers',               to: '#' },
      { label: 'Press',                 to: '#' },
      { label: 'Corporate Responsibility', to: '#' },
      { label: 'Newsroom',              to: '#' },
    ],
  },
];

function Footer() {
  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] text-xs leading-[1.33337] font-normal tracking-[-0.01em]">
      <div className="max-w-[980px] mx-auto px-4 pt-4 pb-10">
        <div className="border-b border-[#d2d2d7] pb-4 mb-5 text-[#6e6e73]">
          <p className="mb-2">
            All prices are in Bangladeshi Taka (BDT). Product availability and pricing may vary. Cipher is an authorized reseller of Apple, Samsung, and Google products in Bangladesh.
          </p>
          <p>
            EMI available on selected products via bKash, Nagad, and major banks. Terms & conditions apply.
          </p>
        </div>

        <div className="flex flex-wrap lg:flex-nowrap justify-between gap-5 mb-8">
          {footerSections.map((section, idx) => (
            <div key={idx} className="w-full sm:w-[calc(50%-10px)] lg:w-1/5">
              <h3 className="font-semibold text-[#1d1d1f] mb-2">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[#424245] hover:text-[#1d1d1f] transition-colors hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#d2d2d7] pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[#6e6e73]">
          <p>
            Visit us: <Link to="#" className="text-[#0066cc] underline">Cipher Showroom, Dhaka</Link> or call{' '}
            <a href="tel:+8801700000000" className="text-[#0066cc] underline">+880 1700-000000</a>. Also available on{' '}
            <a href="https://wa.me/8801700000000" target="_blank" rel="noreferrer" className="text-[#0066cc] underline">WhatsApp</a>.
          </p>
        </div>

        <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[#6e6e73]">
          <p>Copyright © {new Date().getFullYear()} Cipher Bangladesh. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {['Privacy Policy', 'Terms of Use', 'Sales and Refunds', 'Legal', 'Site Map'].map((link, i) => (
              <React.Fragment key={link}>
                <Link to="#" className="hover:text-[#1d1d1f] hover:underline transition-colors">
                  {link}
                </Link>
                {i < 4 && <span className="text-[#d2d2d7]">|</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="hover:underline cursor-pointer">Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;