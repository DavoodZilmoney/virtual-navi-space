
import { useState, useEffect, useRef } from 'react';
import { Hotspot as HotspotType } from '@/lib/tourData';
import { cn } from '@/lib/utils';
import { ArrowRight, Info } from 'lucide-react';

interface HotspotProps {
  hotspot: HotspotType;
  onClick: (hotspot: HotspotType) => void;
  isActive: boolean;
}

const Hotspot = ({ hotspot, onClick, isActive }: HotspotProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  
  // Control visibility of hover label
  useEffect(() => {
    if (!labelRef.current) return;
    
    if (isHovered) {
      labelRef.current.style.opacity = '1';
      labelRef.current.style.transform = 'translateY(0) scale(1)';
    } else {
      labelRef.current.style.opacity = '0';
      labelRef.current.style.transform = 'translateY(10px) scale(0.95)';
    }
  }, [isHovered]);

  return (
    <div 
      className={cn(
        "absolute w-12 h-12 cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2",
        isActive ? "scale-110" : "scale-100",
        "hotspot-pulse" // Adds pulsing animation
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(hotspot)}
    >
      <div className={cn(
        "rounded-full w-full h-full flex items-center justify-center transition-all duration-300 z-10",
        hotspot.type === "navigation" 
          ? "bg-tour-accent text-white" 
          : "bg-tour-hotspot text-tour-accent border border-tour-panel-border",
        isHovered ? "scale-110 shadow-lg" : "scale-100"
      )}>
        {hotspot.type === "navigation" ? (
          <ArrowRight className="h-5 w-5" />
        ) : (
          <Info className="h-5 w-5" />
        )}
      </div>
      
      {/* Hotspot label */}
      <div 
        ref={labelRef}
        className="absolute top-14 left-1/2 transform -translate-x-1/2 glass-panel rounded-lg py-2 px-4 min-w-max opacity-0 transition-all duration-300 z-20 pointer-events-none shadow-lg"
      >
        <span className="font-medium text-sm">{hotspot.title}</span>
      </div>
    </div>
  );
};

export default Hotspot;
