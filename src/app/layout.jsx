import './globals.css'
import { Inter, Playfair_Display, Cinzel, Pinyon_Script } from 'next/font/google'
import ConditionalNavbar from '@/components/layout/ConditionalNavbar'
import { CartProvider } from '@/components/cart/CartContext'
import { WishlistProvider } from '@/components/wishlist/WishlistContext' // ← Add this
// import Footer from '@/components/layout/footer'
import IntroGate from '@/components/ui/IntroGate'
import ReduxProvider from '@/redux/provider'
import Script from "next/script";

/* Fonts */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const accentFont = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-accent',
  display: 'swap',
})

const calligraphy = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-calligraphy',
  display: 'swap',
})


/* Metadata — SERVER ONLY */
export const metadata = {
  title: {
    default: 'Arna Skin Care — Herbal, Pure & Chemical-Free Skincare',
    template: '%s | Arna Skin Care',
  },
  description:
    'Premium herbal skincare crafted with natural ingredients — safe, chemical-free formulations designed for glowing, healthy skin.',
  themeColor: '#ffffff',
  openGraph: {
    type: 'website',
    url: 'https://arnaskincare.in',
    title: 'Arna Skin Care — Refined Rituals',
    description:
      'Luxury herbal skincare designed for healthy, glowing, timeless skin.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arna Skin Care',
    description: 'Pure, herbal and chemical-free skincare that truly works.',
    images: ['/og-image.png'],
  },
  verification: {
    google: [
      "b8tIqWmJMPKdpXMmR945Kg2VEfjzY6zvQT1TPJaET40", // Client's code
      "-sLkfcSOaNnWXNeY0P5jD6a6OzGBVhHSPrRYn8bagqc", // Your personal code
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${accentFont.variable} ${calligraphy.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/logo1.png"
          type="image/png"
          fetchPriority="high"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Arna Skin Care',
              url: 'https://arnaskincare.in',
              logo: 'https://arnaskincare.in/logo.png',
            }),
          }}
        />
      </head>

      <body className="antialiased min-h-screen flex flex-col">
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '1011821335092047');
          fbq('track', 'PageView');
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=1011821335092047&ev=PageView&noscript=1"
          alt="Meta Pixel"
        />
      </noscript>
        {/* End Meta Pixel Code */}
        <ReduxProvider>
          <IntroGate>
            <CartProvider>
              <WishlistProvider> {/* ← Add this wrapper */}
                <ConditionalNavbar />
                <main className="flex-1">{children}</main>
                {/* <Footer /> */}
              </WishlistProvider> {/* ← Close here */}
            </CartProvider>
          </IntroGate>
        </ReduxProvider>
      </body>
    </html>
  )
}
