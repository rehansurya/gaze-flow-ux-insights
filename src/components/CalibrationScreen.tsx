
import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (calibrationStep === 3 && showDot) {
      const positions = [
        { x: '20%', y: '20%' },
        { x: '80%', y: '20%' },
        { x: '50%', y: '50%' },
        { x: '20%', y: '80%' },
        { x: '80%', y: '80%' }
      ];
      
      let currentPosition = 0;
      const totalSteps = positions.length * 2; // For each position in both light and dark modes
      let progress = 0;
      
      const interval = setInterval(() => {
        if (progress >= totalSteps) {
          clearInterval(interval);
          // Complete calibration
          setTimeout(() => {
            setCalibrationComplete(true);
            setStep("success");
          }, 1000);
          return;
        }

        setDotPosition(positions[currentPosition % positions.length]);
        currentPosition++;
        
        // Update progress
        progress++;
        setCalibrationProgress(Math.floor((progress / totalSteps) * 100));
        
        // Toggle mode halfway through
        if (progress === Math.floor(totalSteps / 2)) {
          setCalibrationMode(calibrationMode === 'light' ? 'dark' : 'light');
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [calibrationStep, showDot, calibrationMode, setCalibrationMode, setStep, setCalibrationComplete]);

  const handleNextStep = async () => {
    if (calibrationStep === 1) {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        setCalibrationStep(2);
      }
    } else if (calibrationStep === 2) {
      setCalibrationStep(3);
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
                className="calibration-dot w-6 h-6 absolute" 
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
