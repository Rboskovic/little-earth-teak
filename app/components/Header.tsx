// FILE: app/components/Header.tsx

import {Suspense, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type MenuItemWithCollection = NonNullable<HeaderQuery['menu']>['items'][0] & {
  resource?: {
    id: string;
    handle: string;
    image?: {
      url: string;
      altText: string;
      width: number;
      height: number;
    };
  };
};

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  return (
    <header className="header">
      {/* Desktop: Two-row layout */}
      <div className="header-desktop">
        {/* Top row: Search | Logo | Account/Wishlist/Cart */}
        <div className="header-top-row">
          <div className="header-search-container">
            <SearchToggle />
          </div>
          
          <NavLink prefetch="intent" to="/" className="header-logo" end>
            {shop.brand?.logo?.image?.url ? (
              <img
                src={shop.brand.logo.image.url}
                alt={shop.name}
                className="header-logo-image"
                loading="eager"
                width="120"
                height="40"
              />
            ) : (
              <strong>{shop.name}</strong>
            )}
          </NavLink>

          <div className="header-utilities">
            <NavLink prefetch="intent" to="/account" className="header-utility-link">
              <Suspense fallback="Account">
                <Await resolve={isLoggedIn} errorElement="Account">
                  {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
                </Await>
              </Suspense>
            </NavLink>
            <NavLink prefetch="intent" to="/wishlist" className="header-utility-link">
              Wishlist
            </NavLink>
            <CartToggle cart={cart} />
          </div>
        </div>

        {/* Bottom row: Category navigation with mega menu */}
        <nav className="header-nav-row" role="navigation" aria-label="Main navigation">
          <DesktopNavigation
            menu={menu}
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        </nav>
      </div>

      {/* Mobile: Single-row layout */}
      <div className="header-mobile">
        <HeaderMenuMobileToggle />
        
        <NavLink prefetch="intent" to="/" className="header-logo" end>
          {shop.brand?.logo?.image?.url ? (
            <img
              src={shop.brand.logo.image.url}
              alt={shop.name}
              className="header-logo-image"
              loading="eager"
              width="100"
              height="32"
            />
          ) : (
            <strong>{shop.name}</strong>
          )}
        </NavLink>

        <div className="header-mobile-utilities">
          <SearchToggle />
          <NavLink 
            prefetch="intent" 
            to="/wishlist" 
            className="header-utility-link"
            aria-label="View wishlist"
          >
            <span className="visually-hidden">Wishlist</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </NavLink>
          <CartToggle cart={cart} />
        </div>
      </div>
    </header>
  );
}

function DesktopNavigation({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (!menu?.items) return null;

  return (
    <ul className="header-nav-list">
      {menu.items.map((item) => {
        if (!item.url) return null;

        const url = getInternalUrl(item.url, primaryDomainUrl, publicStoreDomain);
        const hasSubmenu = item.items && item.items.length > 0;

        return (
          <li
            key={item.id}
            className="header-nav-item"
            onMouseEnter={() => hasSubmenu && setActiveMenu(item.id)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <NavLink
              to={url}
              prefetch="intent"
              className="header-nav-link"
            >
              {item.title}
            </NavLink>

            {hasSubmenu && activeMenu === item.id && (
              <MegaMenu
                items={item.items as MenuItemWithCollection[]}
                primaryDomainUrl={primaryDomainUrl}
                publicStoreDomain={publicStoreDomain}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function MegaMenu({
  items,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  items: MenuItemWithCollection[];
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  return (
    <div className="mega-menu">
      <div className="mega-menu-content">
        <ul className="mega-menu-list">
          {items.map((subItem) => {
            if (!subItem.url) return null;

            const url = getInternalUrl(subItem.url, primaryDomainUrl, publicStoreDomain);
            const collectionImage = subItem.resource?.image;

            return (
              <li key={subItem.id} className="mega-menu-item">
                <NavLink
                  to={url}
                  prefetch="intent"
                  className="mega-menu-link"
                >
                  {collectionImage && (
                    <div className="mega-menu-image">
                      <img
                        src={collectionImage.url}
                        alt={collectionImage.altText || subItem.title}
                        loading="lazy"
                        width="80"
                        height="80"
                      />
                    </div>
                  )}
                  <span className="mega-menu-title">{subItem.title}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function HeaderMenu({
  menu,
  viewport,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderQuery['menu'];
  viewport: 'desktop' | 'mobile';
  primaryDomainUrl: string;
  publicStoreDomain: string;
}) {
  const {close} = useAside();

  if (!menu?.items) return null;

  return (
    <nav className={`header-menu-${viewport}`} role="navigation">
      {menu.items.map((item) => {
        if (!item.url) return null;

        const url = getInternalUrl(item.url, primaryDomainUrl, publicStoreDomain);

        return (
          <div key={item.id}>
            <NavLink
              end
              onClick={close}
              prefetch="intent"
              to={url}
              className="header-menu-item"
            >
              {item.title}
            </NavLink>
            
            {item.items && item.items.length > 0 && (
              <ul className="header-submenu">
                {item.items.map((subItem) => {
                  if (!subItem.url) return null;
                  const subUrl = getInternalUrl(subItem.url, primaryDomainUrl, publicStoreDomain);
                  
                  return (
                    <li key={subItem.id}>
                      <NavLink
                        onClick={close}
                        prefetch="intent"
                        to={subUrl}
                        className="header-submenu-item"
                      >
                        {subItem.title}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button 
      className="header-search-toggle" 
      onClick={() => open('search')}
      aria-label="Open search"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <span className="header-search-text">Search</span>
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className="header-cart-toggle"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      aria-label={`Cart with ${count ?? 0} items`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count !== null && count > 0 && (
        <span className="header-cart-badge">{count}</span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

function getInternalUrl(url: string, primaryDomainUrl: string, publicStoreDomain: string): string {
  if (
    url.includes('myshopify.com') ||
    url.includes(publicStoreDomain) ||
    url.includes(primaryDomainUrl)
  ) {
    return new URL(url).pathname;
  }
  return url;
}