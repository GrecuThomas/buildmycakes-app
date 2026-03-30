import { useEffect, useState, useRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface AdWallProps {
  isOpen: boolean;
  onComplete: () => void;
  onCancel: () => void;
  fileName: string;
}

export function AdWall({ isOpen, onComplete, onCancel, fileName }: AdWallProps) {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeRemaining(30);
      hasCompletedRef.current = false;
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Don't automatically call onComplete - let user click the button
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const isComplete = timeRemaining === 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-blue-800/50 border-b border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={24} className="text-blue-200" />
            <h3 className="font-bold text-white">Thank You for Using BuildMyCakes!</h3>
          </div>
          <p className="text-blue-100 text-sm">Ad-Supported Free Tier</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Ad Placeholder */}
          <div className="mb-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg p-4">
            <p className="text-gray-900 font-bold mb-1 text-sm">🎂 Special Offer</p>
            <p className="text-gray-800 text-xs mb-3">
              Unlock unlimited exports, remove watermarks & get priority support with our Premium plan!
            </p>
            <a 
              href="/pricing-checkout"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gray-900 text-white font-semibold py-1.5 px-3 text-sm rounded-lg hover:bg-black transition-colors text-center"
            >
              Learn More
            </a>
          </div>

          {/* Additional Ad Space */}
          <div className="mb-6 bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-500 text-xs">Ad Space</p>
          </div>

          <div className="mb-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/20">
            <p className="text-blue-50 text-xs mb-1">Preparing to download:</p>
            <p className="text-white font-mono text-xs break-all font-semibold">
              {fileName}
            </p>
          </div>

          {/* Small Timer Above Progress Bar */}
          <div className="mb-4 text-center">
            <p className="text-blue-50 text-sm mb-2">
              Your design will be ready in
            </p>
            <div className="text-3xl font-bold text-blue-100 font-mono">
              {timeRemaining}s
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-blue-500/30 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-300 to-blue-100 h-full transition-all duration-1000 ease-linear"
              style={{
                width: `${((30 - timeRemaining) / 30) * 100}%`,
              }}
            />
          </div>

          {/* Message */}
          <p className="text-blue-100 text-sm mb-6">
            {isComplete
              ? '✓ Your file is ready to download'
              : 'Please wait while we view the offer...'}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-blue-500/50 text-white font-semibold rounded-lg hover:bg-blue-500/70 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (!hasCompletedRef.current) {
                  hasCompletedRef.current = true;
                  onComplete();
                }
              }}
              disabled={!isComplete}
              className="flex-1 px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isComplete ? 'Download Now' : 'Waiting...'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-blue-800/30 border-t border-blue-500/30">
          <p className="text-xs text-blue-200 text-center">
            Free tier with ads helps us keep building amazing tools for bakers everywhere
          </p>
        </div>
      </div>
    </div>
  );
}
