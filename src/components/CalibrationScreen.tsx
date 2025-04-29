
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";
import { Eye, ArrowRight } from "lucide-react";

const CalibrationScreen: React.FC = () => {
  const { 
    calibrationStep, 
    setCalibrationStep, 
    calibrationMode, 
    setCalibrationMode,
    requestCameraPermission, 
    cameraPermission, 
    setStep,
    setCalibrationComplete 
  } = useEyeTracking();
  
  const [dotPosition, setDotPosition] = useState({ x: '50%', y: '50%' });
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [showDot, setShowDot] = useState(false);
  const calibrationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const positionIndexRef = useRef(0);

  // Predefined positions for the calibration dots
  const positions = [
    { x: '20%', y: '20%' },
    { x: '80%', y: '20%' },
    { x: '50%', y: '50%' },
    { x: '20%', y: '80%' },
    { x: '80%', y: '80%' }
  ];

  // Clean up any timers when component unmounts
  useEffect(() => {
    return () => {
      if (calibrationTimerRef.current) {
        clearTimeout(calibrationTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Only run the calibration sequence if we're on step 3 and showing dots
    if (calibrationStep === 3 && showDot) {
      // Clear any existing timer to avoid multiple timers
      if (calibrationTimerRef.current) {
        clearTimeout(calibrationTimerRef.current);
      }
      
      const totalPositions = positions.length * 2; // Once for light mode, once for dark mode
      
      // Process the next dot position
      const processDotPosition = () => {
        // If we've completed all positions in both modes
        if (positionIndexRef.current >= totalPositions) {
          setCalibrationComplete(true);
          setStep("success");
          return;
        }
        
        // Calculate current position index within the positions array
        const currentPositionIndex = positionIndexRef.current % positions.length;
        
        // Set the dot to the current position
        setDotPosition(positions[currentPositionIndex]);
        
        // Switch mode halfway through
        if (positionIndexRef.current === positions.length) {
          setCalibrationMode(calibrationMode === 'light' ? 'dark' : 'light');
        }
        
        // Update progress
        const newProgress = Math.floor(((positionIndexRef.current + 1) / totalPositions) * 100);
        setCalibrationProgress(newProgress);
        
        // Increment position index
        positionIndexRef.current += 1;
        
        // Schedule the next position after 2 seconds
        calibrationTimerRef.current = setTimeout(processDotPosition, 2000);
      };
      
      // Start the sequence
      processDotPosition();
    }
    
    // Clean up function
    return () => {
      if (calibrationTimerRef.current) {
        clearTimeout(calibrationTimerRef.current);
      }
    };
  }, [calibrationStep, showDot, calibrationMode, setCalibrationMode, setStep, setCalibrationComplete]);

  const handleNextStep = async () => {
    if (calibrationStep === 1) {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        setCalibrationStep(2);
      }
    } else if (calibrationStep === 2) {
      setCalibrationStep(3);
      // Reset position index when starting calibration
      positionIndexRef.current = 0;
      setCalibrationProgress(0);
      setShowDot(true);
    }
  };

  const renderStep = () => {
    switch (calibrationStep) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Step 1: Camera Access</CardTitle>
              <CardDescription>
                We need to access your camera to track your eye movements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary p-6 rounded-lg text-center">
                <Eye size={64} className="mx-auto mb-4 text-primary" />
                <p className="font-medium">
                  Please keep your head still and allow camera access when prompted
                </p>
                <p className="text-sm mt-2 text-muted-foreground">
                  Your camera will only be used for eye tracking in this browser session
                </p>
              </div>
            </CardContent>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Step 2: Ready for Calibration</CardTitle>
              <CardDescription>
                Let's calibrate your eye tracking in both light and dark modes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary p-6 rounded-lg text-center">
                <p className="font-medium">
                  In the next step, you'll see dots appearing on your screen
                </p>
                <p className="text-sm mt-2">
                  Please follow the dots with your eyes as they move. 
                  The calibration will happen in both light and dark modes.
                </p>
                <div className="mt-4">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 rounded-full bg-eyetrack-purple"></div>
                    <span>Follow these dots with your eyes</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        );
      case 3:
        return (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Step 3: Calibrating</CardTitle>
              <CardDescription>
                Follow the dot with your eyes - {calibrationMode} mode
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative h-60">
              <div 
                className="calibration-dot absolute w-6 h-6 rounded-full bg-eyetrack-purple transition-all duration-500"
                style={{ 
                  left: dotPosition.x, 
                  top: dotPosition.y, 
                  transform: 'translate(-50%, -50%)' 
                }}
              ></div>
              <div className="absolute bottom-0 left-0 w-full">
                <Progress value={calibrationProgress} className="h-2" />
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  Calibration Progress: {calibrationProgress}%
                </p>
              </div>
            </CardContent>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 ${calibrationMode === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Card className={`w-full max-w-2xl shadow-lg ${calibrationMode === 'dark' ? 'bg-gray-800 text-white' : ''}`}>
        {renderStep()}
        {calibrationStep !== 3 && (
          <CardFooter className="flex justify-center pb-6">
            <Button 
              onClick={handleNextStep} 
              disabled={calibrationStep === 1 && cameraPermission}
              size="lg"
              className="gap-2"
            >
              Continue <ArrowRight size={16} />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default CalibrationScreen;
