
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";
import { Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ResultsScreen: React.FC = () => {
  const { recordingUrl, heatmapUrl, setStep, websiteUrl } = useEyeTracking();
  const { toast } = useToast();

  const downloadRecording = () => {
    // In a real app, this would download the actual recording
    toast({
      title: "Downloading Recording",
      description: "Your recording is being prepared for download."
    });
    
    // Create a simulated download for demo purposes
    const a = document.createElement("a");
    a.href = recordingUrl;
    a.download = `eye-tracking-${new Date().toISOString()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Eye Tracking Results for {websiteUrl}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="heatmap" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="heatmap">Attention Heatmap</TabsTrigger>
              <TabsTrigger value="recording">Session Recording</TabsTrigger>
            </TabsList>
            <TabsContent value="heatmap" className="mt-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="text-center p-4 border-b">
                  <h3 className="font-medium">User Attention Heatmap</h3>
                </div>
                <div className="relative h-96">
                  <img
                    src={heatmapUrl}
                    alt="Eye tracking heatmap"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 via-yellow-500/30 to-green-500/30 rounded-b-lg pointer-events-none"></div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="recording" className="mt-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <div className="text-center p-4 border-b">
                  <h3 className="font-medium">Session Recording</h3>
                </div>
                <div className="h-96 bg-black flex items-center justify-center">
                  <video
                    controls
                    className="w-full max-h-full"
                    poster={recordingUrl}
                  >
                    <source src="#" type="video/mp4" />
                    Your browser does not support video playback.
                  </video>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-secondary p-4 rounded-lg">
            <h3 className="font-medium">Analysis Summary</h3>
            <p className="text-sm mt-2">
              This heatmap shows where you focused most of your attention during the session.
              Red areas indicate the highest concentration of focus, yellow areas moderate focus,
              and green areas minimal focus. The recording shows the path your eyes followed while browsing.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pb-6 gap-4">
          <Button 
            variant="outline" 
            onClick={() => setStep("website")}
            className="gap-2"
          >
            <ArrowLeft size={16} /> Test Another Website
          </Button>
          <Button 
            onClick={downloadRecording}
            className="gap-2"
          >
            <Download size={16} /> Download Recording
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsScreen;
