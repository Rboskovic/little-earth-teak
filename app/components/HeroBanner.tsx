import {Link} from 'react-router';

interface HeroBannerProps {
  desktopVideoUrl: string;
  mobileVideoUrl: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
}

export function HeroBanner({
  desktopVideoUrl,
  mobileVideoUrl,
  headline,
  subheadline,
  ctaText,
  ctaLink,
}: HeroBannerProps) {
  return (
    <section className="hero-banner">
      {/* Video Background - Desktop */}
      <video
        className="hero-video hero-video-desktop"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src={desktopVideoUrl} type="video/mp4" />
      </video>

      {/* Video Background - Mobile */}
      <video
        className="hero-video hero-video-mobile"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src={mobileVideoUrl} type="video/mp4" />
      </video>

      {/* Content Overlay */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-headline">{headline}</h1>
          <p className="hero-subheadline">{subheadline}</p>
          <Link to={ctaLink} className="hero-cta" prefetch="intent">
            {ctaText}
          </Link>
        </div>
      </div>
    </section>
  );
}