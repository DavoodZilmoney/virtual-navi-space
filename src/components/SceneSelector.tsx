
import { useState, useRef, useEffect } from 'react';
import { Scene } from '@/lib/tourData';
import { cn } from '@/lib/utils';
import { ChevronDown, Map } from 'lucide-react';

interface SceneSelectorProps {
  scenes: Scene[];
  currentSceneId: string;
  onSceneSelect: (sceneId: string) => void;
  onToggleMap: () => void;
}

const SceneSelector = ({ scenes, currentSceneId, onSceneSelect, onToggleMap }: SceneSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentScene = scenes.find(scene => scene.id === currentSceneId);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelect = (sceneId: string) => {
    onSceneSelect(sceneId);
    setIsOpen(false);
  };

  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2">
      <div ref={dropdownRef} className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "glass-panel px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200",
            "shadow-lg hover:shadow-xl"
          )}
        >
          <span className="font-medium">{currentScene?.name || 'Select Location'}</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : "rotate-0"
          )} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-full glass-panel rounded-xl overflow-hidden shadow-xl animate-scale-in">
            <div className="max-h-64 overflow-y-auto py-1">
              {scenes.map(scene => (
                <button
                  key={scene.id}
                  className={cn(
                    "w-full px-4 py-2 text-left hover:bg-black/5 transition-colors",
                    scene.id === currentSceneId ? "bg-tour-accent/10 font-medium" : ""
                  )}
                  onClick={() => handleSelect(scene.id)}
                >
                  {scene.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <button 
        onClick={onToggleMap}
        className="glass-panel p-2 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle Map"
      >
        <Map className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
};

export default SceneSelector;
