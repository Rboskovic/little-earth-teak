/**
 * CollectionHero Component
 * 
 * Displays hero banner with image and text overlay for collection pages.
 * 
 * TODO: Convert to metaobjects in future
 * Currently hardcoded for Outdoor collection. In future, this should pull:
 * - Hero images (desktop/mobile) from collection metafields
 * - Headline and body text from collection metafields
 * - Allow per-collection customization via Shopify admin
 */

interface CollectionHeroProps {
  title: string;
  // Future: these will come from metafields
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  headline?: string;
  bodyText?: string;
}

export function CollectionHero({
  title,
  desktopImageUrl,
  mobileImageUrl,
  headline,
  bodyText,
}: CollectionHeroProps) {
  // TODO: Replace with metafield values from collection
  // Hardcoded hero images - should be converted to metaobjects in future
  const defaultDesktopImage = 'https://cdn.shopify.com/s/files/1/0975/7854/9565/files/Outdoor-furniture-hero.png?v=1767865930';
  const defaultMobileImage = 'https://cdn.shopify.com/s/files/1/0975/7854/9565/files/Outdoor-furniture-hero-mobile.png?v=1767866111';
  const defaultHeadline = 'Elevate Your Outdoors into a Natural Sanctuary.';
  const defaultBodyText = 'Transform your patio into a serene retreat with the timeless elegance of solid teak. Handcrafted in Panama, our lounge collection blends minimalist design with the robust warmth of tropical hardwood. Unwind in luxury designed to last a lifetime.';

  const desktopImage = desktopImageUrl || defaultDesktopImage;
  const mobileImage = mobileImageUrl || defaultMobileImage;
  const heroHeadline = headline || defaultHeadline;
  const heroBodyText = bodyText || defaultBodyText;

  return (
    <section className="collection-hero">
      {/* Desktop Image */}
      <img
        src={desktopImage}
        alt={title}
        className="collection-hero-image collection-hero-image-desktop"
        loading="eager"
      />

      {/* Mobile Image */}
      <img
        src={mobileImage}
        alt={title}
        className="collection-hero-image collection-hero-image-mobile"
        loading="eager"
      />

      {/* Text Overlay */}
      <div className="collection-hero-content">
        <div className="collection-hero-text">
          <h1 className="collection-hero-headline">{heroHeadline}</h1>
          <p className="collection-hero-body">{heroBodyText}</p>
        </div>
      </div>
    </section>
  );
}