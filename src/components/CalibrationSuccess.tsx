
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";

const CalibrationSuccess: React.FC = () => {
  const { setStep } = useEyeTracking();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-500">
            <CheckCircle size={40} />
          </div>
          <CardTitle className="text-3xl font-bold text-green-600">Calibration Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-lg">
            Your eye calibration was successful. You're ready to start tracking your website interactions.
          </p>
          
          <div className="mt-6 bg-secondary p-4 rounded-lg">
            <h3 className="font-semibold">What's Next?</h3>
            <p className="text-sm mt-1">
              Enter a website URL to start tracking eye movements and generate detailed heatmaps of user interaction.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button 
            onClick={() => setStep("website")}
            size="lg"
            className="gap-2"
          >
            Continue with Website Eye Tracking <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CalibrationSuccess;
