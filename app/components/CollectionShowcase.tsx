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
        <h2 className="text-[32px] leading-[36px] font-semibold text-[#1a1a1a] mb-8">
          Shop Bathroom Essentials
        </h2>

        {/* Desktop Grid - 3 columns */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {featuredCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>

        {/* Mobile - Horizontal scroll */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-4">
            {featuredCollections.map((collection) => (
              <div key={collection.id} className="w-[280px] flex-shrink-0">
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

  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="group block rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-[#3d5a4d]"
    >
      {/* Image Section - 4:3 aspect ratio */}
      <div className="relative overflow-hidden w-full aspect-[4/3] bg-[#e9ecef]">
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
      <div className="p-6 min-h-[240px] flex flex-col">
        {/* Headline */}
        <h3 className="text-[22px] leading-[28px] font-semibold text-white mb-3">
          {content.headline}
        </h3>

        {/* Description as bullet points */}
        <ul className="text-gray-300 mb-3 flex-1 space-y-1.5 pl-0 m-0">
          {content.description.split(';').map((item, index) => (
            <li
              key={index}
              className="text-[15px] leading-5 pl-[18px] relative"
            >
              <span className="absolute left-0 top-0">•</span>
              {item.trim()}
            </li>
          ))}
        </ul>

        {/* Explore Collection Button */}
        <button
          className="inline-block self-start mt-auto border-2 border-white text-white font-medium text-base py-2.5 px-8 rounded-full hover:bg-white hover:text-black transition-all duration-200"
          type="button"
        >
          Explore Collection
        </button>
      </div>
    </Link>
  );
}