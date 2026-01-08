/**
 * CollectionConfigurator Component
 * 
 * Displays a configurator section with text content and video animation.
 * Layout: 2 columns on desktop (text left, video right), stacked on mobile (text first, video below)
 * 
 * Used on collection pages to showcase customization options.
 */

interface CollectionConfiguratorProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  videoUrl: string;
}

export function CollectionConfigurator({
  title,
  description,
  ctaText,
  ctaLink,
  videoUrl,
}: CollectionConfiguratorProps) {
  return (
    <section className="collection-configurator">
      <div className="collection-configurator-container">
        {/* Text Content - Left on desktop, top on mobile */}
        <div className="collection-configurator-content">
          <h2 className="collection-configurator-title">{title}</h2>
          <p className="collection-configurator-description">{description}</p>
          <a href={ctaLink} className="collection-configurator-cta">
            {ctaText}
          </a>
        </div>

        {/* Video Animation - Right on desktop, bottom on mobile */}
        <div className="collection-configurator-video-wrapper">
          <video
            className="collection-configurator-video"
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  );
}