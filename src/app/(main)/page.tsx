import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FAQSection from '@/components/home/FAQSection';
import BenefitsSection from '@/components/home/BenefitsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import WhyOjam from '@/components/home/WhyOjam';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ojam.in';

export const metadata: Metadata = {
  title: 'OJAM | Premium Protein Supplements India',
  description: 'Shop premium whey protein, plant protein, mass gainers, creatine & more. Clean ingredients, real results. Free shipping above ₹999.',
  alternates: { canonical: siteUrl },
  openGraph: {
    url: siteUrl,
    images: [{ url: '/ojam.png', width: 1024, height: 1024, alt: 'OJAM – Premium Protein Supplements' }],
  },
  twitter: {
    images: ['/ojam.png'],
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OJAM',
  url: siteUrl,
  logo: `${siteUrl}/ojam.png`,
  description: 'Premium protein supplements and nutrition products made in India.',
  email: 'hello@ojam.in',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bhiwani',
    addressRegion: 'Haryana',
    postalCode: '127021',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@ojam.in',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/ojam_in',
    'https://www.facebook.com/ojamin',
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What types of protein supplements does OJAM offer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'OJAM offers a wide range including whey protein concentrate, whey protein isolate, plant-based protein, mass gainers, creatine, and pre-workout supplements — all formulated for Indian athletes and fitness enthusiasts.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are OJAM supplements lab-tested and safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All OJAM products are manufactured in FSSAI-compliant facilities and undergo third-party lab testing for purity, protein content, and heavy metals before reaching you.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer free shipping?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, OJAM offers free shipping on all orders above ₹999 across India.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are OJAM protein supplements vegetarian?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most OJAM whey proteins are vegetarian (derived from milk). We also offer 100% plant-based protein options that are vegan-friendly. Each product page clearly displays the dietary category.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does delivery take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Orders are typically delivered within 3–7 business days across India. You will receive a tracking number once your order is dispatched.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods does OJAM accept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept all major payment methods including UPI, credit/debit cards, net banking via Razorpay, and Cash on Delivery (COD).',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I return or exchange a product?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept returns on sealed, unopened products within 7 days of delivery. For damaged or incorrect items, please contact us at hello@ojam.in within 48 hours of receiving your order.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I choose the right protein supplement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For muscle building and recovery, whey isolate or concentrate works best. For weight gain, choose a mass gainer. For a dairy-free option, go with plant protein. If you need help, reach out to us at hello@ojam.in and our nutrition team will guide you.',
      },
    },
  ],
};

const siteNavigationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'OJAM Site Navigation',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Whey Protein',
      description: 'Premium whey protein concentrate and isolate for muscle building and recovery.',
      url: `${siteUrl}/shop?category=whey-protein`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Mass Gainers',
      description: 'High-calorie mass gainers to support weight gain and muscle growth.',
      url: `${siteUrl}/shop?category=mass-gainer`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Creatine',
      description: 'Pure creatine monohydrate for strength, power, and performance.',
      url: `${siteUrl}/shop?category=creatine`,
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Plant Protein',
      description: '100% plant-based protein — vegan-friendly and dairy-free.',
      url: `${siteUrl}/shop?category=plant-protein`,
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Best Sellers',
      description: 'Our most popular supplements, top-rated by athletes across India.',
      url: `${siteUrl}/shop?featured=true`,
    },
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'OJAM',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/shop?search={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteNavigationJsonLd) }}
      />
      <HeroSection />
      <FeaturedProducts />
      <CategorySection />
      <WhyOjam />
      <FAQSection />
      <TestimonialsSection />
      <BenefitsSection />
    </>
  );
}
