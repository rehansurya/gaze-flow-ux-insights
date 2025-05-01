
import React, { useEffect, useState, useRef } from "react";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";
import gazeRecorderService from "@/services/GazeRecorderService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { StopCircle } from "lucide-react";

const TrackingScreen: React.FC = () => {
  const { 
    websiteUrl, 
    isRecording, 
    setIsRecording, 
    setStep, 
    setRecordingUrl, 
    setHeatmapUrl,
    setGazePrediction,
    gazePrediction
  } = useEyeTracking();
  
  const [gazePoints, setGazePoints] = useState<Array<{ x: number, y: number, timestamp: number }>>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [showGazeDot, setShowGazeDot] = useState(true);
  const { toast } = useToast();

  // Start recording when component mounts
  useEffect(() => {
    const startRecording = () => {
      startTimeRef.current = Date.now();
      
      // Setup escape key handler to stop recording
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          stopRecording();
        }
      };
      
      window.addEventListener("keydown", handleKeyDown);
      
      // Start the eye tracking with GazeRecorder API
      try {
        gazeRecorderService.onGaze((x, y) => {
          // Update gaze prediction for UI visualization
          setGazePrediction({ x, y });
          setShowGazeDot(true);
          
          // Record gaze point with timestamp for heatmap generation
          setGazePoints(prev => [
            ...prev, 
            { x, y, timestamp: Date.now() - startTimeRef.current }
          ]);
        });
        
        gazeRecorderService.startTracking();
      } catch (error) {
        console.error("Failed to start eye tracking:", error);
        toast({
          title: "Error",
          description: "Failed to start eye tracking. Please try again.",
          variant: "destructive"
        });
        stopRecording();
      }
      
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        gazeRecorderService.stopTracking();
      };
    };

    if (isRecording) {
      return startRecording();
    }
  }, [isRecording, setGazePrediction, toast]);

  const stopRecording = () => {
    setIsRecording(false);
    gazeRecorderService.stopTracking();

    // Generate recording URLs using the captured gaze points
    if (gazePoints.length > 0) {
      // In a real implementation, this would generate actual recordings based on gazePoints
      // Here we're using placeholder URLs but in real app you'd process the gazePoints data
      setRecordingUrl("/placeholder.svg");
      setHeatmapUrl("/placeholder.svg");
      console.log(`Generated recording with ${gazePoints.length} gaze points`);
      toast({
        title: "Recording Complete",
        description: `Captured ${gazePoints.length} gaze points for analysis.`
      });
    } else {
      toast({
        title: "Recording Empty",
        description: "No gaze points were captured during the session.",
        variant: "destructive"
      });
    }
    
    setStep("results");
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
      
      {/* Red dot that follows the gaze - always visible when gazePrediction exists */}
      {gazePrediction && showGazeDot && (
        <div 
          className="absolute w-5 h-5 rounded-full bg-red-500 pointer-events-none" 
          style={{
            left: `${gazePrediction.x}px`,
            top: `${gazePrediction.y}px`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.7,
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
            zIndex: 9999
          }}
        />
      )}
      
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-50">
        <Button
          variant="destructive"
          size="lg"
          className="gap-2"
          onClick={stopRecording}
        >
          <StopCircle size={16} /> Stop Tracking
        </Button>
        <div className="bg-black bg-opacity-70 text-white p-2 rounded-md text-sm">
          Press ESC to stop recording
        </div>
      </div>
    </div>
  );
};

export default TrackingScreen;
