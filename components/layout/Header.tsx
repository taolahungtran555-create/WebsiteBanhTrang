'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Flame, Menu, X } from 'lucide-react';

const links = [
  { href: '/', label: 'Trang Chủ' },
  { href: '/menu', label: 'Thực Đơn' },
  { href: '/tin-tuc', label: 'Tin Tức' },
  { href: '/lien-he', label: 'Liên Hệ' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 shadow-md"
      style={{ background: '#A60817' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFB200' }}
            >
              <Flame size={22} color="#A60817" />
            </div>
            <div className="leading-tight">
              <div
                className="text-white font-bold text-sm"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Bánh Tráng Trộn
              </div>
              <div className="text-xs" style={{ color: '#FFB200', fontFamily: 'Inter, sans-serif' }}>
                Ngon Cần Thơ
              </div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all text-white hover:bg-white/10"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:0123456789"
              className="ml-4 px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{
                background: '#FFB200',
                color: '#A60817',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Gọi Đặt Hàng
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setOpen(!open)}
            aria-label="Mở menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden" style={{ background: '#8A2F2C' }}>
          <div className="px-4 pt-2 pb-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-xl text-sm font-medium text-white hover:bg-white/10 transition-all"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:0123456789"
              onClick={() => setOpen(false)}
              className="block mt-2 px-4 py-2 rounded-xl text-sm font-bold text-center transition-all"
              style={{ background: '#FFB200', color: '#A60817', fontFamily: 'Inter, sans-serif' }}
            >
              Gọi Đặt Hàng
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
