
import React from "react";
import { EyeTrackingProvider, useEyeTracking } from "@/contexts/EyeTrackingContext";
import IntroScreen from "@/components/IntroScreen";
import CalibrationScreen from "@/components/CalibrationScreen";
import WebsiteInput from "@/components/WebsiteInput";
import TrackingScreen from "@/components/TrackingScreen";
import ResultsScreen from "@/components/ResultsScreen";

const AppContent: React.FC = () => {
  const { step } = useEyeTracking();

  switch (step) {
    case "intro":
      return <IntroScreen />;
    case "website":
      return <WebsiteInput />;
    case "calibration":
      return <CalibrationScreen />;
    case "tracking":
      return <TrackingScreen />;
    case "results":
      return <ResultsScreen />;
    default:
      return <IntroScreen />;
  }
};

const Index: React.FC = () => {
  return (
    <EyeTrackingProvider>
      <AppContent />
    </EyeTrackingProvider>
  );
};

export default Index;
