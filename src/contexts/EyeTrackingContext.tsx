
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/components/ui/use-toast";

export type CalibrationMode = "light" | "dark";
export type AppStep = "intro" | "calibration" | "success" | "website" | "tracking" | "results";

interface EyeTrackingContextType {
  step: AppStep;
  setStep: (step: AppStep) => void;
  calibrationMode: CalibrationMode;
  setCalibrationMode: (mode: CalibrationMode) => void;
  calibrationStep: number;
  setCalibrationStep: (step: number) => void;
  websiteUrl: string;
  setWebsiteUrl: (url: string) => void;
  recordingUrl: string;
  setRecordingUrl: (url: string) => void;
  heatmapUrl: string;
  setHeatmapUrl: (url: string) => void;
  cameraPermission: boolean;
  setCameraPermission: (permission: boolean) => void;
  calibrationComplete: boolean;
  setCalibrationComplete: (complete: boolean) => void;
  requestCameraPermission: () => Promise<boolean>;
  gazePrediction: { x: number, y: number } | null;
  setGazePrediction: (prediction: { x: number, y: number } | null) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
}

const EyeTrackingContext = createContext<EyeTrackingContextType | null>(null);

interface EyeTrackingProviderProps {
  children: ReactNode;
}

export const EyeTrackingProvider: React.FC<EyeTrackingProviderProps> = ({ children }) => {
  const [step, setStep] = useState<AppStep>("intro");
  const [calibrationMode, setCalibrationMode] = useState<CalibrationMode>("light");
  const [calibrationStep, setCalibrationStep] = useState<number>(1);
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [recordingUrl, setRecordingUrl] = useState<string>("");
  const [heatmapUrl, setHeatmapUrl] = useState<string>("");
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [calibrationComplete, setCalibrationComplete] = useState<boolean>(false);
  const [gazePrediction, setGazePrediction] = useState<{ x: number, y: number } | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Stop the tracks immediately after getting permission
      stream.getTracks().forEach((track) => track.stop());
      
      setCameraPermission(true);
      return true;
    } catch (err) {
      console.error("Failed to get camera permission:", err);
      toast({
        title: "Camera Access Failed",
        description: "Please allow camera access to use eye tracking features.",
        variant: "destructive"
      });
      setCameraPermission(false);
      return false;
    }
  };

  // Listen for escape key to stop recording
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isRecording) {
        setIsRecording(false);
        setStep("results");
        // In a real app, we would save recording data here
        // For now, we'll use placeholder URLs for demo
        setRecordingUrl("/placeholder.svg");
        setHeatmapUrl("/placeholder.svg");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRecording]);

  return (
    <EyeTrackingContext.Provider
      value={{
        step,
        setStep,
        calibrationMode,
        setCalibrationMode,
        calibrationStep,
        setCalibrationStep,
        websiteUrl,
        setWebsiteUrl,
        recordingUrl,
        setRecordingUrl,
        heatmapUrl,
        setHeatmapUrl,
        cameraPermission,
        setCameraPermission,
        calibrationComplete,
        setCalibrationComplete,
        requestCameraPermission,
        gazePrediction,
        setGazePrediction,
        isRecording,
        setIsRecording
      }}
    >
      {children}
    </EyeTrackingContext.Provider>
  );
};

export const useEyeTracking = (): EyeTrackingContextType => {
  const context = useContext(EyeTrackingContext);
  if (!context) {
    throw new Error("useEyeTracking must be used within an EyeTrackingProvider");
  }
  return context;
};
