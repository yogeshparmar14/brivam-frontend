'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, discount } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();
  const defaultVariant = product.variants[0];
  const img = defaultVariant?.images[0] || product.images[0] || '/placeholder-product.png';
  const disc = defaultVariant ? discount(defaultVariant.mrp, defaultVariant.price) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant || defaultVariant.stock === 0) return;
    addItem({
      product: product._id,
      variantSku: defaultVariant.sku,
      flavor: defaultVariant.flavor,
      weight: defaultVariant.weight,
      quantity: 1,
      price: defaultVariant.price,
      mrp: defaultVariant.mrp,
      image: img,
      name: product.name,
    });
    toast.success('Added to cart!');
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">

        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={img}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {disc > 0 && (
            <span className="absolute top-2 left-2 bg-brand-700 text-white text-xs font-bold px-2 py-0.5 rounded-sm">
              -{disc}%
            </span>
          )}
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-accent-500 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wide rounded-sm">
              Bestseller
            </span>
          )}
          {defaultVariant?.stock === 0 && (
            <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < Math.round(product.averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                {product.averageRating.toFixed(1)} | {product.reviewCount} Reviews
              </span>
            </div>
          )}

          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-snug flex-1">
            {product.name}
          </h3>

          {/* Price */}
          {defaultVariant && (
            <div className="mb-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-base font-black text-gray-900">
                  {formatPrice(defaultVariant.price)}/-
                </span>
                {defaultVariant.mrp > defaultVariant.price && (
                  <>
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(defaultVariant.mrp)}
                    </span>
                    <span className="text-xs font-bold text-accent-600">-{disc}% OFF</span>
                  </>
                )}
              </div>
              <div className="mt-1.5 bg-accent-50 border border-accent-200 text-accent-700 text-[10px] font-black py-1 px-2 text-center tracking-widest uppercase">
                FREE DELIVERY ON ₹999+
              </div>
            </div>
          )}

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!defaultVariant || defaultVariant.stock === 0}
            className="w-full bg-brand-700 hover:bg-brand-800 text-white text-xs font-black py-2.5 flex items-center justify-center gap-1.5 tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            <ShoppingCart size={13} />
            ADD TO CART
          </button>
        </div>

      </div>
    </Link>
  );
}
