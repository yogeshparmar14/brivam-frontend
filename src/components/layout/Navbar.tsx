'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ShoppingCart, User, Menu, X, Search, ChevronDown } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const categories = [
  { label: 'Whey Protein', href: '/shop?category=whey-protein' },
  { label: 'Plant Protein', href: '/shop?category=plant-protein' },
  { label: 'Mass Gainer', href: '/shop?category=mass-gainer' },
  { label: 'Creatine', href: '/shop?category=creatine' },
  { label: 'Pre-Workout', href: '/shop?category=pre-workout' },
  { label: 'Vitamins', href: '/shop?category=vitamins' },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const { openCart } = useCartStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setShowCategories(false); }, [pathname]);

  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
      {/* Top bar */}
      <div className="bg-brand-800 text-white text-xs py-2 text-center tracking-wider">
        FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; USE CODE <strong>BRIVAM10</strong> FOR 10% OFF
      </div>

      <div className="container-site">
        <nav className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image src="/newLogo.png" alt="BRIVAM" width={120} height={48} className="h-12 w-auto" priority />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={`hover:text-brand-700 transition-colors ${pathname === '/' ? 'text-brand-700' : 'text-gray-700'}`}>
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className={`flex items-center gap-1 transition-colors hover:text-brand-700 ${pathname.startsWith('/shop') || pathname.startsWith('/product') ? 'text-brand-700' : 'text-gray-700'}`}>
                Products <ChevronDown size={14} className={`transition-transform ${showCategories ? 'rotate-180' : ''}`} />
              </button>
              {showCategories && (
                // pt-2 bridges the visual gap so onMouseLeave doesn't fire mid-hover
                <div className="absolute top-full left-0 w-52 pt-2 z-50">
                  <div className="bg-white shadow-lg border border-gray-100 rounded py-2">
                    <Link href="/shop" className={`block px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 font-semibold border-b border-gray-100 mb-1 ${pathname === '/shop' && !searchParams.get('category') && !searchParams.get('featured') ? 'text-brand-700 bg-brand-50' : 'text-gray-700'}`}>
                      All Products
                    </Link>
                    {categories.map(c => {
                      const categorySlug = new URL(c.href, 'http://x').searchParams.get('category');
                      const isActive = pathname === '/shop' && searchParams.get('category') === categorySlug;
                      return (
                        <Link
                          key={c.href}
                          href={c.href}
                          className={`block px-4 py-2 text-sm hover:bg-brand-50 hover:text-brand-700 ${isActive ? 'text-brand-700 bg-brand-50' : 'text-gray-600'}`}
                        >
                          {c.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <Link href="/shop?featured=true" className="text-gray-700 hover:text-brand-700 transition-colors">
              Best Sellers
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <Link href="/shop" className="hidden md:flex text-gray-600 hover:text-brand-700 transition-colors p-1">
              <Search size={20} />
            </Link>

            <button
              onClick={openCart}
              className="relative text-gray-600 hover:text-brand-700 transition-colors p-1"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-700 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-gray-600 hover:text-brand-700 transition-colors p-1">
                  <User size={22} />
                  <span className="hidden md:inline text-sm font-medium">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full pt-2 w-44 z-50 hidden group-hover:block">
                  <div className="bg-white shadow-lg border border-gray-100 rounded py-2">
                    <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50">My Account</Link>
                    <Link href="/account/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50">My Orders</Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-brand-700 hover:bg-brand-50 font-medium">Admin Panel</Link>
                    )}
                    <hr className="my-1" />
                    <button onClick={() => logout()} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex btn-primary py-2 px-4 text-xs">
                Login
              </Link>
            )}

            <button
              className="md:hidden p-1 text-gray-700"
              onClick={() => setMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container-site py-4 flex flex-col gap-3">
            <Link href="/" className="text-gray-700 font-medium py-2 border-b border-gray-50">Home</Link>
            <Link href="/shop" className="text-gray-700 font-medium py-2 border-b border-gray-50">All Products</Link>
            {categories.map(c => (
              <Link key={c.href} href={c.href} className="text-gray-600 py-2 pl-2 border-b border-gray-50 text-sm">
                {c.label}
              </Link>
            ))}
            {!user && (
              <div className="flex gap-2 mt-2">
                <Link href="/login" className="btn-primary flex-1 text-center">Login</Link>
                <Link href="/register" className="btn-outline flex-1 text-center">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
