import {useState, useEffect} from 'react';
import {Money, CartForm} from '@shopify/hydrogen';
import type {ProductFragment, ProductVariantFragment} from 'storefrontapi.generated';
import {ShoppingCart} from 'lucide-react';

interface MobileFloatingCartProps {
  selectedVariant: ProductVariantFragment | null | undefined;
  product: ProductFragment;
}

export function MobileFloatingCart({selectedVariant, product}: MobileFloatingCartProps) {
  const [isVisible, setIsVisible] = useState(false);

  const isOutOfStock = !selectedVariant?.availableForSale;

  // Show floating cart after scrolling past the main Add to Cart button
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px (roughly past the product info section)
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render on desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return null;
  }

  const cartLines = selectedVariant?.id
    ? [{merchandiseId: selectedVariant.id, quantity: 1}]
    : [];

  return (
    <div
      className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-40 
        transform transition-transform duration-300 ease-out
        ${isVisible ? 'translate-y-0' : 'translate-y-full'}
      `}
    >
      {/* Safe area padding for notched phones */}
      <div 
        className="bg-white border-t border-neutral-200 shadow-lg"
        style={{paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))'}}
      >
        <div className="px-4 py-3 flex items-center gap-4">
          {/* Price */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-500 truncate">{product.title}</p>
            {selectedVariant?.price && (
              <Money
                data={selectedVariant.price}
                className="text-lg font-semibold text-neutral-900"
              />
            )}
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
              className="
                flex items-center gap-2 
                bg-neutral-900 text-white 
                py-3 px-6 rounded-lg 
                font-medium text-sm
                hover:bg-neutral-800 active:bg-neutral-700
                transition-colors 
                disabled:bg-neutral-300 disabled:cursor-not-allowed
              "
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </CartForm>
        </div>
      </div>
    </div>
  );
}