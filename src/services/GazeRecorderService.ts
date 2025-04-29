
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

  constructor() {
    // Initialize the callbacks for the GazeCloudAPI
    this.setupCallbacks();
  }

  private setupCallbacks() {
    window.GazeCloudAPI.OnResult = (gaze: GazeData) => {
      if (this.onGazeCallback && gaze.state !== 0) {
        this.onGazeCallback(gaze.x, gaze.y);
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
  }

  public startTracking() {
    if (!this.isTracking) {
      window.GazeCloudAPI.StartEyeTracking();
      this.isTracking = true;
    }
  }

  public stopTracking() {
    if (this.isTracking) {
      window.GazeCloudAPI.StopEyeTracking();
      this.isTracking = false;
    }
  }

  public setFps(fps: number) {
    window.GazeCloudAPI.SetFps(fps);
  }

  public onGaze(callback: (x: number, y: number) => void) {
    this.onGazeCallback = callback;
  }

  public onCalibrationComplete(callback: () => void) {
    this.onCalibrationCompleteCallback = callback;
    window.GazeCloudAPI.OnCalibrationComplete = callback;
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
