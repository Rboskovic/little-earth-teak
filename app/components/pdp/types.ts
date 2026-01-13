/**
 * PDP Component Types
 *
 * Custom type definitions for the Product Detail Page components.
 * These extend the generated Storefront API types.
 */

import type {
  Product,
  ProductVariant,
  Image,
  MoneyV2,
} from '@shopify/hydrogen/storefront-api-types';

/**
 * Product with add-on metafield reference
 */
export interface ProductWithAddOns extends Omit<Product, 'addOns'> {
  addOns?: {
    references?: {
      nodes: AddOnProductReference[];
    };
  } | null;
}

/**
 * Add-on product reference from metafield
 */
export interface AddOnProductReference {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  } | null;
  priceRange: {
    minVariantPrice: MoneyV2;
  };
  variants?: {
    nodes: Array<{
      id: string;
    }>;
  };
}

/**
 * Parsed add-on product for components
 */
export interface ParsedAddOnProduct {
  id: string;
  title: string;
  handle: string;
  price: MoneyV2;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
  variantId?: string;
}

/**
 * Product image for gallery
 */
export interface ProductGalleryImage {
  id: string;
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

/**
 * Review data structure (for Judge.me integration)
 */
export interface ProductReview {
  id: string;
  author: string;
  location?: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  images?: string[];
}

/**
 * Review summary statistics
 */
export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    stars: number;
    count: number;
  }[];
}

/**
 * FAQ item structure
 */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * UGC (User Generated Content) photo
 */
export interface UGCPhoto {
  id: string;
  url: string;
  alt: string;
  username: string;
}