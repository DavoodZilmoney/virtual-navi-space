
import { tourData } from '@/lib/tourData';
import PanoramaViewer from '@/components/PanoramaViewer';
import { useEffect } from 'react';

const Index = () => {
  // Preload images for smoother transitions
  useEffect(() => {
    tourData.forEach(scene => {
      const img = new Image();
      img.src = scene.image;
    });
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <PanoramaViewer 
        initialSceneId="reception" 
        scenes={tourData} 
      />
    </div>
  );
};

export default Index;
