import { useEffect } from 'react';

interface GoogleAdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

export function GoogleAdBanner({
  adSlot,
  adFormat = 'auto',
  className = '',
}: GoogleAdBannerProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        window.adsbygoogle.push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [adSlot]);

  if (!adSlot) return null;

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client="ca-pub-1764282207738468"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle?: any;
  }
}
