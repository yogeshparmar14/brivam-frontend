import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="bg-[#f5f0e8] overflow-hidden">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[520px] lg:min-h-[600px]">

          {/* Left: Text */}
          <div className="py-14 lg:py-20 order-2 lg:order-1">
            <p className="text-gray-500 font-semibold mb-2 uppercase tracking-widest text-xs">
              Introducing
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none text-gray-900 uppercase mb-2">
              Premium<br />Whey
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-brand-700 uppercase mb-8 tracking-wide">
              High-Performance Protein.
            </h2>

            <div className="flex flex-wrap items-center gap-5 mb-10">
              <div className="text-center">
                <p className="text-4xl font-black text-gray-900 leading-none">25g</p>
                <p className="text-xs font-bold uppercase text-gray-500 tracking-widest mt-1">Protein</p>
              </div>
              <div className="w-px h-12 bg-gray-300 hidden sm:block" />
              <div className="bg-brand-700 text-white px-5 py-3">
                <p className="text-sm font-black uppercase tracking-widest">GUT FRIENDLY</p>
                <p className="text-xs font-semibold text-brand-300 mt-1 uppercase tracking-wide">
                  CLEAN · COMPLETE · REAL PROTEIN
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary gap-2">
                SHOP NOW
                <ArrowRight size={16} />
              </Link>
              <Link href="/shop?featured=true" className="btn-outline">
                BEST SELLERS
              </Link>
            </div>
          </div>

          {/* Right: Product Visual */}
          <div className="relative order-1 lg:order-2 flex items-center justify-center lg:justify-end pt-12 lg:pt-0">
            <div className="relative">
              {/* Outer decorative ring */}
              <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full bg-[#ede5d5] flex items-center justify-center">
                {/* Inner circle */}
                <div className="w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 rounded-full bg-[#e4d9c6] flex items-center justify-center p-8">
                  <Image
                    src="/ojam.png"
                    alt="OJAM Premium Protein"
                    width={400}
                    height={160}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>
              </div>
              {/* Floating stat badges */}
              <div className="absolute -top-2 -right-4 bg-white shadow-md px-3 py-2 rounded text-center">
                <p className="text-xs font-black text-brand-700 uppercase">FSSAI</p>
                <p className="text-xs text-gray-500">Certified</p>
              </div>
              <div className="absolute -bottom-2 -left-4 bg-white shadow-md px-3 py-2 rounded text-center">
                <p className="text-xs font-black text-accent-600 uppercase">Lab</p>
                <p className="text-xs text-gray-500">Tested</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Stats strip */}
      <div className="border-t border-[#e0d5c2]">
        <div className="container-site py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: '50,000+', label: 'Happy Athletes' },
              { value: '25g', label: 'Protein Per Serving' },
              { value: '100%', label: 'Transparent Label' },
              { value: '4.8★', label: 'Average Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="py-2">
                <p className="text-brand-700 text-xl md:text-2xl font-black">{value}</p>
                <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
