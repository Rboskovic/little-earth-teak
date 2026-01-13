import {Link} from 'react-router';
import type {ProductOption} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';

interface ProductVariantSelectorProps {
  productOptions: ProductOption[];
  selectedVariant: ProductVariantFragment | null | undefined;
}

export function ProductVariantSelector({
  productOptions,
  selectedVariant,
}: ProductVariantSelectorProps) {
  return (
    <div className="space-y-6">
      {productOptions.map((option) => (
        <div key={option.name}>
          {/* Option Label */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-neutral-900">
              {option.name}:{' '}
              <span className="font-normal text-neutral-600">
                {option.values.find((v) => v.isActive)?.value || 'Select'}
              </span>
            </span>
            {option.name.toLowerCase() === 'size' && (
              <button className="text-sm text-neutral-500 underline hover:text-neutral-700 transition-colors">
                Size Guide
              </button>
            )}
          </div>

          {/* Option Values */}
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isActive = value.isActive;
              const isAvailable = value.isAvailable;
              const variant = value.variant;

              // If variant exists, create link to that variant
              const optionUrl = variant
                ? `/products/${variant.product.handle}?${new URLSearchParams(
                    variant.selectedOptions.map((opt) => [opt.name, opt.value]),
                  ).toString()}`
                : '#';

              // Check if this is a color option with swatch
              const swatch = value.swatch;
              const isColorOption =
                option.name.toLowerCase() === 'color' && swatch;

              if (isColorOption) {
                return (
                  <Link
                    key={value.value}
                    to={optionUrl}
                    preventScrollReset
                    prefetch="intent"
                    replace
                    className={`
                      relative w-10 h-10 rounded-full border-2 transition-all
                      ${isActive ? 'border-neutral-900 ring-2 ring-neutral-900 ring-offset-2' : 'border-neutral-200 hover:border-neutral-400'}
                      ${!isAvailable ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={{
                      backgroundColor: swatch.color || undefined,
                      backgroundImage: swatch.image?.previewImage?.url
                        ? `url(${swatch.image.previewImage.url})`
                        : undefined,
                      backgroundSize: 'cover',
                    }}
                    aria-label={`${option.name}: ${value.value}${!isAvailable ? ' (unavailable)' : ''}`}
                    aria-disabled={!isAvailable}
                    onClick={(e) => !isAvailable && e.preventDefault()}
                  >
                    {/* Unavailable indicator */}
                    {!isAvailable && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-full h-0.5 bg-neutral-400 rotate-45 absolute" />
                      </span>
                    )}
                  </Link>
                );
              }

              // Default button style for size and other options
              return (
                <Link
                  key={value.value}
                  to={optionUrl}
                  preventScrollReset
                  prefetch="intent"
                  replace
                  className={`
                    px-4 py-2 rounded-md border text-sm font-medium transition-all
                    ${
                      isActive
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400'
                    }
                    ${!isAvailable ? 'opacity-40 cursor-not-allowed line-through' : 'cursor-pointer'}
                  `}
                  aria-label={`${option.name}: ${value.value}${!isAvailable ? ' (unavailable)' : ''}`}
                  aria-disabled={!isAvailable}
                  aria-pressed={isActive}
                  onClick={(e) => !isAvailable && e.preventDefault()}
                >
                  {value.value}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}