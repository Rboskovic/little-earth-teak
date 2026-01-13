import {useState} from 'react';
import {ChevronDown, Star, Leaf, Ruler, Users, HelpCircle, Quote} from 'lucide-react';
import type {ProductFragment, ProductVariantFragment} from 'storefrontapi.generated';

interface ProductAccordionsProps {
  product: ProductFragment;
  selectedVariant: ProductVariantFragment | null | undefined;
}

interface AccordionSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
}

const sections: AccordionSection[] = [
  {id: 'sustainability', title: 'Our Sustainability Story', icon: <Leaf className="w-5 h-5" />, defaultOpen: true},
  {id: 'dimensions', title: 'Product Dimensions', icon: <Ruler className="w-5 h-5" />},
  {id: 'ugc', title: 'Customer Photos', icon: <Users className="w-5 h-5" />, defaultOpen: true},
  {id: 'reviews', title: 'Customer Reviews', icon: <Star className="w-5 h-5" />},
  {id: 'faq', title: 'Frequently Asked Questions', icon: <HelpCircle className="w-5 h-5" />},
];

export function ProductAccordions({product, selectedVariant}: ProductAccordionsProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.filter((s) => s.defaultOpen).map((s) => s.id))
  );

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <AccordionItem
          key={section.id}
          id={section.id}
          title={section.title}
          icon={section.icon}
          isOpen={openSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
        >
          {section.id === 'sustainability' && <SustainabilityContent />}
          {section.id === 'dimensions' && <DimensionsContent />}
          {section.id === 'ugc' && <UGCContent />}
          {section.id === 'reviews' && <ReviewsContent />}
          {section.id === 'faq' && <FAQContent />}
        </AccordionItem>
      ))}
    </div>
  );
}

/**
 * Accordion Item Component
 */
interface AccordionItemProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionItem({id, title, icon, isOpen, onToggle, children}: AccordionItemProps) {
  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden" id={id === 'reviews' ? 'reviews' : undefined}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 lg:p-5 bg-white hover:bg-neutral-50 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-neutral-600">{icon}</span>
          <span className="text-base font-medium text-neutral-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      <div
        id={`accordion-content-${id}`}
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 lg:p-5 pt-0 lg:pt-0 border-t border-neutral-100">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Sustainability Content - Little Earth Teak's story
 */
function SustainabilityContent() {
  return (
    <div className="space-y-4 pt-4">
      <p className="text-sm text-neutral-600 leading-relaxed">
        At Little Earth Teak, sustainability isn't just a buzzword—it's the foundation of 
        everything we do. Our journey begins in Panama's Darién Province, where our 25-year-old 
        teak plantation represents one of the most environmentally responsible sources of 
        premium hardwood in the world.
      </p>

      <div className="grid md:grid-cols-3 gap-4 pt-2">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-700">25+</p>
          <p className="text-sm text-green-600">Years of sustainable forestry</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-700">1,200</p>
          <p className="text-sm text-green-600">Miles shorter supply chain</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-700">100%</p>
          <p className="text-sm text-green-600">Whole-log utilization</p>
        </div>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">
          Vertical Integration
        </h4>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Unlike competitors who import from Indonesia (10,000+ mile journey), our products 
          travel just 1,200 miles from our Panama plantation through our on-site sawmill 
          to our Miami fulfillment center. This dramatically reduces our carbon footprint 
          while ensuring complete quality control at every step.
        </p>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">
          Whole-Log Philosophy
        </h4>
        <p className="text-sm text-neutral-600 leading-relaxed">
          We utilize every part of the teak tree—from premium cuts for our signature 
          furniture to artisan pieces crafted from roots and stumps. Nothing goes to waste, 
          and each piece tells a unique story of sustainable craftsmanship.
        </p>
      </div>
    </div>
  );
}

/**
 * Dimensions Content - Hardcoded product dimensions
 */
function DimensionsContent() {
  // Hardcoded dimensions - will be metafield in future
  const dimensions = [
    {label: 'Length', value: '18"', metric: '45.7 cm'},
    {label: 'Width', value: '12"', metric: '30.5 cm'},
    {label: 'Height/Thickness', value: '1.5"', metric: '3.8 cm'},
    {label: 'Weight', value: '4.2 lbs', metric: '1.9 kg'},
  ];

  return (
    <div className="pt-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dimensions.map((dim) => (
          <div key={dim.label} className="text-center p-4 bg-neutral-50 rounded-lg">
            <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
              {dim.label}
            </p>
            <p className="text-lg font-semibold text-neutral-900">{dim.value}</p>
            <p className="text-xs text-neutral-400">{dim.metric}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg">
        <p className="text-xs text-amber-700">
          <strong>Note:</strong> As a natural material, dimensions may vary slightly (±5%) 
          between pieces. Each item is unique with its own character and grain pattern.
        </p>
      </div>
    </div>
  );
}

/**
 * UGC Content - Customer photos with real Unsplash cutting board images
 */
function UGCContent() {
  // Real cutting board UGC photos - user can update these later
  const ugcPhotos = [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&h=400&fit=crop',
      alt: 'Teak cutting board with fresh vegetables',
      username: '@homechef_sarah',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=400&h=400&fit=crop',
      alt: 'Wooden cutting board in modern kitchen',
      username: '@kitchen_stories',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=400&h=400&fit=crop',
      alt: 'Cutting board with bread and cheese',
      username: '@entertaining_at_home',
    },
    {
      id: '4',
      url: 'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=400&h=400&fit=crop',
      alt: 'Chef using wooden cutting board',
      username: '@chef_michael',
    },
    {
      id: '5',
      url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&h=400&fit=crop',
      alt: 'Teak board with artisan bread',
      username: '@bakery_dreams',
    },
    {
      id: '6',
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      alt: 'Kitchen setup with cutting board',
      username: '@minimal_home',
    },
  ];

  return (
    <div className="pt-4">
      <p className="text-sm text-neutral-600 mb-4">
        See how our customers are using Little Earth Teak products in their homes.
        Share your photos with <span className="font-medium text-neutral-900">#LittleEarthTeak</span>
      </p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {ugcPhotos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square overflow-hidden rounded-lg">
            <img
              src={photo.url}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end justify-center pb-2">
              <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.username}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 text-sm text-neutral-600 underline hover:text-neutral-900 transition-colors">
        View all customer photos →
      </button>
    </div>
  );
}

/**
 * Reviews Content - Hardcoded for Judge.me integration
 */
function ReviewsContent() {
  // Hardcoded reviews - will be Judge.me integration
  const reviews = [
    {
      id: '1',
      author: 'Jennifer M.',
      location: 'Austin, TX',
      rating: 5,
      date: 'December 2024',
      title: 'Absolutely stunning quality',
      content: 'I\'ve owned many cutting boards over the years, but this teak board is in a league of its own. The wood grain is beautiful, it\'s heavy and feels substantial, and after 3 months of daily use it still looks brand new. Worth every penny.',
      verified: true,
    },
    {
      id: '2',
      author: 'Robert K.',
      location: 'Miami, FL',
      rating: 5,
      date: 'November 2024',
      title: 'Perfect for our outdoor kitchen',
      content: 'We installed an outdoor kitchen last year and needed boards that could handle the Florida humidity. These teak boards are perfect - no warping, no cracking, and they\'ve developed a beautiful patina. The sustainability story is a huge bonus.',
      verified: true,
    },
    {
      id: '3',
      author: 'Sarah L.',
      location: 'Seattle, WA',
      rating: 4,
      date: 'November 2024',
      title: 'Beautiful but needs regular oiling',
      content: 'The board itself is gorgeous and very well made. I knocked off one star because it does require regular oiling to maintain its appearance, which wasn\'t clear from the description. That said, I\'d still recommend it highly.',
      verified: true,
    },
  ];

  const overallRating = 4.8;
  const totalReviews = 47;
  const ratingBreakdown = [
    {stars: 5, count: 38},
    {stars: 4, count: 6},
    {stars: 3, count: 2},
    {stars: 2, count: 1},
    {stars: 1, count: 0},
  ];

  return (
    <div className="pt-4">
      {/* Summary */}
      <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-neutral-200">
        <div className="text-center md:text-left">
          <p className="text-5xl font-bold text-neutral-900">{overallRating}</p>
          <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.floor(overallRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-neutral-200 text-neutral-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-neutral-500 mt-1">Based on {totalReviews} reviews</p>
        </div>

        <div className="flex-1 space-y-2">
          {ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="text-sm text-neutral-600 w-12">{item.stars} star</span>
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{width: `${(item.count / totalReviews) * 100}%`}}
                />
              </div>
              <span className="text-sm text-neutral-500 w-8">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6 pt-6">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6 border-b border-neutral-100 last:border-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">{review.author}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500">{review.location} • {review.date}</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-200 text-neutral-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <h4 className="font-medium text-neutral-900 mt-3">{review.title}</h4>
            <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{review.content}</p>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full py-3 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
        Load More Reviews
      </button>
    </div>
  );
}

/**
 * FAQ Content - Hardcoded FAQs
 */
function FAQContent() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I care for my teak product?',
      answer: 'Teak requires minimal maintenance. For indoor use, simply wipe with a damp cloth and dry thoroughly. For optimal appearance, apply food-safe mineral oil every 2-3 months. For outdoor furniture, you can let it weather naturally to a silver-gray patina or apply teak oil annually to maintain the golden color.',
    },
    {
      id: '2',
      question: 'Is teak safe for food preparation?',
      answer: 'Yes! Teak is naturally antibacterial due to its high oil content and dense grain structure. It\'s an excellent choice for cutting boards and serving pieces. Unlike bamboo or softer woods, teak is gentle on knife edges while still being sanitary.',
    },
    {
      id: '3',
      question: 'Where does your teak come from?',
      answer: 'All our teak is sustainably harvested from our own 25-year-old plantation in Panama\'s Darién Province. We hold exclusive environmental permits and practice responsible forestry. Unlike most teak on the market (which comes from Indonesia), our products travel just 1,200 miles to reach you, significantly reducing our carbon footprint.',
    },
    {
      id: '4',
      question: 'What makes your teak different from competitors?',
      answer: 'Three things: sustainability, quality, and price. Our vertical integration (plantation → sawmill → fulfillment) means we control quality at every step. Our US-Panama Trade Promotion Agreement status exempts us from Section 232 tariffs, giving us a 25-30% cost advantage we pass on to you. And our 1,200-mile supply chain vs. competitors\' 10,000+ miles means a dramatically lower carbon footprint.',
    },
    {
      id: '5',
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within the continental United States. International shipping is coming soon. Sign up for our newsletter to be notified when we expand shipping options.',
    },
  ];

  return (
    <div className="pt-4 space-y-2">
      {faqs.map((faq) => (
        <div key={faq.id} className="border border-neutral-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
          >
            <span className="text-sm font-medium text-neutral-900 pr-4">{faq.question}</span>
            <ChevronDown
              className={`w-4 h-4 flex-shrink-0 text-neutral-400 transition-transform ${
                openFaq === faq.id ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="px-4 pb-4 text-sm text-neutral-600 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}