import {useState} from 'react';
import {Money, CartForm} from '@shopify/hydrogen';
import type {ProductFragment, ProductVariantFragment} from 'storefrontapi.generated';
import type {ProductOption} from '@shopify/hydrogen';
import {Star, Check, Truck, Shield, Leaf} from 'lucide-react';
import {ProductVariantSelector} from './ProductVariantSelector';
import {ProductAddOns} from './ProductAddOns';
import {ProductTabs} from './ProductTabs';

interface AddOnProduct {
  id: string;
  title: string;
  handle: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string | null;
  } | null;
  variantId?: string;
}

interface ProductInfoProps {
  product: ProductFragment;
  selectedVariant: ProductVariantFragment | null | undefined;
  productOptions: ProductOption[];
  addOnProducts: AddOnProduct[];
}

export function ProductInfo({
  product,
  selectedVariant,
  productOptions,
  addOnProducts,
}: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const isOutOfStock = !selectedVariant?.availableForSale;
  const hasCompareAtPrice =
    selectedVariant?.compareAtPrice &&
    parseFloat(selectedVariant.compareAtPrice.amount) >
      parseFloat(selectedVariant.price.amount);

  // Calculate savings percentage
  const savingsPercentage = hasCompareAtPrice
    ? Math.round(
        ((parseFloat(selectedVariant.compareAtPrice!.amount) -
          parseFloat(selectedVariant.price.amount)) /
          parseFloat(selectedVariant.compareAtPrice!.amount)) *
          100,
      )
    : 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const toggleAddOn = (variantId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId],
    );
  };

  // Build cart lines including add-ons
  const cartLines = [
    {
      merchandiseId: selectedVariant?.id ?? '',
      quantity,
    },
    ...selectedAddOns.map((variantId) => ({
      merchandiseId: variantId,
      quantity: 1,
    })),
  ].filter((line) => line.merchandiseId);

  return (
    <div className="lg:sticky lg:top-24">
      {/* Breadcrumb - Hidden on mobile */}
      <nav className="hidden lg:flex items-center gap-2 text-sm text-neutral-500 mb-4">
        <a href="/" className="hover:text-neutral-700 transition-colors">
          Home
        </a>
        <span>/</span>
        <a href="/collections/all" className="hover:text-neutral-700 transition-colors">
          Products
        </a>
        <span>/</span>
        <span className="text-neutral-800">{product.title}</span>
      </nav>

      {/* Product Title */}
      <h1 className="text-2xl lg:text-3xl font-semibold text-neutral-900 leading-tight">
        {product.title}
      </h1>

      {/* Headline/Tagline - Hardcoded for now */}
      <p className="mt-2 text-neutral-600">
        Premium solid teak wood, sustainably sourced from our Panama plantation
      </p>

      {/* Reviews Summary */}
      <ReviewSummary />

      {/* Price Section */}
      <div className="mt-6 flex items-baseline gap-3 flex-wrap">
        {selectedVariant?.price && (
          <Money
            data={selectedVariant.price}
            className="text-2xl font-semibold text-neutral-900"
          />
        )}
        {hasCompareAtPrice && selectedVariant?.compareAtPrice && (
          <>
            <Money
              data={selectedVariant.compareAtPrice}
              className="text-lg text-neutral-400 line-through"
            />
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
              Save {savingsPercentage}%
            </span>
          </>
        )}
      </div>

      {/* Affirm/Klarna - Hardcoded */}
      <p className="mt-2 text-sm text-neutral-500">
        or 4 interest-free payments of{' '}
        <span className="font-medium text-neutral-700">
          ${selectedVariant?.price ? (parseFloat(selectedVariant.price.amount) / 4).toFixed(2) : '0.00'}
        </span>{' '}
        with{' '}
        <span className="font-semibold">Klarna</span>.{' '}
        <button className="underline hover:text-neutral-700">Learn more</button>
      </p>

      {/* Stock Status */}
      <div className="mt-4">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-red-600">
            <span className="w-2 h-2 bg-red-600 rounded-full" />
            <span className="text-sm font-medium">Out of Stock</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-green-600">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">In Stock</span>
          </div>
        )}
      </div>

      {/* Variant Selector */}
      {productOptions.length > 0 && productOptions[0].values.length > 1 && (
        <div className="mt-6">
          <ProductVariantSelector
            productOptions={productOptions}
            selectedVariant={selectedVariant}
          />
        </div>
      )}

      {/* Add-ons */}
      {addOnProducts.length > 0 && (
        <div className="mt-6">
          <ProductAddOns
            addOnProducts={addOnProducts}
            selectedAddOns={selectedAddOns}
            onToggle={toggleAddOn}
          />
        </div>
      )}

      {/* Features - Hardcoded */}
      <div className="mt-6 space-y-2">
        <FeatureBadge icon={<Leaf className="w-4 h-4" />} text="Sustainably sourced teak" />
        <FeatureBadge icon={<Shield className="w-4 h-4" />} text="Water & rot resistant" />
        <FeatureBadge icon={<Truck className="w-4 h-4" />} text="Free shipping over $99" />
      </div>

      {/* Quantity & Add to Cart */}
      <div className="mt-8">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center border border-neutral-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="w-12 text-center border-x border-neutral-300 py-2 focus:outline-none"
              min="1"
              max="99"
              aria-label="Quantity"
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-2 text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50"
              disabled={quantity >= 99}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <CartForm
            route="/cart"
            action={CartForm.ACTIONS.LinesAdd}
            inputs={{lines: cartLines}}
          >
            <button
              type="submit"
              disabled={isOutOfStock || !selectedVariant}
              className="flex-1 bg-neutral-900 text-white py-3 px-8 rounded-md font-medium hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </CartForm>
        </div>

        {/* Selected add-ons summary */}
        {selectedAddOns.length > 0 && (
          <p className="mt-2 text-sm text-neutral-500">
            + {selectedAddOns.length} add-on{selectedAddOns.length > 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* Product Tabs */}
      <div className="mt-10 border-t border-neutral-200 pt-8">
        <ProductTabs product={product} />
      </div>
    </div>
  );
}

/**
 * Review Summary Component - Hardcoded for Judge.me integration
 */
function ReviewSummary() {
  // Hardcoded - will be replaced with Judge.me integration
  const rating = 4.8;
  const reviewCount = 47;

  return (
    <a
      href="#reviews"
      className="mt-3 inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : star - 0.5 <= rating
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'fill-neutral-200 text-neutral-200'
            }`}
          />
        ))}
      </div>
      <span className="font-medium text-neutral-800">{rating}</span>
      <span className="text-neutral-500">({reviewCount} reviews)</span>
    </a>
  );
}

/**
 * Feature Badge Component
 */
function FeatureBadge({icon, text}: {icon: React.ReactNode; text: string}) {
  return (
    <div className="flex items-center gap-2 text-sm text-neutral-600">
      <span className="text-green-600">{icon}</span>
      <span>{text}</span>
    </div>
  );
}