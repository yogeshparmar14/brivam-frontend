'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Truck, RotateCcw, ShieldCheck, ChevronRight, Plus, Minus } from 'lucide-react';
import { Product, Review } from '@/types';
import { formatPrice, discount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import ProductAdvantage from '@/components/product/ProductAdvantage';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const TICKER_ITEMS = ['25g Protein', 'PDCAAS 1/1', 'FSSAI Approved', 'Lab Tested', '5g BCAAs', '9 EAAs', 'No Fillers', 'Free Delivery ₹999+'];

export default function ProductClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const [selectedVariantIdx, setVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');
  const [faqOpen, setFaqOpen] = useState<number | null>(0);

  const { data: reviewsData } = useQuery<{ reviews: Review[]; total: number }>({
    queryKey: ['reviews', product._id],
    queryFn: async () => {
      const { data } = await api.get(`/products/${product._id}/reviews`);
      return data;
    },
  });

  const variant = product.variants[selectedVariantIdx];
  const allImages = [
    ...product.images,
    ...(variant?.images || []),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const disc = variant ? discount(variant.mrp, variant.price) : 0;

  const handleAddToCart = () => {
    if (!variant || variant.stock === 0) return;
    addItem({
      product: product._id,
      variantSku: variant.sku,
      flavor: variant.flavor,
      weight: variant.weight,
      quantity,
      price: variant.price,
      mrp: variant.mrp,
      image: allImages[0] || '',
      name: product.name,
    });
    toast.success('Added to cart!');
    openCart();
  };

  const categoryName = typeof product.category === 'object' ? product.category.name : product.brand;
  const categorySlug = typeof product.category === 'object' ? product.category.slug : '';

  const productFaqs = [
    { q: `What does ${product.name} contain?`, a: product.ingredients || 'See the full ingredient list on the product label. All OJAM supplements have transparent labeling with no hidden fillers.' },
    { q: 'Is this product lab tested?', a: 'Yes. All OJAM products undergo third-party lab testing for purity, protein content, and heavy metals before reaching you.' },
    { q: 'When should I take this supplement?', a: product.howToUse || 'Mix one scoop with 200–250ml of cold water or milk. Best consumed within 30 minutes post-workout for optimal muscle recovery.' },
    { q: 'Is free shipping available?', a: 'Yes, OJAM offers free shipping on all orders above ₹999 across India. Orders are typically delivered within 3–7 business days.' },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-site py-2.5">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400 uppercase tracking-wider font-medium">
            <Link href="/" className="hover:text-brand-700 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href={`/shop?category=${categorySlug}`} className="hover:text-brand-700 transition-colors">{categoryName}</Link>
            <ChevronRight size={12} />
            <span className="text-gray-600 line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="container-site py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-0">

          {/* ── Left: Images ── */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
              {allImages[activeImg] ? (
                <Image
                  src={allImages[activeImg]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <span className="text-6xl">📦</span>
                </div>
              )}
              {disc > 0 && (
                <span className="absolute top-4 left-4 bg-brand-700 text-white text-sm font-black px-3 py-1 tracking-wide uppercase">
                  -{disc}%
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-brand-600' : 'border-gray-100 hover:border-gray-300'}`}
                  >
                    <Image src={img} alt={`${product.name} – image ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div>
            {/* Category tag */}
            <p className="text-brand-700 text-xs font-black uppercase tracking-widest mb-2">
              {categoryName}
            </p>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-black text-brand-700 uppercase leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} className={i < Math.round(product.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.averageRating.toFixed(1)} ({product.reviewCount} Reviews)</span>
              </div>
            )}

            {/* Price */}
            {variant && (
              <div className="mb-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl font-black text-gray-900">{formatPrice(variant.price)}/-</span>
                  {variant.mrp > variant.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">{formatPrice(variant.mrp)}</span>
                      <span className="text-sm font-black text-accent-600 uppercase tracking-wide">-{disc}% OFF</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Incl. of all taxes &amp; shipping</p>
              </div>
            )}

            {/* Short description */}
            <p className="text-gray-600 text-sm leading-relaxed my-4 max-w-lg">{product.shortDescription}</p>

            {/* Mini stats bar */}
            <div className="flex flex-wrap gap-0 border border-gray-200 divide-x divide-gray-200 rounded-sm mb-5">
              {[
                { v: '25g', l: 'Protein' },
                { v: '5g', l: 'BCAAs' },
                { v: 'All 9', l: 'EAAs' },
              ].map(({ v, l }) => (
                <div key={l} className="flex-1 py-2.5 text-center">
                  <p className="text-base font-black text-gray-900">{v}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{l}</p>
                </div>
              ))}
            </div>

            {/* Flavor selector */}
            {product.variants.some(v => v.flavor) && (
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
                  Flavor: <span className="font-semibold text-gray-800 normal-case tracking-normal">{variant?.flavor || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, i) => v.flavor && (
                    <button
                      key={v.sku}
                      onClick={() => setVariantIdx(i)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 text-sm font-bold border-2 transition-all uppercase tracking-wide ${
                        selectedVariantIdx === i
                          ? 'border-brand-700 bg-brand-700 text-white'
                          : 'border-gray-200 text-gray-600 hover:border-brand-400'
                      } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                    >
                      {v.flavor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Weight/size selector */}
            {product.variants.some(v => v.weight) && (
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-2">
                  Size: <span className="font-semibold text-gray-800 normal-case tracking-normal">{variant?.weight || 'Select'}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(product.variants.map(v => v.weight))].filter(Boolean).map(w => {
                    const v = product.variants.find(vv => vv.weight === w && (!variant?.flavor || vv.flavor === variant.flavor));
                    return (
                      <button
                        key={w}
                        onClick={() => v && setVariantIdx(product.variants.indexOf(v))}
                        disabled={!v || v.stock === 0}
                        className={`px-4 py-2 text-sm font-bold border-2 transition-all uppercase tracking-wide ${
                          variant?.weight === w ? 'border-brand-700 bg-brand-700 text-white' : 'border-gray-200 text-gray-600 hover:border-brand-400'
                        } ${!v || v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {w}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border-2 border-gray-200">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-3 text-gray-600 hover:bg-gray-50 font-bold text-lg">−</button>
                <span className="px-5 text-sm font-black">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-3 text-gray-600 hover:bg-gray-50 font-bold text-lg">+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!variant || variant.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-black uppercase tracking-widest text-sm py-3.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={16} />
                {variant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            {/* Free shipping badge */}
            <div className="bg-accent-500 text-white text-xs font-black uppercase tracking-widest text-center py-2.5 mb-5">
              FREE SHIPPING + FREE CREATINE ON ₹999+
            </div>

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <ul className="space-y-1.5 mb-5">
                {product.benefits.slice(0, 5).map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-brand-600 rounded-full shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Trust row */}
            <div className="flex flex-wrap gap-5 text-xs text-gray-500 pt-4 border-t border-gray-100">
              {[
                { Icon: ShieldCheck, label: 'Lab Tested & Certified' },
                { Icon: Truck,       label: 'Free Shipping ₹999+' },
                { Icon: RotateCcw,   label: '7-Day Easy Return' },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon size={14} className="text-brand-600" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrolling ticker ── */}
      <div className="bg-brand-700 text-white py-2.5 overflow-hidden">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-black uppercase tracking-widest mx-6">
              {item} <span className="text-brand-300 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── The OJAM Advantage ── */}
      <ProductAdvantage />

      {/* ── FAQ + Product claim split ── */}
      <section className="border-t border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left: FAQ */}
          <div className="bg-[#f8f5f0] p-8 md:p-14">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-brand-700 leading-tight mb-8">
              Frequently<br />Asked<br />Questions
            </h2>
            <div className="divide-y divide-gray-200">
              {productFaqs.map((faq, i) => (
                <div key={i}>
                  <button
                    className="w-full flex items-start justify-between py-4 text-left gap-4 group"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  >
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition-colors leading-snug">{faq.q}</span>
                    <span className="shrink-0 mt-0.5">
                      {faqOpen === i ? <Minus size={15} className="text-brand-700" /> : <Plus size={15} className="text-gray-400" />}
                    </span>
                  </button>
                  {faqOpen === i && (
                    <p className="pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/shop" className="btn-primary">
                EXPLORE ALL PRODUCTS
              </Link>
            </div>
          </div>

          {/* Right: Bold claim */}
          <div className="bg-brand-950 text-white flex flex-col justify-center p-8 md:p-14">
            <h3 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-8">
              Pure Protein.<br />Real Results.<br />No Compromise.
            </h3>
            <div className="space-y-6">
              {[
                { v: '25g', l: 'Protein Per Serving', s: 'Minimum guaranteed — no fillers' },
                { v: 'PDCAAS 1/1', l: 'Protein Quality Score', s: 'Complete amino acid profile' },
                { v: 'All 9', l: 'Essential Amino Acids', s: 'Including all 3 BCAAs' },
              ].map(({ v, l, s }) => (
                <div key={l} className="flex items-start gap-5">
                  <div className="text-2xl md:text-3xl font-black text-accent-400 w-28 shrink-0 leading-tight">{v}</div>
                  <div>
                    <p className="text-sm font-black text-white uppercase tracking-wide">{l}</p>
                    <p className="text-xs text-gray-400 mt-1">{s}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Description / Nutrition / Reviews tabs ── */}
      <div className="container-site py-12">
        <div className="border-b border-gray-200 flex gap-0 mb-8">
          {([['description', 'Description'], ['nutrition', 'Nutrition Facts'], ['reviews', `Reviews (${product.reviewCount})`]] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-black uppercase tracking-wide border-b-2 -mb-px transition-colors ${
                activeTab === tab ? 'border-brand-700 text-brand-700' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="max-w-3xl">
            <div className="prose text-gray-600 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />
            {product.howToUse && (
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-5 mb-4">
                <h3 className="font-black text-gray-800 uppercase tracking-wide text-sm mb-2">How to Use</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{product.howToUse}</p>
              </div>
            )}
            {product.ingredients && (
              <div>
                <h3 className="font-black text-gray-800 uppercase tracking-wide text-sm mb-2">Ingredients</h3>
                <p className="text-gray-500 text-sm">{product.ingredients}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="max-w-lg">
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-brand-700 text-white p-4">
                <h3 className="font-black text-lg uppercase tracking-wide">Nutrition Facts</h3>
                <p className="text-brand-300 text-sm">Per serving / Per 100g</p>
              </div>
              {product.nutritionFacts.map((fact, i) => (
                <div key={i} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className="text-gray-700 font-semibold">{fact.label}</span>
                  <div className="text-right text-gray-500">
                    {fact.perServing && <span className="mr-4">{fact.perServing}</span>}
                    {fact.per100g && <span>{fact.per100g}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-3xl">
            {!reviewsData?.reviews.length ? (
              <p className="text-gray-400 text-center py-12 font-medium">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-5">
                {reviewsData.reviews.map(r => (
                  <div key={r._id} className="border border-gray-100 rounded-xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex gap-0.5 mb-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star key={i} size={13} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                          ))}
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm">{r.title}</h4>
                      </div>
                      {r.isVerifiedPurchase && (
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold">✓ Verified</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                    <p className="text-gray-400 text-xs mt-2">{r.user.name} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sticky bottom bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
        <div className="container-site py-2.5 flex items-center gap-4">
          {/* Thumbnail */}
          <div className="relative w-10 h-10 rounded border border-gray-100 overflow-hidden shrink-0 hidden sm:block">
            {allImages[0] ? (
              <Image src={allImages[0]} alt={product.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100" />
            )}
          </div>
          {/* Name + price */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black uppercase tracking-wide text-gray-700 truncate">{product.name}</p>
            {variant && (
              <p className="text-sm font-black text-brand-700">
                {formatPrice(variant.price)}/-
                {variant.mrp > variant.price && (
                  <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(variant.mrp)}</span>
                )}
              </p>
            )}
          </div>
          {/* Qty */}
          <div className="flex items-center border border-gray-200">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 font-bold">−</button>
            <span className="px-3 text-sm font-black">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-2.5 py-1.5 text-gray-600 hover:bg-gray-50 font-bold">+</button>
          </div>
          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!variant || variant.stock === 0}
            className="flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-black uppercase tracking-widest px-5 py-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <ShoppingCart size={14} />
            Add to cart
          </button>
        </div>
      </div>

      {/* Bottom padding so content isn't hidden behind sticky bar */}
      <div className="h-16" />
    </>
  );
}
