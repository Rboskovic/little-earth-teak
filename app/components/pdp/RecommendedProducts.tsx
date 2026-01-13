import {Suspense} from 'react';
import {Await, Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';

interface RecommendedProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    id?: string;
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
}

interface RecommendedProductsProps {
  products: Promise<{products: {nodes: RecommendedProduct[]}} | null> | null;
}

export function RecommendedProducts({products}: RecommendedProductsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold text-neutral-900">
          More Things You'll Love
        </h2>
        <Link
          to="/collections/all"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors underline"
        >
          View All Products
        </Link>
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <Await
          resolve={products}
          errorElement={<ProductGridError />}
        >
          {(response) => (
            <ProductGrid products={response?.products?.nodes ?? []} />
          )}
        </Await>
      </Suspense>
    </div>
  );
}

/**
 * Product Grid Component
 */
function ProductGrid({products}: {products: RecommendedProduct[]}) {
  if (products.length === 0) {
    return (
      <p className="text-center text-neutral-500 py-8">
        No products available at the moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
      {products.slice(0, 8).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

/**
 * Individual Product Card
 */
function ProductCard({product}: {product: RecommendedProduct}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      className="group block"
      prefetch="intent"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100 mb-3">
        {product.featuredImage ? (
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            sizes="(min-width: 768px) 25vw, 50vw"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div>
        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <div className="mt-1">
          <Money
            data={product.priceRange.minVariantPrice}
            className="text-sm text-neutral-600"
          />
        </div>
      </div>
    </Link>
  );
}

/**
 * Loading Skeleton
 */
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({length: 8}).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square bg-neutral-200 rounded-lg mb-3" />
          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-neutral-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

/**
 * Error State
 */
function ProductGridError() {
  return (
    <p className="text-center text-neutral-500 py-8">
      Unable to load recommended products. Please try again later.
    </p>
  );
}