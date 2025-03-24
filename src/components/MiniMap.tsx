
import { useRef, useEffect } from 'react';
import { Scene } from '@/lib/tourData';
import { cn } from '@/lib/utils';

interface MiniMapProps {
  scenes: Scene[];
  currentSceneId: string;
  onSceneSelect: (sceneId: string) => void;
  isOpen: boolean;
}

const MiniMap = ({ scenes, currentSceneId, onSceneSelect, isOpen }: MiniMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    if (isOpen) {
      mapRef.current.style.opacity = '1';
      mapRef.current.style.transform = 'translateY(0)';
    } else {
      mapRef.current.style.opacity = '0';
      mapRef.current.style.transform = 'translateY(-20px)';
    }
  }, [isOpen]);

  return (
    <div className="absolute top-8 left-8 z-40">
      <div 
        ref={mapRef}
        className={cn(
          "glass-panel rounded-xl overflow-hidden transition-all duration-300 ease-out",
          "border border-tour-panel-border backdrop-blur-lg shadow-lg",
          "w-64 h-48"
        )}
        style={{ opacity: isOpen ? 1 : 0, transform: isOpen ? 'translateY(0)' : 'translateY(-20px)' }}
      >
        <div className="p-3 border-b border-tour-panel-border">
          <h3 className="text-sm font-medium">Office Map</h3>
        </div>
        
        <div className="relative w-full h-32 p-4">
          {/* Floor map background */}
          <div className="absolute inset-0 m-4 bg-gray-100 rounded-lg opacity-50"></div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {scenes.map(scene => 
              scene.connections.map(connId => {
                const connScene = scenes.find(s => s.id === connId);
                if (!connScene) return null;
                
                return (
                  <line 
                    key={`${scene.id}-${connId}`}
                    x1={scene.position.x} 
                    y1={scene.position.y} 
                    x2={connScene.position.x} 
                    y2={connScene.position.y}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                );
              })
            )}
          </svg>
          
          {/* Scene dots */}
          {scenes.map(scene => (
            <button
              key={scene.id}
              className={cn(
                "absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200",
                scene.id === currentSceneId 
                  ? "bg-tour-accent shadow-md scale-125" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              style={{ 
                left: `${scene.position.x}%`, 
                top: `${scene.position.y}%` 
              }}
              onClick={() => onSceneSelect(scene.id)}
              aria-label={`Go to ${scene.name}`}
            />
          ))}
          
          {/* Current scene label */}
          {scenes.map(scene => scene.id === currentSceneId && (
            <div 
              key={`label-${scene.id}`}
              className="absolute px-2 py-1 text-xs font-medium text-white bg-tour-accent rounded transform -translate-x-1/2 whitespace-nowrap"
              style={{ 
                left: `${scene.position.x}%`, 
                top: `${scene.position.y + 8}%` 
              }}
            >
              {scene.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MiniMap;
