import {Link} from 'react-router';

interface Collection {
  id: string;
  title: string;
  handle: string;
  image?: {
    url: string;
    altText?: string;
  } | null;
}

interface CollectionShowcaseProps {
  collections: Collection[];
}

// Hardcoded content for each collection
const COLLECTION_CONTENT = {
  'shower-bench': {
    headline: 'Premium Shower Benches',
    description: 'Naturally water-resistant;Slip-resistant surface;Built to last decades',
  },
  'teak-bath-mat': {
    headline: 'Luxury Bath Mats',
    description: 'Quick-drying natural teak;Anti-slip rubber feet;Spa-quality finish',
  },
  'storage-accessories': {
    headline: 'Bathroom Storage',
    description: 'Space-saving designs;Moisture-resistant;Modern aesthetic',
  },
};

export function CollectionShowcase({collections}: CollectionShowcaseProps) {
  // Filter to only show our 3 target collections
  const targetHandles = ['shower-bench', 'teak-bath-mat', 'storage-accessories'];
  const featuredCollections = collections.filter((col) =>
    targetHandles.includes(col.handle),
  );

  if (featuredCollections.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <h2
          className="text-black font-semibold mb-8"
          style={{
            fontSize: '32px',
            fontWeight: 600,
            lineHeight: '36px',
            color: '#1a1a1a',
          }}
        >
          Shop Bathroom Essentials
        </h2>

        {/* Desktop Grid - 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {featuredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>

        {/* Mobile - Horizontal scroll */}
        <div className="md:hidden overflow-x-auto pb-4">
          <div className="flex gap-4" style={{width: 'max-content'}}>
            {featuredCollections.map((collection) => (
              <div key={collection.id} style={{width: '280px', flexShrink: 0}}>
                <CollectionCard collection={collection} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionCard({collection}: {collection: Collection}) {
  const content = COLLECTION_CONTENT[collection.handle as keyof typeof COLLECTION_CONTENT];

  if (!content) return null;

  const backgroundColor = '#3d5a4d'; // Earthy green matching hero

  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {/* Image Section - 4:3 aspect ratio */}
      <div
        className="relative overflow-hidden"
        style={{
          width: '100%',
          aspectRatio: '4/3',
          backgroundColor: '#e9ecef',
        }}
      >
        {collection.image ? (
          <img
            src={collection.image.url}
            alt={collection.image.altText || collection.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Text Section */}
      <div
        style={{
          padding: '24px',
          minHeight: '240px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Headline */}
        <h3
          className="text-white font-semibold"
          style={{
            fontSize: '22px',
            fontWeight: 600,
            lineHeight: '28px',
            marginBottom: '12px',
          }}
        >
          {content.headline}
        </h3>

        {/* Description as bullet points */}
        <ul
          className="text-gray-300"
          style={{
            paddingLeft: '0',
            margin: 0,
            marginBottom: '12px',
            flex: 1,
          }}
        >
          {content.description.split(';').map((item, index) => (
            <li
              key={index}
              style={{
                fontSize: '15px',
                lineHeight: '20px',
                marginBottom: '6px',
                paddingLeft: '18px',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                }}
              >
                •
              </span>
              {item.trim()}
            </li>
          ))}
        </ul>

        {/* Explore Collection Button */}
        <button
          className="inline-block border-2 border-white text-white font-medium py-2.5 px-8 rounded-full hover:bg-white hover:text-black transition-all duration-200"
          style={{
            fontSize: '16px',
            fontWeight: 500,
            alignSelf: 'flex-start',
            marginTop: 'auto',
          }}
        >
          Explore Collection
        </button>
      </div>
    </Link>
  );
}