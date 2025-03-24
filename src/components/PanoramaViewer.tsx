import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Scene as TourScene, Hotspot as HotspotType } from '@/lib/tourData';
import { cn } from '@/lib/utils';
import Hotspot from './Hotspot';
import NavigationControls from './NavigationControls';
import InfoPanel from './InfoPanel';
import MiniMap from './MiniMap';
import { usePanorama } from '@/hooks/usePanorama';

interface PanoramaViewerProps {
  initialSceneId: string;
  scenes: TourScene[];
}

const PanoramaViewer = ({ initialSceneId, scenes }: PanoramaViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);
  const isUserInteractingRef = useRef(false);
  const onPointerDownMouseXRef = useRef(0);
  const onPointerDownMouseYRef = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const {
    currentScene,
    isTransitioning,
    transitionStage,
    activeHotspot,
    isInfoPanelOpen,
    navigateToScene,
    handleHotspotClick,
    closeInfoPanel,
  } = usePanorama(initialSceneId);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 0.1); // Slight offset to prevent rendering issues
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Create sphere geometry for panorama
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere so texture is on the inside
    
    // Create material with placeholder texture
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0
    });
    
    // Create sphere mesh
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    sphereRef.current = sphere;
    
    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Disabled auto-rotation as requested
      // if (!isUserInteractingRef.current) {
      //   lonRef.current += 0.03;
      // }
      
      // Constrain vertical view (prevent upside down views)
      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      
      // Convert to radians
      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);
      
      // Set camera target
      const target = new THREE.Vector3();
      target.x = 500 * Math.sin(phi) * Math.cos(theta);
      target.y = 500 * Math.cos(phi);
      target.z = 500 * Math.sin(phi) * Math.sin(theta);
      
      if (cameraRef.current) {
        cameraRef.current.lookAt(target);
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    // Start animation loop
    animate();
    
    // Mouse/touch event handlers for dragging the panorama
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current) return;
      
      isUserInteractingRef.current = true;
      
      const clientX = event.clientX;
      const clientY = event.clientY;
      
      onPointerDownMouseXRef.current = clientX;
      onPointerDownMouseYRef.current = clientY;
      
      onPointerDownLonRef.current = lonRef.current;
      onPointerDownLatRef.current = latRef.current;
      
      containerRef.current.style.cursor = 'grabbing';
    };
    
    const onPointerMove = (event: PointerEvent) => {
      if (!isUserInteractingRef.current) return;
      
      const clientX = event.clientX;
      const clientY = event.clientY;
      
      lonRef.current = (onPointerDownMouseXRef.current - clientX) * 0.2 + onPointerDownLonRef.current;
      latRef.current = (clientY - onPointerDownMouseYRef.current) * 0.2 + onPointerDownLatRef.current;
    };
    
    const onPointerUp = () => {
      isUserInteractingRef.current = false;
      if (containerRef.current) {
        containerRef.current.style.cursor = 'grab';
      }
    };
    
    const onWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return;
      
      // Zoom with mouse wheel
      const fov = cameraRef.current.fov + event.deltaY * 0.05;
      cameraRef.current.fov = THREE.MathUtils.clamp(fov, 30, 90);
      cameraRef.current.updateProjectionMatrix();
    };
    
    // Add event listeners
    const domElement = containerRef.current;
    domElement.addEventListener('pointerdown', onPointerDown);
    domElement.addEventListener('pointermove', onPointerMove);
    domElement.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('wheel', onWheel);
    
    domElement.style.cursor = 'grab';
    
    // Clean up
    return () => {
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && rendererRef.current.domElement) {
        domElement.removeChild(rendererRef.current.domElement);
      }
      
      rendererRef.current?.dispose();
    };
  }, []);
  
  // Update panorama texture when scene changes
  useEffect(() => {
    if (!currentScene || !sphereRef.current) return;
    
    // Create loader for panorama image
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';
    
    // Load new panorama texture
    loader.load(
      currentScene.image,
      (texture) => {
        if (!sphereRef.current) return;
        
        // Store new texture
        if (textureRef.current) {
          textureRef.current.dispose();
        }
        textureRef.current = texture;
        
        // Update material
        const material = sphereRef.current.material as THREE.MeshBasicMaterial;
        material.map = texture;
        material.needsUpdate = true;
        
        // Fade in the new panorama
        if (!isTransitioning) {
          const fadeIn = () => {
            if (!sphereRef.current) return;
            const material = sphereRef.current.material as THREE.MeshBasicMaterial;
            
            if (material.opacity < 1) {
              material.opacity += 0.05;
              requestAnimationFrame(fadeIn);
            }
          };
          
          fadeIn();
        }
      },
      undefined,
      (error) => {
        console.error('Error loading panorama texture:', error);
      }
    );
  }, [currentScene, isTransitioning]);
  
  // Handle transition zoom effect
  useEffect(() => {
    if (!cameraRef.current || !isTransitioning) return;
    
    if (transitionStage === 'zoom-in') {
      // Zoom in effect to simulate forward movement
      const zoomIn = () => {
        if (!cameraRef.current || transitionStage !== 'zoom-in') return;
        
        if (cameraRef.current.fov > 50) {
          cameraRef.current.fov -= 0.5;
          cameraRef.current.updateProjectionMatrix();
          requestAnimationFrame(zoomIn);
        }
      };
      
      zoomIn();
    } else if (transitionStage === 'change-scene') {
      // Reset FOV when changing scene
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [transitionStage, isTransitioning]);
  
  // Handle transition opacity effect
  useEffect(() => {
    if (!sphereRef.current || !isTransitioning) return;
    
    const material = sphereRef.current.material as THREE.MeshBasicMaterial;
    
    if (transitionStage === 'zoom-in') {
      // Fade out current panorama during zoom-in
      const fadeOut = () => {
        if (!sphereRef.current || transitionStage !== 'zoom-in') return;
        const material = sphereRef.current.material as THREE.MeshBasicMaterial;
        
        if (material.opacity > 0.4) {
          material.opacity -= 0.05;
          requestAnimationFrame(fadeOut);
        }
      };
      
      fadeOut();
    } else if (transitionStage === 'change-scene') {
      // Keep the opacity low during scene change
      material.opacity = 0.3;
    } else if (transitionStage === 'none' && !isTransitioning) {
      // Fade in new panorama
      const fadeIn = () => {
        if (!sphereRef.current) return;
        const material = sphereRef.current.material as THREE.MeshBasicMaterial;
        
        if (material.opacity < 1) {
          material.opacity += 0.05;
          requestAnimationFrame(fadeIn);
        }
      };
      
      fadeIn();
    }
  }, [transitionStage, isTransitioning]);
  
  // Handle zoom in
  const handleZoomIn = () => {
    if (!cameraRef.current) return;
    
    const newFov = cameraRef.current.fov - 5;
    cameraRef.current.fov = THREE.MathUtils.clamp(newFov, 30, 90);
    cameraRef.current.updateProjectionMatrix();
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    if (!cameraRef.current) return;
    
    const newFov = cameraRef.current.fov + 5;
    cameraRef.current.fov = THREE.MathUtils.clamp(newFov, 30, 90);
    cameraRef.current.updateProjectionMatrix();
  };
  
  // Reset view
  const handleReset = () => {
    if (!cameraRef.current) return;
    
    // Reset camera FOV
    cameraRef.current.fov = 75;
    cameraRef.current.updateProjectionMatrix();
    
    // Reset rotation
    lonRef.current = 0;
    latRef.current = 0;
  };
  
  // Handle fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  // Handle rotation via UI controls
  const handleRotate = (direction: 'up' | 'down' | 'left' | 'right') => {
    switch (direction) {
      case 'up':
        latRef.current += 10;
        break;
      case 'down':
        latRef.current -= 10;
        break;
      case 'left':
        lonRef.current -= 10;
        break;
      case 'right':
        lonRef.current += 10;
        break;
    }
  };
  
  // Convert spherical coordinates to screen coordinates
  const getHotspotPosition = (hotspot: HotspotType) => {
    if (!containerRef.current || !cameraRef.current) {
      return { x: 0, y: 0 };
    }
    
    const { phi, theta } = hotspot.position;
    
    // Convert spherical to Cartesian coordinates
    const x = 500 * Math.sin(phi) * Math.cos(theta);
    const y = 500 * Math.cos(phi);
    const z = 500 * Math.sin(phi) * Math.sin(theta);
    
    // Create 3D vector
    const vector = new THREE.Vector3(x, y, z);
    
    // Convert 3D position to screen position
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    // Project to screen space
    const widthHalf = width / 2;
    const heightHalf = height / 2;
    
    // Create projected vector
    const projectedVector = vector.clone();
    projectedVector.project(cameraRef.current);
    
    // Convert to screen coordinates
    return {
      x: (projectedVector.x * widthHalf) + widthHalf,
      y: -(projectedVector.y * heightHalf) + heightHalf
    };
  };
  
  // Check if a hotspot is visible in the current view
  const isHotspotVisible = (projectedPosition: { x: number, y: number }) => {
    if (!containerRef.current) return false;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    return (
      projectedPosition.x >= 0 &&
      projectedPosition.x <= width &&
      projectedPosition.y >= 0 &&
      projectedPosition.y <= height
    );
  };

  // Filter hotspots to only show the ones closest to current view
  const getVisibleHotspots = () => {
    if (!currentScene || !cameraRef.current) return [];
    
    const visibleHotspots = currentScene.hotspots.filter(hotspot => {
      const position = getHotspotPosition(hotspot);
      return isHotspotVisible(position);
    });
    
    // Calculate current camera direction
    const phi = THREE.MathUtils.degToRad(90 - latRef.current);
    const theta = THREE.MathUtils.degToRad(lonRef.current);
    
    const cameraDirection = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(theta)
    );
    
    // Sort hotspots by distance to camera's view direction
    return visibleHotspots.sort((a, b) => {
      const aPos = a.position;
      const bPos = b.position;
      
      const aDir = new THREE.Vector3(
        Math.sin(aPos.phi) * Math.cos(aPos.theta),
        Math.cos(aPos.phi),
        Math.sin(aPos.phi) * Math.sin(aPos.theta)
      );
      
      const bDir = new THREE.Vector3(
        Math.sin(bPos.phi) * Math.cos(bPos.theta),
        Math.cos(bPos.phi),
        Math.sin(bPos.phi) * Math.sin(bPos.theta)
      );
      
      const aDot = cameraDirection.dot(aDir);
      const bDot = cameraDirection.dot(bDir);
      
      return bDot - aDot;
    }).slice(0, 3); // Only show the 3 most relevant hotspots
  };

  return (
    <div className="panorama-wrapper w-full h-screen" ref={containerRef}>
      {/* Render hotspots if scene is loaded and not transitioning */}
      {currentScene && !isTransitioning && getVisibleHotspots().map(hotspot => {
        const position = getHotspotPosition(hotspot);
        
        return (
          <Hotspot
            key={hotspot.id}
            hotspot={hotspot}
            onClick={handleHotspotClick}
            isActive={activeHotspot?.id === hotspot.id}
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`
            }}
          />
        );
      })}
      
      {/* Mini map */}
      <MiniMap
        scenes={scenes}
        currentSceneId={currentScene?.id || initialSceneId}
        onSceneSelect={navigateToScene}
        isOpen={isMapOpen}
      />
      
      {/* Navigation controls */}
      <NavigationControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onToggleFullscreen={handleToggleFullscreen}
        onRotate={handleRotate}
        isFullscreen={isFullscreen}
        onToggleMap={() => setIsMapOpen(!isMapOpen)}
      />
      
      {/* Info panel */}
      <InfoPanel
        hotspot={activeHotspot}
        isOpen={isInfoPanelOpen}
        onClose={closeInfoPanel}
      />
      
      {/* Scene transition overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black pointer-events-none transition-opacity duration-500",
          isTransitioning ? "opacity-30" : "opacity-0"
        )}
      />
    </div>
  );
};

export default PanoramaViewer;
