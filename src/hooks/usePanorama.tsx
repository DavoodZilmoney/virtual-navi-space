
import { useState, useEffect, useCallback } from 'react';
import { getSceneById, Scene, Hotspot } from '@/lib/tourData';

export function usePanorama(initialSceneId: string) {
  const [currentSceneId, setCurrentSceneId] = useState<string>(initialSceneId);
  const [currentScene, setCurrentScene] = useState<Scene | undefined>(getSceneById(initialSceneId));
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionStage, setTransitionStage] = useState<'zoom-in' | 'change-scene' | 'none'>('none');
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [cameraRotation, setCameraRotation] = useState<{ phi: number; theta: number }>({ phi: Math.PI / 2, theta: 0 });
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState<boolean>(false);
  const [targetSceneId, setTargetSceneId] = useState<string | null>(null);

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
    if (currentSceneId === sceneId || isTransitioning) return;
    
    // Set target scene and start zoom-in transition
    setTargetSceneId(sceneId);
    setTransitionStage('zoom-in');
    setIsTransitioning(true);
    setIsInfoPanelOpen(false);
    setActiveHotspot(null);
    
    // After zoom-in, change the scene
    setTimeout(() => {
      setTransitionStage('change-scene');
      
      // Change scene after a brief pause
      setTimeout(() => {
        setCurrentSceneId(sceneId);
        setTargetSceneId(null);
        
        // Reset camera rotation to default when changing scenes
        setCameraRotation({ phi: Math.PI / 2, theta: 0 });
        
        // Allow time for the new scene to load before fading in
        setTimeout(() => {
          setTransitionStage('none');
          setIsTransitioning(false);
        }, 500);
      }, 300);
    }, 600);
  }, [currentSceneId, isTransitioning]);

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
    transitionStage,
    activeHotspot,
    isInfoPanelOpen,
    cameraRotation,
    navigateToScene,
    handleHotspotClick,
    closeInfoPanel,
    updateCameraRotation
  };
}
