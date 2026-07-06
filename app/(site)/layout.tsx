import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { sanityFetch } from '@/sanity/lib/fetch';
import { siteSettingsQuery } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';

type SiteSettings = {
  siteName?: string;
  logoLight?: any;
  navCtaLabel?: string;
  navCtaUrl?: string;
  footerTagline?: string;
  email?: string;
  phone?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
};

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = (await sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    tags: ['siteSettings'],
  })) || {};

  const logoUrl = settings.logoLight
    ? urlForImage(settings.logoLight).width(280).height(64).fit('max').auto('format').url()
    : null;

  return (
    <>
      <Header
        settings={{
          siteName: settings.siteName,
          navCtaLabel: settings.navCtaLabel,
          navCtaUrl: settings.navCtaUrl,
          logoUrl,
          linkedInUrl: settings.linkedInUrl,
          instagramUrl: settings.instagramUrl,
        }}
      />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer
        settings={{
          siteName: settings.siteName,
          footerTagline: settings.footerTagline,
          email: settings.email,
          phone: settings.phone,
          linkedInUrl: settings.linkedInUrl,
          instagramUrl: settings.instagramUrl,
        }}
      />
    </>
  );
}
