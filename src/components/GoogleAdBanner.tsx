import { useEffect } from 'react';

interface GoogleAdBannerProps {
  adSlot: string; // Google Ad Manager or AdSense slot ID
  adClient?: string; // Optional: Google AdSense client ID (ca-pub-xxxxxxxxxxxxxxxx)
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export function GoogleAdBanner({
  adSlot,
  adClient,
  adFormat = 'auto',
  className = '',
}: GoogleAdBannerProps) {
  useEffect(() => {
    // Load Google Ads script if not already loaded
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + (adClient || 'ca-pub-xxxxxxxxxxxxxxxx');
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad when component mounts or slot changes
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [adSlot, adClient]);

  if (!adSlot) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
        }}
        data-ad-format={adFormat}
        data-ad-layout="in-article"
        data-ad-slot={adSlot}
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle?: any;
  }
}
