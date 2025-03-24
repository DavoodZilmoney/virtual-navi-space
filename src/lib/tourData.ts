
// These would be actual imported images in a real app
// For this prototype, we're using placeholder URLs
export interface Scene {
  id: string;
  name: string;
  image: string;
  position: { x: number; y: number }; // Position on mini-map
  connections: string[]; // IDs of connected scenes
  hotspots: Hotspot[];
}

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  position: { phi: number; theta: number }; // Spherical coordinates
  type: "info" | "navigation";
  targetScene?: string; // For navigation hotspots
}

// Sample office tour data
export const tourData: Scene[] = [
  {
    id: "reception",
    name: "Reception",
    image: "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?q=80&w=3270&auto=format&fit=crop",
    position: { x: 50, y: 25 },
    connections: ["hallway", "waiting-area"],
    hotspots: [
      {
        id: "reception-desk",
        title: "Reception Desk",
        description: "Our friendly reception staff are here to help you with any inquiries or assistance you may need during your visit.",
        position: { phi: Math.PI / 2, theta: 0 },
        type: "info"
      },
      {
        id: "to-hallway",
        title: "Hallway",
        description: "Proceed to the main hallway",
        position: { phi: Math.PI / 2, theta: Math.PI / 2 },
        type: "navigation",
        targetScene: "hallway"
      },
      {
        id: "to-waiting",
        title: "Waiting Area",
        description: "Visit our comfortable waiting area",
        position: { phi: Math.PI / 2, theta: -Math.PI / 2 },
        type: "navigation",
        targetScene: "waiting-area"
      }
    ]
  },
  {
    id: "hallway",
    name: "Main Hallway",
    image: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?q=80&w=3269&auto=format&fit=crop",
    position: { x: 50, y: 50 },
    connections: ["reception", "conference-room", "office-space"],
    hotspots: [
      {
        id: "hallway-art",
        title: "Art Installation",
        description: "This piece was commissioned by local artist Jane Doe to represent our company values of innovation and creativity.",
        position: { phi: Math.PI / 2, theta: -Math.PI / 4 },
        type: "info"
      },
      {
        id: "to-reception",
        title: "Back to Reception",
        description: "Return to the reception area",
        position: { phi: Math.PI / 2, theta: -Math.PI },
        type: "navigation",
        targetScene: "reception"
      },
      {
        id: "to-conference",
        title: "Conference Room",
        description: "Enter our main conference room",
        position: { phi: Math.PI / 2, theta: Math.PI / 4 },
        type: "navigation",
        targetScene: "conference-room"
      },
      {
        id: "to-office",
        title: "Open Office",
        description: "Explore our open office workspace",
        position: { phi: Math.PI / 2, theta: Math.PI / 2 },
        type: "navigation",
        targetScene: "office-space"
      }
    ]
  },
  {
    id: "conference-room",
    name: "Conference Room",
    image: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?q=80&w=3270&auto=format&fit=crop",
    position: { x: 75, y: 50 },
    connections: ["hallway"],
    hotspots: [
      {
        id: "conference-table",
        title: "Conference Table",
        description: "Our state-of-the-art conference table features built-in charging stations and video conferencing capabilities.",
        position: { phi: Math.PI / 2, theta: 0 },
        type: "info"
      },
      {
        id: "presentation-screen",
        title: "Presentation Screen",
        description: "4K display with wireless connection for seamless presentations from any device.",
        position: { phi: Math.PI / 2, theta: Math.PI / 3 },
        type: "info"
      },
      {
        id: "back-to-hallway",
        title: "Back to Hallway",
        description: "Return to the main hallway",
        position: { phi: Math.PI / 2, theta: -Math.PI / 2 },
        type: "navigation",
        targetScene: "hallway"
      }
    ]
  },
  {
    id: "waiting-area",
    name: "Waiting Area",
    image: "https://images.unsplash.com/photo-1600508774634-4e11d34730e2?q=80&w=3270&auto=format&fit=crop",
    position: { x: 25, y: 25 },
    connections: ["reception"],
    hotspots: [
      {
        id: "coffee-station",
        title: "Coffee Station",
        description: "Help yourself to complimentary coffee, tea, and refreshments while you wait.",
        position: { phi: Math.PI / 2, theta: Math.PI / 4 },
        type: "info"
      },
      {
        id: "magazines",
        title: "Reading Materials",
        description: "Browse through our selection of magazines and company publications.",
        position: { phi: Math.PI / 2, theta: -Math.PI / 4 },
        type: "info"
      },
      {
        id: "back-to-reception",
        title: "Back to Reception",
        description: "Return to the reception area",
        position: { phi: Math.PI / 2, theta: Math.PI / 2 },
        type: "navigation",
        targetScene: "reception"
      }
    ]
  },
  {
    id: "office-space",
    name: "Open Office",
    image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?q=80&w=3270&auto=format&fit=crop",
    position: { x: 75, y: 75 },
    connections: ["hallway"],
    hotspots: [
      {
        id: "workstations",
        title: "Open Workstations",
        description: "Our ergonomic workstations feature adjustable standing desks and premium chairs for maximum comfort.",
        position: { phi: Math.PI / 2, theta: 0 },
        type: "info"
      },
      {
        id: "collaboration-area",
        title: "Collaboration Area",
        description: "Informal meeting spaces designed for team collaboration and brainstorming sessions.",
        position: { phi: Math.PI / 2, theta: Math.PI / 3 },
        type: "info"
      },
      {
        id: "back-to-hallway-2",
        title: "Back to Hallway",
        description: "Return to the main hallway",
        position: { phi: Math.PI / 2, theta: -Math.PI / 2 },
        type: "navigation",
        targetScene: "hallway"
      }
    ]
  }
];

// Helper to find a scene by ID
export const getSceneById = (id: string): Scene | undefined => {
  return tourData.find(scene => scene.id === id);
};
