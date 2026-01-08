import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics, Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import {CollectionHero} from '~/components/CollectionHero';
import {CollectionConfigurator} from '~/components/CollectionConfigurator';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {Link} from 'react-router';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  
  // Fetch first page with more products to allow for configurator insertion
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12, // Get more products for initial load
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  
  // Split products: first 4, then configurator, then rest
  const products = collection.products.nodes;
  const firstFourProducts = products.slice(0, 4);
  const remainingProducts = products.slice(4);
  const hasMorePages = collection.products.pageInfo.hasNextPage;

  return (
    <div className="collection">
      {/* Hero Banner with image and text overlay */}
      <CollectionHero title={collection.title} />

      {/* Product Grid Container */}
      <div className="collection-products-container">
        {/* First 4 Products */}
        <div className="collection-products-grid">
          {firstFourProducts.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              loading={index < 4 ? 'eager' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Configurator Section - After first 4 products */}
      <CollectionConfigurator
        title="Custom options for all spaces"
        description="Configure your own setup from our best selling teak outdoor lounge sectional, the Haven Collection. Our modular system mean you can easily customize the shape, size, color and style of your furniture to fit your space."
        ctaText="Start customizing"
        ctaLink="/pages/configurator" // Update this to your actual configurator page
        videoUrl="https://cdn.shopify.com/videos/c/o/v/06b6a329af254303bb9fa2d02ae76e87.mp4"
      />

      {/* Remaining Products */}
      {remainingProducts.length > 0 && (
        <div className="collection-products-container">
          <div className="collection-products-grid">
            {remainingProducts.map((product, index) => (
              <ProductItem
                key={product.id}
                product={product}
                loading={undefined}
              />
            ))}
          </div>
        </div>
      )}

      {/* Load More Button - if there are more pages */}
      {hasMorePages && (
        <div className="collection-load-more">
          <Link
            to={`?${new URLSearchParams({
              after: collection.products.pageInfo.endCursor || '',
            })}`}
            className="collection-load-more-button"
          >
            Load More Products
          </Link>
        </div>
      )}

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    tags
    variants(first: 5) {
      nodes {
        id
        title
        availableForSale
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;