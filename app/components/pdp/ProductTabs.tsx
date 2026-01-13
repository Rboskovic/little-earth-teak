import {useState} from 'react';
import type {ProductFragment} from 'storefrontapi.generated';

interface ProductTabsProps {
  product: ProductFragment;
}

type TabId = 'description' | 'material' | 'warranty';

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  {id: 'description', label: 'Description'},
  {id: 'material', label: 'Materials'},
  {id: 'warranty', label: 'Warranty'},
];

export function ProductTabs({product}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('description');

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex border-b border-neutral-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 text-sm font-medium transition-colors relative
              ${
                activeTab === tab.id
                  ? 'text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-700'
              }
            `}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'description' && (
          <DescriptionTab descriptionHtml={product.descriptionHtml} />
        )}
        {activeTab === 'material' && <MaterialTab />}
        {activeTab === 'warranty' && <WarrantyTab />}
      </div>
    </div>
  );
}

/**
 * Description Tab - Uses real product description
 */
function DescriptionTab({descriptionHtml}: {descriptionHtml: string}) {
  if (!descriptionHtml) {
    return (
      <p className="text-neutral-600 text-sm leading-relaxed">
        Crafted from sustainably harvested teak wood from our 25-year-old
        plantation in Panama's Darién Province. Each piece showcases the natural
        beauty of Grade A teak with its distinctive golden-brown color and
        elegant grain patterns. Our vertical integration from plantation to
        finished product ensures the highest quality standards.
      </p>
    );
  }

  return (
    <div
      className="prose prose-sm prose-neutral max-w-none"
      dangerouslySetInnerHTML={{__html: descriptionHtml}}
    />
  );
}

/**
 * Material Tab - Hardcoded teak properties
 */
function MaterialTab() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">
          Premium Teak Wood
        </h4>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Our products are crafted from Grade A teak (Tectona grandis), renowned
          as one of the world's most durable and beautiful hardwoods. Harvested
          from our sustainably managed plantation in Panama, each piece contains
          the natural oils that make teak exceptionally resistant to water,
          decay, and insects.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="bg-neutral-50 p-3 rounded-lg">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Hardness
          </p>
          <p className="text-sm font-medium text-neutral-900">
            1,070 lbf (Janka)
          </p>
        </div>
        <div className="bg-neutral-50 p-3 rounded-lg">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Density
          </p>
          <p className="text-sm font-medium text-neutral-900">
            40 lbs/ft³
          </p>
        </div>
        <div className="bg-neutral-50 p-3 rounded-lg">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Oil Content
          </p>
          <p className="text-sm font-medium text-neutral-900">
            Naturally High
          </p>
        </div>
        <div className="bg-neutral-50 p-3 rounded-lg">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Origin
          </p>
          <p className="text-sm font-medium text-neutral-900">
            Panama
          </p>
        </div>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">
          Natural Properties
        </h4>
        <ul className="text-sm text-neutral-600 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Water resistant – ideal for bathrooms, kitchens, and outdoor use</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Naturally antibacterial surface</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Resistant to warping, cracking, and decay</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-0.5">•</span>
            <span>Develops beautiful silver patina if left untreated outdoors</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Warranty Tab - Hardcoded warranty information
 */
function WarrantyTab() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">
          Our Commitment to Quality
        </h4>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Every Little Earth Teak product is backed by our comprehensive
          warranty, reflecting our confidence in the craftsmanship and materials
          we use. We stand behind every piece that leaves our workshop.
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">5</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              5-Year Structural Warranty
            </p>
            <p className="text-xs text-neutral-600 mt-0.5">
              Covers defects in materials and workmanship under normal use
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg">
          <div className="flex-shrink-0 w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">30</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              30-Day Satisfaction Guarantee
            </p>
            <p className="text-xs text-neutral-600 mt-0.5">
              Return for a full refund if you're not completely satisfied
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <h4 className="text-sm font-semibold text-neutral-900 mb-2">
          Warranty Exclusions
        </h4>
        <ul className="text-xs text-neutral-500 space-y-1">
          <li>• Normal weathering and color changes (natural aging process)</li>
          <li>• Damage from improper use or accidents</li>
          <li>• Commercial or rental use (residential use only)</li>
        </ul>
      </div>
    </div>
  );
}