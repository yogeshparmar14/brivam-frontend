import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Rohan Sharma',
    role: 'Competitive Bodybuilder',
    rating: 5,
    text: "OJAM Whey is honestly the best I've tried. Mixes perfectly, tastes great, and I can see real gains. Made in India and proud of it!",
    city: 'Mumbai',
  },
  {
    name: 'Priya Nair',
    role: 'Fitness Coach',
    rating: 5,
    text: "I recommend OJAM to all my clients. The transparent labeling gives me confidence — no hidden fillers, just pure quality protein.",
    city: 'Bangalore',
  },
  {
    name: 'Arjun Singh',
    role: 'CrossFit Athlete',
    rating: 5,
    text: "Switched from international brands to OJAM 6 months ago. Better value, same quality, faster delivery. Absolutely no complaints.",
    city: 'Delhi',
  },
  {
    name: 'Kavita Reddy',
    role: 'Marathon Runner',
    rating: 5,
    text: "The plant protein is perfect for my vegan lifestyle. Complete amino acid profile, easy to digest, and it actually tastes good!",
    city: 'Hyderabad',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-cream">
      <div className="container-site">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Athletes Say</h2>
          <p className="text-gray-500">Real reviews from our community of 50,000+ athletes</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-brand-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role} · {t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
