'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { NAV_ITEMS } from './navConfig';

type SiteSettings = {
  siteName?: string;
  navCtaLabel?: string;
  navCtaUrl?: string;
  logoUrl?: string | null;
};

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

export function Header({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const ctaLabel = settings.navCtaLabel || 'Book a Consultation';
  const ctaUrl = settings.navCtaUrl || '/book';

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Primary">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-brand">
          {settings.logoUrl ? (
            <Image src={settings.logoUrl} alt={settings.siteName || 'DXP Catalyst'} width={140} height={32} className="h-8 w-auto" priority />
          ) : (
            <span className="text-lg">{settings.siteName || 'DXP Catalyst'}</span>
          )}
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            if (item.children) {
              const childActive = item.children.some((c) => isActive(pathname, c.href));
              return (
                <li key={item.label} className="group relative">
                  <button
                    className={`flex items-center gap-1 py-2 text-sm font-medium ${
                      active || childActive ? 'text-brand' : 'text-gray-700 hover:text-brand'
                    }`}
                    aria-expanded={false}
                  >
                    {item.label}
                    <span aria-hidden>▾</span>
                  </button>
                  <ul className="invisible absolute left-0 top-full z-50 w-64 rounded-md border border-gray-200 bg-white py-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={`block px-4 py-2 text-sm ${
                            isActive(pathname, child.href)
                              ? 'text-brand'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-brand'
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            }
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`py-2 text-sm font-medium ${
                    active ? 'text-brand' : 'text-gray-700 hover:text-brand'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link href={ctaUrl} className="btn-primary">
            {ctaLabel}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span className="text-xl">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => {
              if (item.children) {
                return (
                  <li key={item.label}>
                    <button
                      className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-gray-800"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                    >
                      {item.label}
                      <span aria-hidden>{servicesOpen ? '−' : '+'}</span>
                    </button>
                    {servicesOpen && (
                      <ul className="ml-4 flex flex-col border-l border-gray-200 pl-3">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block py-2 text-sm text-gray-700 hover:text-brand"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="block py-2 text-sm font-medium text-gray-800 hover:text-brand"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link href={ctaUrl} className="btn-primary w-full" onClick={() => setMobileOpen(false)}>
                {ctaLabel}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
