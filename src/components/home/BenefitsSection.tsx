import Link from 'next/link';

export default function BenefitsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Every Scoop Counts.<br />
              <span className="text-brand-700">Make It BRIVAM.</span>
            </h2>
            <p className="text-gray-500 text-lg mb-6 leading-relaxed">
              We started BRIVAM because we believed Indian athletes deserved better —
              better quality, better transparency, better value. No compromise.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Minimum 25g protein per serving',
                'Under 5g carbs & 2g fat (Whey Isolate)',
                'Instantized for smooth mixability',
                'Digestive enzymes for better absorption',
                'FSSAI certified manufacturing',
              ].map(point => (
                <li key={point} className="flex items-center gap-3 text-gray-700">
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn-primary">
              Explore Products
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '24g', label: 'Protein/Serving', sub: 'Minimum guaranteed' },
              { value: '<150', label: 'Calories', sub: 'Per serving' },
              { value: '9', label: 'Essential AAs', sub: 'Complete protein' },
              { value: '5g', label: 'BCAAs', sub: '2:1:1 ratio' },
            ].map(stat => (
              <div key={stat.label} className="bg-brand-50 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-brand-700 mb-1">{stat.value}</p>
                <p className="font-semibold text-gray-800 text-sm">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
