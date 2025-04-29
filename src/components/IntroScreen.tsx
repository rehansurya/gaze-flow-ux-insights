
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";

const IntroScreen: React.FC = () => {
  const { setStep } = useEyeTracking();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Eye size={32} />
          </div>
          <CardTitle className="text-3xl font-bold">GazeFlow UX Insights</CardTitle>
          <CardDescription className="text-lg mt-2">
            Analyze user experience with advanced eye tracking technology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg">
            GazeFlow helps you understand how users interact with your website by tracking their 
            eye movements and generating detailed heatmaps.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Eye Calibration</h3>
              <p className="text-sm">Quick and accurate calibration for precise tracking</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Live Tracking</h3>
              <p className="text-sm">Real-time visualization of eye gaze on any website</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Heatmap Analysis</h3>
              <p className="text-sm">Detailed heatmaps showing areas of user attention</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-8">
          <Button 
            size="lg" 
            className="w-full max-w-xs text-lg" 
            onClick={() => setStep("calibration")}
          >
            Start Testing Your Website
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IntroScreen;
