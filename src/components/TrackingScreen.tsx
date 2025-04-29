
import React, { useEffect, useState } from "react";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";

// Simulated eye tracking functionality
const simulateEyeTracking = () => {
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
  };
};

const TrackingScreen: React.FC = () => {
  const { websiteUrl, isRecording, gazePrediction, setGazePrediction } = useEyeTracking();
  const [gazePoints, setGazePoints] = useState<Array<{ x: number, y: number }>>([]);

  // Simulate eye tracking
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      const newGaze = simulateEyeTracking();
      setGazePrediction(newGaze);
      
      // Add to gaze points for heatmap
      setGazePoints(prev => [...prev, newGaze]);
    }, 100);

    return () => {
      clearInterval(interval);
      setGazePrediction(null);
    };
  }, [isRecording, setGazePrediction]);

  // Render gaze dot
  const renderGazeDot = () => {
    if (!gazePrediction) return null;
    
    return (
      <div 
        className="gaze-dot"
        style={{
          left: `${gazePrediction.x}px`,
          top: `${gazePrediction.y}px`,
          width: '20px',
          height: '20px',
          transform: 'translate(-50%, -50%)'
        }}
      />
    );
  };

  return (
    <div className="relative w-screen h-screen">
      <iframe
        src={websiteUrl}
        className="fullscreen-iframe"
        title="Website for Eye Tracking"
        sandbox="allow-same-origin allow-scripts"
      />
      
      {renderGazeDot()}
      
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white p-2 rounded-md text-sm z-50">
        Press ESC to stop recording
      </div>
    </div>
  );
};

export default TrackingScreen;
