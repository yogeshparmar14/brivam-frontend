import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-brand-950 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px)`,
        }} />
      </div>

      <div className="container-site relative z-10 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-brand-800/60 text-brand-300 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
            India&apos;s Premium Protein Brand
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Fuel Your
            <span className="block text-brand-400">Greatness</span>
            With Clean Protein
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
            Premium whey & plant protein supplements. Lab-tested, India-made, athlete-approved.
            Every scoop fuels your next milestone.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/shop" className="btn-primary bg-brand-500 hover:bg-brand-400 text-white text-sm gap-2">
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link href="/shop?featured=true" className="btn-outline border-gray-600 text-gray-300 hover:bg-white hover:text-brand-800 text-sm">
              Best Sellers
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            {[
              { Icon: ShieldCheck, label: 'Lab Tested & Certified' },
              { Icon: Truck, label: 'Free Shipping ₹999+' },
              { Icon: Award, label: 'FSSAI Approved' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon size={16} className="text-brand-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-t border-brand-900 bg-brand-900/50">
        <div className="container-site py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: '50,000+', label: 'Happy Athletes' },
              { value: '25g', label: 'Protein Per Serving' },
              { value: '100%', label: 'Transparent Label' },
              { value: '4.8★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="py-2">
                <p className="text-brand-300 text-xl md:text-2xl font-bold">{value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
