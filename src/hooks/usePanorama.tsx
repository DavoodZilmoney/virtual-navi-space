
import { useState, useEffect, useCallback } from 'react';
import { getSceneById, Scene, Hotspot } from '@/lib/tourData';

export function usePanorama(initialSceneId: string) {
  const [currentSceneId, setCurrentSceneId] = useState<string>(initialSceneId);
  const [currentScene, setCurrentScene] = useState<Scene | undefined>(getSceneById(initialSceneId));
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [cameraRotation, setCameraRotation] = useState<{ phi: number; theta: number }>({ phi: Math.PI / 2, theta: 0 });
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);

  // Load scene when ID changes
  useEffect(() => {
    const scene = getSceneById(currentSceneId);
    if (scene) {
      setCurrentScene(scene);
    } else {
      console.error(`Scene with id "${currentSceneId}" not found`);
    }
  }, [currentSceneId]);

  // Navigate to a new scene with transition
  const navigateToScene = useCallback((sceneId: string) => {
    if (currentSceneId === sceneId) return;
    
    setIsTransitioning(true);
    setIsInfoPanelOpen(false);
    setActiveHotspot(null);
    
    // Delayed scene change to allow fade-out animation
    setTimeout(() => {
      setCurrentSceneId(sceneId);
      
      // Reset camera rotation to default when changing scenes
      setCameraRotation({ phi: Math.PI / 2, theta: 0 });
      
      // Allow time for the new scene to load before fading in
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 500);
  }, [currentSceneId]);

  // Handle hotspot click
  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    if (hotspot.type === "navigation" && hotspot.targetScene) {
      navigateToScene(hotspot.targetScene);
    } else if (hotspot.type === "info") {
      setActiveHotspot(hotspot);
      setIsInfoPanelOpen(true);
    }
  }, [navigateToScene]);

  // Close info panel
  const closeInfoPanel = useCallback(() => {
    setIsInfoPanelOpen(false);
    setTimeout(() => {
      setActiveHotspot(null);
    }, 300); // Match animation duration
  }, []);

  // Update camera rotation
  const updateCameraRotation = useCallback((phi: number, theta: number) => {
    setCameraRotation({ phi, theta });
  }, []);

  return {
    currentScene,
    isTransitioning,
    activeHotspot,
    isInfoPanelOpen,
    cameraRotation,
    navigateToScene,
    handleHotspotClick,
    closeInfoPanel,
    updateCameraRotation
  };
}
