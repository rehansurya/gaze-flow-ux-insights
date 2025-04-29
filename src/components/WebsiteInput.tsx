
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useEyeTracking } from "@/contexts/EyeTrackingContext";
import { Play } from "lucide-react";
import gazeRecorderService from "@/services/GazeRecorderService";

const WebsiteInput: React.FC = () => {
  const { websiteUrl, setWebsiteUrl, setStep, setIsRecording } = useEyeTracking();
  const [inputUrl, setInputUrl] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const validateUrl = (url: string) => {
    try {
      // Add https:// if not present
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }
      new URL(url);
      return url;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validatedUrl = validateUrl(inputUrl);
    
    if (validatedUrl) {
      setWebsiteUrl(validatedUrl);
      setIsValidUrl(true);
      setShowPreview(true);
    } else {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive",
      });
    }
  };

  const startTracking = () => {
    // Configure GazeRecorder API
    gazeRecorderService.setFps(30); // Set higher FPS for better tracking
    
    // Start recording
    setIsRecording(true);
    setStep("tracking");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Website URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
            <Input
              type="text"
              placeholder="Enter website URL (e.g., example.com)"
              className="flex-1"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            <Button type="submit">Submit</Button>
          </form>

          {showPreview && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-medium">Website Preview</h3>
              <div className="relative bg-gray-100 rounded border h-80 overflow-hidden">
                <iframe
                  src={websiteUrl}
                  className="w-full h-full"
                  title="Website Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          )}
        </CardContent>
        {isValidUrl && (
          <CardFooter className="flex justify-center pb-6">
            <Button 
              onClick={startTracking}
              size="lg"
              className="gap-2"
            >
              Start Eye Tracking <Play size={16} />
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default WebsiteInput;
