import { useState, useEffect } from 'react';
import { GoogleAdBanner } from './GoogleAdBanner';

/**
 * Renders two fixed vertical ad rails on the left and right of the viewport.
 * Only visible when the screen is wide enough (≥1600px) that the rails
 * sit entirely outside the max-w-7xl (1280px) content area.
 */
export function StickyRailAds() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(window.innerWidth >= 1600);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!show) return null;

  return (
    <>
      {/* Left rail */}
      <div className="fixed top-24 z-10" style={{ left: 0, width: '160px' }}>
        <GoogleAdBanner adSlot="4633851948" adFormat="vertical" />
      </div>

      {/* Right rail */}
      <div className="fixed top-24 z-10" style={{ right: 0, width: '160px' }}>
        <GoogleAdBanner adSlot="4633851948" adFormat="vertical" />
      </div>
    </>
  );
}
