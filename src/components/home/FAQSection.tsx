'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How much protein does OJAM Whey provide per serving?',
    a: 'Each serving of OJAM Whey Protein delivers a minimum of 25g of high-quality protein, supporting muscle growth and recovery after every workout.',
  },
  {
    q: 'Are OJAM supplements lab-tested and safe?',
    a: 'Yes. All OJAM products are manufactured in FSSAI-compliant facilities and undergo third-party lab testing for purity, protein content, and heavy metals before they reach you.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes, OJAM offers free shipping on all orders above ₹999 across India. Most orders are delivered within 3–7 business days with a tracking number.',
  },
  {
    q: 'Are OJAM protein supplements vegetarian or vegan?',
    a: 'Our whey proteins are vegetarian (sourced from milk). We also offer 100% plant-based protein options that are fully vegan-friendly. Each product page clearly shows its dietary category.',
  },
  {
    q: 'How do I choose the right protein for my goal?',
    a: 'For muscle building and recovery, go with Whey Isolate or Concentrate. For serious weight gain, choose a Mass Gainer. For a dairy-free lifestyle, try our Plant Protein. Contact us at hello@ojam.in for personalised guidance.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-16 bg-[#f8f7f5]">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-xl border border-gray-100 shadow-sm">

          {/* Left: FAQ accordion */}
          <div className="bg-white p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-brand-700 leading-tight mb-8">
              Frequently<br />Asked<br />Questions
            </h2>

            <div className="divide-y divide-gray-100">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    className="w-full flex items-start justify-between py-4 text-left gap-4 group"
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors leading-snug">
                      {faq.q}
                    </span>
                    <span className="shrink-0 mt-0.5">
                      {open === i
                        ? <Minus size={16} className="text-brand-700" />
                        : <Plus size={16} className="text-gray-400" />}
                    </span>
                  </button>
                  {open === i && (
                    <p className="pb-4 text-sm text-gray-500 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/shop" className="btn-primary">
                EXPLORE PRODUCTS
              </Link>
            </div>
          </div>

          {/* Right: Bold claim panel */}
          <div className="bg-brand-950 text-white flex flex-col justify-center p-8 md:p-12">
            <p className="text-accent-400 text-xs font-black uppercase tracking-widest mb-4">
              Why OJAM?
            </p>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight mb-10">
              The Purest<br />Protein Your<br />Body Will Love.
            </h3>

            <div className="space-y-7">
              {[
                { value: '25g', label: 'Protein Per Serving', sub: 'Minimum guaranteed — no fillers' },
                { value: 'PDCAAS 1/1', label: 'Protein Quality Score', sub: 'Complete amino acid profile' },
                { value: 'All 9', label: 'Essential Amino Acids', sub: 'Including all 3 BCAAs' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-start gap-5">
                  <div className="text-2xl md:text-3xl font-black text-accent-400 w-28 shrink-0 leading-tight">
                    {stat.value}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-wide">{stat.label}</p>
                    <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
