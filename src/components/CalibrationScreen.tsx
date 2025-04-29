
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";
import { Eye, ArrowRight } from "lucide-react";
import gazeRecorderService from "@/services/GazeRecorderService";
import { useToast } from "@/components/ui/use-toast";

const CalibrationScreen: React.FC = () => {
  const { 
    calibrationStep, 
    setCalibrationStep, 
    calibrationMode,
    setStep,
    setCalibrationComplete,
    requestCameraPermission,
    cameraPermission
  } = useEyeTracking();
  
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const { toast } = useToast();

  // Set up GazeRecorder API callbacks
  useEffect(() => {
    gazeRecorderService.onCalibrationComplete(() => {
      console.log("Calibration completed successfully");
      setCalibrationComplete(true);
      gazeRecorderService.stopTracking();
      setStep("success");
    });

    gazeRecorderService.onCameraPermissionDenied(() => {
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access to use eye tracking features.",
        variant: "destructive"
      });
      setCalibrationStep(1);
    });

    gazeRecorderService.onError((error) => {
      toast({
        title: "Error",
        description: `Eye tracking error: ${error}`,
        variant: "destructive"
      });
    });

    // Clean up when component unmounts
    return () => {
      if (calibrationStep === 3) {
        gazeRecorderService.stopTracking();
      }
    };
  }, [setCalibrationComplete, setStep, toast, calibrationStep, setCalibrationStep]);

  // Progress simulation for the calibration process
  useEffect(() => {
    let progressInterval: number | null = null;
    
    if (calibrationStep === 3) {
      let progress = 0;
      progressInterval = window.setInterval(() => {
        progress += 1;
        if (progress > 100) {
          if (progressInterval) {
            clearInterval(progressInterval);
          }
          return;
        }
        setCalibrationProgress(progress);
      }, 300);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [calibrationStep]);

  const handleNextStep = async () => {
    if (calibrationStep === 1) {
      const hasPermission = await requestCameraPermission();
      if (hasPermission) {
        setCalibrationStep(2);
      }
    } else if (calibrationStep === 2) {
      setCalibrationStep(3);
      setCalibrationProgress(0);
      // Start the GazeRecorder API calibration
      try {
        gazeRecorderService.startTracking();
      } catch (error) {
        console.error("Failed to start eye tracking:", error);
        toast({
          title: "Error",
          description: "Failed to start eye tracking. Please try again.",
          variant: "destructive"
        });
      }
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
                Let's calibrate your eye tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary p-6 rounded-lg text-center">
                <p className="font-medium">
                  In the next step, you'll see dots appearing on your screen for calibration
                </p>
                <p className="text-sm mt-2">
                  Please follow the dots with your eyes as they move across the screen.
                  Keep your head still during the calibration process.
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
                Follow the dots with your eyes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative h-60">
              {/* The GazeRecorderAPI will handle displaying the calibration dots */}
              <div className="absolute bottom-0 left-0 w-full">
                <Progress value={calibrationProgress} className="h-2" />
                <p className="text-center mt-2 text-sm text-muted-foreground">
                  Calibration in progress...
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
