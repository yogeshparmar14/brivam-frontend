import { ShieldCheck, FlaskConical, Leaf, Truck, Star, Users } from 'lucide-react';

const reasons = [
  {
    Icon: ShieldCheck,
    title: 'Lab Tested',
    desc: 'Every batch third-party tested for purity, potency, and contaminants.',
  },
  {
    Icon: FlaskConical,
    title: 'Transparent Label',
    desc: 'Full ingredient disclosure. No proprietary blends. No hidden fillers.',
  },
  {
    Icon: Leaf,
    title: 'Clean Ingredients',
    desc: 'No artificial colours or harmful additives. Just what your body needs.',
  },
  {
    Icon: Truck,
    title: 'Fast Delivery',
    desc: 'Orders dispatched within 24 hours. Free shipping on orders above ₹999.',
  },
  {
    Icon: Star,
    title: 'Premium Quality',
    desc: 'Crafted with the finest protein sources from certified dairy farms.',
  },
  {
    Icon: Users,
    title: 'Community First',
    desc: '50,000+ athletes trust OJAM. Join our fitness community today.',
  },
];

export default function WhyOjam() {
  return (
    <section className="py-16 bg-brand-950 text-white">
      <div className="container-site">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why OJAM?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            We believe in complete transparency. What you read on the label is exactly what you get.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 rounded-lg bg-brand-900/60 hover:bg-brand-900 transition-colors">
              <div className="shrink-0 w-10 h-10 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Icon size={20} className="text-accent-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
