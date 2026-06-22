import Link from 'next/link';
import Image from 'next/image';
import { Camera, Play, Share2, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-gray-300 mt-16">
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Image src="/newLogo.png" alt="BRIVAM" width={120} height={48} className="h-12 w-auto brightness-200 mb-4" />
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Premium protein supplements crafted for serious athletes. Fuel your performance, achieve your goals.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Camera, href: '#' },
                { Icon: Play, href: '#' },
                { Icon: Share2, href: '#' },
                { Icon: MessageCircle, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} className="w-8 h-8 bg-brand-800 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-brand-700 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Products</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['Whey Protein', '/shop?category=whey-protein'],
                ['Plant Protein', '/shop?category=plant-protein'],
                ['Mass Gainer', '/shop?category=mass-gainer'],
                ['Creatine', '/shop?category=creatine'],
                ['Pre-Workout', '/shop?category=pre-workout'],
                ['Vitamins & Minerals', '/shop?category=vitamins'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['About Us', '/about'],
                ['Blog', '/blog'],
                ['Contact', '/contact'],
                ['Return Policy', '/return-policy'],
                ['Privacy Policy', '/privacy'],
                ['Terms of Service', '/terms'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-brand-400" />
                <span>Brivam Nutrition, Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-brand-400" />
                <a href="tel:+918888888888" className="hover:text-white transition-colors">+91 88888 88888</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-brand-400" />
                <a href="mailto:hello@brivam.in" className="hover:text-white transition-colors">hello@brivam.in</a>
              </li>
            </ul>

            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Newsletter</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-brand-900 border border-brand-800 text-white placeholder-gray-500 text-sm px-3 py-2 rounded focus:outline-none focus:border-brand-600"
                />
                <button type="submit" className="bg-brand-700 text-white text-xs px-3 py-2 rounded hover:bg-brand-600 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-900">
        <div className="container-site py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} BRIVAM. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure payments with</span>
            <div className="flex gap-2 items-center">
              <span className="bg-white text-gray-800 px-2 py-0.5 rounded text-xs font-bold">Razorpay</span>
              <span className="bg-white text-gray-800 px-2 py-0.5 rounded text-xs font-bold">UPI</span>
              <span className="bg-white text-gray-800 px-2 py-0.5 rounded text-xs font-bold">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
