
import { useEffect, useRef } from 'react';
import { Hotspot } from '@/lib/tourData';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface InfoPanelProps {
  hotspot: Hotspot | null;
  isOpen: boolean;
  onClose: () => void;
}

const InfoPanel = ({ hotspot, isOpen, onClose }: InfoPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!panelRef.current) return;
    
    if (isOpen) {
      panelRef.current.style.opacity = '1';
      panelRef.current.style.transform = 'translateY(0)';
    } else {
      panelRef.current.style.opacity = '0';
      panelRef.current.style.transform = 'translateY(20px)';
    }
  }, [isOpen]);

  if (!hotspot) return null;

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-50 pointer-events-none">
      <div 
        ref={panelRef}
        className={cn(
          "glass-panel rounded-xl overflow-hidden transition-all duration-300 ease-out shadow-lg pointer-events-auto",
          "border border-tour-panel-border backdrop-blur-lg"
        )}
        style={{ opacity: 0, transform: 'translateY(20px)' }}
      >
        <div className="flex justify-between items-center p-4 border-b border-tour-panel-border">
          <h3 className="text-lg font-medium">{hotspot.title}</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-black/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-700">{hotspot.description}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
