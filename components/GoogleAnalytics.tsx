"use client";

import Script from 'next/script'
import { useEffect } from 'react'

export default function GoogleAnalytics() {
  useEffect(() => {
    // Check if we need to ask for consent (e.g., EU users)
    // For now, we'll just set a simple flag - you can implement proper geo-detection later
    const needsConsent = false; // Set to true to enable consent mode
    
    if (needsConsent) {
      // Set default consent to denied
      window.gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
      
      // Show your consent banner here
      // When user gives consent, update like this:
      // window.gtag('consent', 'update', {
      //   'analytics_storage': 'granted',
      //   'ad_storage': 'granted'
      // });
    }
  }, []);

  return (
    <>
      {/* Google tag (gtag.js) */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-HGN2BJ59LZ"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-HGN2BJ59LZ');
        `}
      </Script>
    </>
  )
}
