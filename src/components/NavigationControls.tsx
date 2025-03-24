
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  ZoomIn, ZoomOut, RotateCcw, MapPin, Maximize, Minimize,
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';

interface NavigationControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleFullscreen: () => void;
  onRotate: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onToggleMap: () => void;
  isFullscreen: boolean;
}

const NavigationControls = ({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleFullscreen,
  onRotate,
  onToggleMap,
  isFullscreen
}: NavigationControlsProps) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="absolute bottom-8 right-8 z-40 flex flex-col space-y-3">
      {expanded && (
        <div className="flex flex-col space-y-3 animate-fade-in">
          <button 
            onClick={onZoomIn} 
            className="control-button"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={onZoomOut} 
            className="control-button"
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={onReset} 
            className="control-button"
            aria-label="Reset View"
          >
            <RotateCcw className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={onToggleFullscreen} 
            className="control-button"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize className="h-5 w-5 text-gray-700" />
            ) : (
              <Maximize className="h-5 w-5 text-gray-700" />
            )}
          </button>
          
          <button 
            onClick={onToggleMap} 
            className="control-button"
            aria-label="Toggle Map"
          >
            <MapPin className="h-5 w-5 text-gray-700" />
          </button>
        </div>
      )}
      
      {/* Direction controls */}
      <div className="flex flex-col items-center space-y-3">
        <button 
          onClick={() => onRotate('up')} 
          className="control-button"
          aria-label="Look Up"
        >
          <ChevronUp className="h-5 w-5 text-gray-700" />
        </button>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => onRotate('left')} 
            className="control-button"
            aria-label="Look Left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          
          <button 
            onClick={() => setExpanded(!expanded)} 
            className={cn(
              "control-button bg-tour-accent text-white",
              expanded ? "opacity-100" : "opacity-80 hover:opacity-100"
            )}
            aria-label={expanded ? "Collapse Controls" : "Expand Controls"}
          >
            <MapPin className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => onRotate('right')} 
            className="control-button"
            aria-label="Look Right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        
        <button 
          onClick={() => onRotate('down')} 
          className="control-button"
          aria-label="Look Down"
        >
          <ChevronDown className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default NavigationControls;
