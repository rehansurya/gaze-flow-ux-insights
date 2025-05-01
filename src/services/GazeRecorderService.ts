
interface GazeData {
  x: number;
  y: number;
  state: number;
}

// Define GazeCloudAPI types based on their documentation
declare global {
  interface Window {
    GazeCloudAPI: {
      StartEyeTracking: () => void;
      StopEyeTracking: () => void;
      OnCalibrationComplete: () => void;
      OnCamDenied: () => void;
      OnError: (error: string) => void;
      OnResult: (gaze: GazeData) => void;
      SetFps: (fps: number) => void;
    };
  }
}

class GazeRecorderService {
  private onGazeCallback: ((x: number, y: number) => void) | null = null;
  private onCalibrationCompleteCallback: (() => void) | null = null;
  private onCameraPermissionDeniedCallback: (() => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private isTracking = false;
  private gazeData: Array<{ x: number, y: number, timestamp: number }> = [];

  constructor() {
    // Initialize the callbacks for the GazeCloudAPI
    this.setupCallbacks();
  }

  private setupCallbacks() {
    if (window.GazeCloudAPI) {
      window.GazeCloudAPI.OnResult = (gaze: GazeData) => {
        if (this.onGazeCallback && gaze.state !== 0) {
          this.onGazeCallback(gaze.x, gaze.y);
          
          // Store gaze data for recording
          this.gazeData.push({
            x: gaze.x,
            y: gaze.y,
            timestamp: Date.now()
          });
        }
      };

      window.GazeCloudAPI.OnCalibrationComplete = () => {
        console.log('Calibration complete');
        if (this.onCalibrationCompleteCallback) {
          this.onCalibrationCompleteCallback();
        }
      };

      window.GazeCloudAPI.OnCamDenied = () => {
        console.error('Camera access denied');
        if (this.onCameraPermissionDeniedCallback) {
          this.onCameraPermissionDeniedCallback();
        }
      };

      window.GazeCloudAPI.OnError = (error: string) => {
        console.error('GazeCloudAPI error:', error);
        if (this.onErrorCallback) {
          this.onErrorCallback(error);
        }
      };
    } else {
      console.error('GazeCloudAPI not found. Make sure the script is loaded correctly.');
    }
  }

  public startTracking() {
    if (!this.isTracking && window.GazeCloudAPI) {
      // Clear previous gaze data
      this.gazeData = [];
      
      // Set higher FPS for smoother tracking
      window.GazeCloudAPI.SetFps(30);
      
      // Start tracking
      window.GazeCloudAPI.StartEyeTracking();
      this.isTracking = true;
    }
  }

  public stopTracking() {
    if (this.isTracking && window.GazeCloudAPI) {
      window.GazeCloudAPI.StopEyeTracking();
      this.isTracking = false;
      console.log(`Tracking stopped with ${this.gazeData.length} gaze points collected`);
    }
  }

  public setFps(fps: number) {
    if (window.GazeCloudAPI) {
      window.GazeCloudAPI.SetFps(fps);
    }
  }

  public getGazeData() {
    return this.gazeData;
  }

  public onGaze(callback: (x: number, y: number) => void) {
    this.onGazeCallback = callback;
  }

  public onCalibrationComplete(callback: () => void) {
    this.onCalibrationCompleteCallback = callback;
    if (window.GazeCloudAPI) {
      window.GazeCloudAPI.OnCalibrationComplete = callback;
    }
  }

  public onCameraPermissionDenied(callback: () => void) {
    this.onCameraPermissionDeniedCallback = callback;
  }

  public onError(callback: (error: string) => void) {
    this.onErrorCallback = callback;
  }
}

// Create a singleton instance
const gazeRecorderService = new GazeRecorderService();
export default gazeRecorderService;
