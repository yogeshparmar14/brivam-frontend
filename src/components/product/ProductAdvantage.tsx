import { Dumbbell, ShieldCheck, FlaskConical, Leaf, Star } from 'lucide-react';

const advantages = [
  { Icon: Dumbbell,     label: '25g Protein' },
  { Icon: Leaf,         label: 'No Fillers' },
  { Icon: FlaskConical, label: 'Lab Tested' },
  { Icon: Star,         label: 'PDCAAS 1/1' },
  { Icon: ShieldCheck,  label: 'FSSAI Approved' },
];

export default function ProductAdvantage() {
  return (
    <section className="py-14 border-t border-gray-100">
      <div className="container-site">
        <h2 className="text-3xl md:text-4xl font-black uppercase text-center text-brand-700 mb-10">
          The OJAM Advantage
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {advantages.map(({ Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-100 flex items-center justify-center">
                <Icon size={26} className="text-brand-700" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-700">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
