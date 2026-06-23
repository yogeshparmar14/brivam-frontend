import Link from 'next/link';

const cats = [
  { name: 'Whey Protein', slug: 'whey-protein', emoji: '🥛', desc: 'Fast-absorbing protein for muscle recovery' },
  { name: 'Plant Protein', slug: 'plant-protein', emoji: '🌱', desc: 'Vegan-friendly complete amino acid profile' },
  { name: 'Mass Gainer', slug: 'mass-gainer', emoji: '💪', desc: 'High-calorie formula for serious bulk' },
  { name: 'Creatine', slug: 'creatine', emoji: '⚡', desc: 'Boost strength and explosive performance' },
  { name: 'Pre-Workout', slug: 'pre-workout', emoji: '🔥', desc: 'Energy and focus for intense training' },
  { name: 'Vitamins', slug: 'vitamins', emoji: '💊', desc: 'Essential micronutrients for health' },
];

export default function CategorySection() {
  return (
    <section className="py-16 bg-cream">
      <div className="container-site">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop by Category</h2>
          <p className="text-gray-500">Find exactly what you need for your fitness journey</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cats.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group bg-white rounded-xl p-5 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              <div className="text-3xl mb-3">{cat.emoji}</div>
              <h3 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-brand-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 leading-snug hidden md:block">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
