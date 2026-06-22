'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { ShoppingCart, Star, Shield, Truck, RotateCcw } from 'lucide-react';
import { Product, Review } from '@/types';
import { formatPrice, discount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductClient({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const [selectedVariantIdx, setVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'nutrition' | 'reviews'>('description');

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

  const flavors = [...new Set(product.variants.map(v => v.flavor).filter(Boolean))];
  const weights = [...new Set(product.variants.map(v => v.weight).filter(Boolean))];

  return (
    <div className="container-site py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
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
              <span className="absolute top-4 left-4 bg-brand-700 text-white text-sm font-bold px-3 py-1 rounded">
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
                  className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-brand-600' : 'border-gray-100'}`}
                >
                  <Image src={img} alt={`${product.name} – image ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-brand-700 text-sm font-semibold uppercase tracking-wider mb-2">
            {typeof product.category === 'object' ? product.category.name : product.brand}
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.averageRating} ({product.reviewCount} reviews)</span>
            </div>
          )}

          <p className="text-gray-600 mb-6 leading-relaxed">{product.shortDescription}</p>

          {variant && (
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">{formatPrice(variant.price)}</span>
              {variant.mrp > variant.price && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(variant.mrp)}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Save {formatPrice(variant.mrp - variant.price)}
                  </span>
                </>
              )}
            </div>
          )}

          {flavors.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Flavor: <span className="font-normal text-gray-500">{variant?.flavor || 'Select'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.filter(v => !v.weight || v.weight === variant?.weight).map((v) => (
                  v.flavor && (
                    <button
                      key={v.sku}
                      onClick={() => setVariantIdx(product.variants.indexOf(v))}
                      className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
                        selectedVariantIdx === product.variants.indexOf(v)
                          ? 'border-brand-600 bg-brand-50 text-brand-700'
                          : 'border-gray-200 text-gray-600 hover:border-brand-400'
                      } ${v.stock === 0 ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                      disabled={v.stock === 0}
                    >
                      {v.flavor}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}

          {weights.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Size: <span className="font-normal text-gray-500">{variant?.weight || 'Select'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {[...new Set(product.variants.map(v => v.weight))].filter(Boolean).map(w => {
                  const v = product.variants.find(vv => vv.weight === w && (!variant?.flavor || vv.flavor === variant.flavor));
                  return (
                    <button
                      key={w}
                      onClick={() => v && setVariantIdx(product.variants.indexOf(v))}
                      className={`px-3 py-1.5 rounded border text-sm font-medium transition-colors ${
                        variant?.weight === w ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-brand-400'
                      } ${!v || v.stock === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                      disabled={!v || v.stock === 0}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <div className="flex items-center border border-gray-200 rounded">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 text-lg">−</button>
              <span className="px-4 text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2.5 text-gray-600 hover:bg-gray-50 text-lg">+</button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!variant || variant.stock === 0}
              className="btn-primary flex-1 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              {variant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {product.benefits.length > 0 && (
            <ul className="space-y-1.5 mb-6">
              {product.benefits.slice(0, 4).map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-brand-600 rounded-full shrink-0" />{b}
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-4 border-t border-gray-100">
            {[
              { Icon: Shield, label: 'Lab Tested' },
              { Icon: Truck, label: 'Free ship ₹999+' },
              { Icon: RotateCcw, label: '7-Day Return' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={14} className="text-brand-600" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-0 mb-8">
        {([['description', 'Description'], ['nutrition', 'Nutrition Facts'], ['reviews', `Reviews (${product.reviewCount})`]] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab ? 'border-brand-700 text-brand-700' : 'border-transparent text-gray-500 hover:text-gray-700'
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
            <div className="bg-brand-50 rounded-xl p-5">
              <h3 className="font-semibold text-gray-800 mb-2">How to Use</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{product.howToUse}</p>
            </div>
          )}
          {product.ingredients && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">Ingredients</h3>
              <p className="text-gray-500 text-sm">{product.ingredients}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="max-w-lg">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-brand-900 text-white p-4">
              <h3 className="font-bold text-lg">Nutrition Facts</h3>
              <p className="text-brand-300 text-sm">Per serving / Per 100g</p>
            </div>
            {product.nutritionFacts.map((fact, i) => (
              <div key={i} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <span className="text-gray-700 font-medium">{fact.label}</span>
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
          {reviewsData?.reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-5">
              {reviewsData?.reviews.map(r => (
                <div key={r._id} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex gap-0.5 mb-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star key={i} size={13} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                        ))}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm">{r.title}</h4>
                    </div>
                    {r.isVerifiedPurchase && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">✓ Verified</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                  <p className="text-gray-400 text-xs mt-2">
                    {r.user.name} · {new Date(r.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
