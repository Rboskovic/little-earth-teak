import {Image, Money} from '@shopify/hydrogen';
import {Check} from 'lucide-react';

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

interface ProductAddOnsProps {
  addOnProducts: AddOnProduct[];
  selectedAddOns: string[];
  onToggle: (variantId: string) => void;
}

export function ProductAddOns({
  addOnProducts,
  selectedAddOns,
  onToggle,
}: ProductAddOnsProps) {
  if (addOnProducts.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-neutral-900">
        Complete your purchase
      </h3>

      <div className="space-y-2">
        {addOnProducts.map((addOn) => {
          const isSelected = addOn.variantId
            ? selectedAddOns.includes(addOn.variantId)
            : false;

          return (
            <button
              key={addOn.id}
              onClick={() => addOn.variantId && onToggle(addOn.variantId)}
              disabled={!addOn.variantId}
              className={`
                w-full flex items-center gap-4 p-3 rounded-lg border transition-all text-left
                ${
                  isSelected
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white'
                }
                ${!addOn.variantId ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Checkbox */}
              <div
                className={`
                  flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                  ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900'
                      : 'border-neutral-300 bg-white'
                  }
                `}
              >
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </div>

              {/* Product Image */}
              {addOn.image && (
                <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-neutral-100">
                  <img
                    src={addOn.image.url}
                    alt={addOn.image.altText || addOn.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {addOn.title}
                </p>
                <p className="text-xs text-neutral-500">
                  Add this item to your cart
                </p>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <span className="text-sm font-medium text-neutral-700">
                  +${parseFloat(addOn.price.amount).toFixed(2)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}