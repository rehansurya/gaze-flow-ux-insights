
import React, { useEffect, useState, useRef } from "react";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";

const TrackingScreen: React.FC = () => {
  const { 
    websiteUrl, 
    isRecording, 
    setIsRecording, 
    setStep, 
    setRecordingUrl, 
    setHeatmapUrl,
    gazePrediction,
    setGazePrediction
  } = useEyeTracking();
  
  const [gazePoints, setGazePoints] = useState<Array<{ x: number, y: number, timestamp: number }>>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Simulate eye tracking with more realistic behavior
  const simulateGazePrediction = () => {
    // Using mouse position as a proxy for gaze in this simulation
    // In a real implementation, this would use actual eye tracking data from the webcam
    const handleMouseMove = (e: MouseEvent) => {
      // Add some subtle randomness to simulate natural eye movement
      const jitter = 5;
      const randomX = Math.random() * jitter - jitter/2;
      const randomY = Math.random() * jitter - jitter/2;
      
      const newGaze = {
        x: e.clientX + randomX,
        y: e.clientY + randomY
      };
      
      setGazePrediction(newGaze);
      
      // Record gaze point with timestamp for heatmap generation
      if (isRecording) {
        setGazePoints(prev => [
          ...prev, 
          {...newGaze, timestamp: Date.now() - startTimeRef.current}
        ]);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    // Clean up function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  };

  // Start recording when component mounts
  useEffect(() => {
    if (isRecording) {
      startTimeRef.current = Date.now();
      
      // Setup escape key handler to stop recording
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsRecording(false);
          setStep("results");
          
          // Generate placeholder URLs for the recording and heatmap
          // In a real implementation, this would generate actual recordings
          setRecordingUrl("/placeholder.svg");
          setHeatmapUrl("/placeholder.svg");
        }
      };
      
      window.addEventListener("keydown", handleKeyDown);
      
      // Start the eye tracking simulation
      const cleanupGazeTracking = simulateGazePrediction();
      
      // Render the gaze trail with animation frame
      const renderGazeTrail = () => {
        // Implement rendering of gaze points
        animationRef.current = requestAnimationFrame(renderGazeTrail);
      };
      
      animationRef.current = requestAnimationFrame(renderGazeTrail);
      
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        cleanupGazeTracking();
        
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isRecording, setIsRecording, setStep, setRecordingUrl, setHeatmapUrl]);

  // Render gaze dot
  const renderGazeDot = () => {
    if (!gazePrediction) return null;
    
    return (
      <>
        {/* Main gaze dot */}
        <div 
          className="absolute pointer-events-none z-50"
          style={{
            left: `${gazePrediction.x}px`,
            top: `${gazePrediction.y}px`,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
            transform: 'translate(-50%, -50%)'
          }}
        />
        
        {/* Outer ring */}
        <div 
          className="absolute pointer-events-none z-50 animate-ping"
          style={{
            left: `${gazePrediction.x}px`,
            top: `${gazePrediction.y}px`,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 0, 0, 0.3)',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </>
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <iframe
        ref={iframeRef}
        src={websiteUrl}
        className="w-full h-full border-0"
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
