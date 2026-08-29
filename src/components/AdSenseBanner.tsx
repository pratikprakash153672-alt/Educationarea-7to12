import React from 'react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle';
  className?: string;
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId = 'ad-slot-1',
  format = 'horizontal',
  className = '',
}) => {
  return (
    <div
      className={`my-6 mx-auto w-full max-w-5xl rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-3 sm:p-4 text-center transition-all ${className}`}
      id={`ad-container-${slotId}`}
      aria-label="Sponsorship Advertisement Zone"
    >
      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
        <span>Designated Educational Partner Space</span>
        <span className="text-[10px] bg-slate-200/70 px-2 py-0.5 rounded text-slate-500 font-medium">
          AdSense Ready
        </span>
      </div>
      <div
        className={`flex items-center justify-center rounded-lg border border-slate-200/80 bg-white shadow-2xs ${
          format === 'horizontal' ? 'h-20 sm:h-24' : 'h-48'
        }`}
      >
        <div className="text-center px-4">
          <p className="text-xs font-semibold text-slate-600">
            Clean, Student-Safe Advertisement Integration
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Non-intrusive container reserved for certified educational sponsors (Responsive slot #{slotId})
          </p>
        </div>
      </div>
    </div>
  );
};
