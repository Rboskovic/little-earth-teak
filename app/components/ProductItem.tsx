import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;

  // TODO: Replace with actual product metafields/tags when available
  // Fallback badges based on product tags
  const tags = 'tags' in product ? product.tags : [];
  const isNew = tags.includes('new') || tags.includes('NEW');
  const isBestSeller = tags.includes('best-seller') || tags.includes('BEST SELLER');

  // TODO: Connect to actual review app (Yotpo, Judge.me, etc.)
  // Hardcoded fallback star rating
  const rating = 4.5;
  const reviewCount = 148;

  // TODO: Get color variants from product metafields
  // Extract unique color variants from product
  const colorVariants = 'variants' in product && product.variants 
    ? product.variants.nodes
        .filter((variant) => 
          variant.selectedOptions.some((option) => 
            option.name.toLowerCase() === 'color'
          )
        )
        .map((variant) => {
          const colorOption = variant.selectedOptions.find(
            (opt) => opt.name.toLowerCase() === 'color'
          );
          return {
            id: variant.id,
            value: colorOption?.value || '',
          };
        })
        // Remove duplicates
        .filter((variant, index, self) => 
          index === self.findIndex((v) => v.value === variant.value)
        )
        .slice(0, 5) // Show max 5 colors
    : [];

  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {/* Product Image Container - FIXED: Enforces square aspect ratio */}
      <div className="product-item-image-container">
        {/* Badges */}
        {(isNew || isBestSeller) && (
          <div className="product-badges">
            {isNew && <span className="product-badge product-badge-new">NEW</span>}
            {isBestSeller && <span className="product-badge product-badge-bestseller">BEST SELLER</span>}
          </div>
        )}

        {/* Product Image - Forced to square */}
        <div className="product-item-image-wrapper">
          {image ? (
            <Image
              alt={image.altText || product.title}
              aspectRatio="1/1"
              data={image}
              loading={loading}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="product-item-image"
            />
          ) : (
            <div className="product-item-image-placeholder">
              <span className="product-item-no-image-text">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-item-info">
        {/* Product Title */}
        <h4 className="product-item-title">{product.title}</h4>

        {/* Star Rating - TODO: Connect to review app */}
        <div className="product-rating">
          <div className="product-stars">
            {[...Array(5)].map((_, index) => {
              const fillPercentage = Math.min(Math.max((rating - index) * 100, 0), 100);
              
              return (
                <span key={index} className="product-star-wrapper">
                  <span className="product-star-empty">★</span>
                  <span 
                    className="product-star-filled" 
                    style={{width: `${fillPercentage}%`}}
                  >
                    ★
                  </span>
                </span>
              );
            })}
          </div>
          <span className="product-rating-text">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Color Variant Swatches */}
        {colorVariants.length > 0 && (
          <div className="product-color-swatches">
            {colorVariants.map((variant) => {
              const colorValue = variant.value.toLowerCase();
              
              return (
                <div
                  key={variant.id}
                  className="product-color-swatch"
                  style={{
                    backgroundColor: getColorHex(colorValue),
                  }}
                  title={variant.value}
                />
              );
            })}
          </div>
        )}

        {/* Price */}
        <div className="product-item-price">
          <Money data={product.priceRange.minVariantPrice} />
        </div>
      </div>
    </Link>
  );
}

/**
 * TODO: Replace with actual color swatch images from metafields
 * Fallback function to convert color names to hex values
 */
function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#FFFFFF',
    grey: '#808080',
    gray: '#808080',
    red: '#DC2626',
    blue: '#2563EB',
    green: '#16A34A',
    yellow: '#EAB308',
    orange: '#EA580C',
    purple: '#9333EA',
    pink: '#EC4899',
    brown: '#92400E',
    beige: '#D4C5B9',
    cream: '#FFFDD0',
    navy: '#000080',
    tan: '#D2B48C',
    olive: '#556B2F',
    natural: '#D2B48C',
    teak: '#B8860B',
  };

  return colorMap[colorName] || '#E5E7EB'; // Default to light grey
}