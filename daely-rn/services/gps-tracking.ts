import * as Location from 'expo-location';
import type { GpsRoutePoint, GpsPermissionStatus } from './activity-storage';

export interface GpsTrackingConfig {
  minAccuracy?: number; // Minimum accuracy in meters to accept a point
  minTimeBetweenUpdates?: number; // Minimum time between location updates (ms)
  minDistanceBetweenUpdates?: number; // Minimum distance between updates (meters)
}

export interface GpsTrackingState {
  isActive: boolean;
  isPaused: boolean;
  permissionStatus: GpsPermissionStatus;
  routePoints: GpsRoutePoint[];
  distanceMeters: number;
  averageSpeedKmh: number | null;
  maxSpeedKmh: number | null;
  currentSpeedKmh: number | null;
  startTime: number | null;
  lastLocation: Location.LocationObject | null;
}

const DEFAULT_CONFIG: GpsTrackingConfig = {
  minAccuracy: 50, // Reject points with accuracy worse than 50m
  minTimeBetweenUpdates: 1000, // Update at most once per second
  minDistanceBetweenUpdates: 5, // Only update if moved at least 5m
};

class GpsTrackingService {
  private subscription: Location.LocationSubscription | null = null;
  private state: GpsTrackingState = {
    isActive: false,
    isPaused: false,
    permissionStatus: 'undetermined',
    routePoints: [],
    distanceMeters: 0,
    averageSpeedKmh: null,
    maxSpeedKmh: null,
    currentSpeedKmh: null,
    startTime: null,
    lastLocation: null,
  };
  private config: GpsTrackingConfig;
  private stateListeners: Set<() => void> = new Set();

  constructor(config: GpsTrackingConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private notifyStateChange() {
    this.stateListeners.forEach(listener => listener());
  }

  getState(): GpsTrackingState {
    return { ...this.state };
  }

  subscribeToState(listener: () => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  async requestPermission(): Promise<GpsPermissionStatus> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === Location.PermissionStatus.GRANTED) {
        this.state.permissionStatus = 'granted';
      } else if (status === Location.PermissionStatus.DENIED) {
        this.state.permissionStatus = 'denied';
      } else {
        this.state.permissionStatus = 'undetermined';
      }
      
      this.notifyStateChange();
      return this.state.permissionStatus;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      this.state.permissionStatus = 'unavailable';
      this.notifyStateChange();
      return 'unavailable';
    }
  }

  async checkPermission(): Promise<GpsPermissionStatus> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      
      if (status === Location.PermissionStatus.GRANTED) {
        this.state.permissionStatus = 'granted';
      } else if (status === Location.PermissionStatus.DENIED) {
        this.state.permissionStatus = 'denied';
      } else {
        this.state.permissionStatus = 'undetermined';
      }
      
      this.notifyStateChange();
      return this.state.permissionStatus;
    } catch (error) {
      console.error('Error checking location permission:', error);
      this.state.permissionStatus = 'unavailable';
      this.notifyStateChange();
      return 'unavailable';
    }
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private processLocationUpdate(location: Location.LocationObject) {
    if (this.state.isPaused) return;

    // Check accuracy
    if (this.config.minAccuracy && location.coords.accuracy > this.config.minAccuracy) {
      console.log('Location accuracy too low:', location.coords.accuracy);
      return;
    }

    const timestamp = Date.now();
    const speedMps = location.coords.speed ?? undefined;

    // Create route point
    const routePoint: GpsRoutePoint = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp,
      speedMps,
    };

    // Calculate distance from last point
    if (this.state.lastLocation) {
      const distance = this.calculateDistance(
        this.state.lastLocation.coords.latitude,
        this.state.lastLocation.coords.longitude,
        location.coords.latitude,
        location.coords.longitude
      );

      // Only update if moved enough
      if (distance >= (this.config.minDistanceBetweenUpdates ?? 0)) {
        this.state.distanceMeters += distance;

        // Update speed metrics
        if (speedMps !== undefined && speedMps >= 0) {
          const speedKmh = speedMps * 3.6;
          this.state.currentSpeedKmh = speedKmh;
          
          if (this.state.maxSpeedKmh === null || speedKmh > this.state.maxSpeedKmh) {
            this.state.maxSpeedKmh = speedKmh;
          }
        }
      }
    }

    this.state.lastLocation = location;
    this.state.routePoints.push(routePoint);

    // Calculate average speed
    if (this.state.startTime) {
      const elapsedSeconds = (timestamp - this.state.startTime) / 1000;
      if (elapsedSeconds > 0 && this.state.distanceMeters > 0) {
        this.state.averageSpeedKmh = (this.state.distanceMeters / elapsedSeconds) * 3.6;
      }
    }

    this.notifyStateChange();
  }

  async start(): Promise<boolean> {
    if (this.state.isActive) {
      console.warn('GPS tracking already active');
      return true;
    }

    // Check permission first
    const permission = await this.checkPermission();
    if (permission !== 'granted') {
      console.warn('Location permission not granted:', permission);
      return false;
    }

    try {
      this.state.isActive = true;
      this.state.isPaused = false;
      this.state.startTime = Date.now();
      this.state.routePoints = [];
      this.state.distanceMeters = 0;
      this.state.averageSpeedKmh = null;
      this.state.maxSpeedKmh = null;
      this.state.currentSpeedKmh = null;
      this.state.lastLocation = null;

      this.subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: this.config.minTimeBetweenUpdates,
          distanceInterval: this.config.minDistanceBetweenUpdates,
        },
        (location) => {
          this.processLocationUpdate(location);
        }
      );

      this.notifyStateChange();
      return true;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      this.state.isActive = false;
      this.notifyStateChange();
      return false;
    }
  }

  pause(): void {
    if (!this.state.isActive) return;
    
    this.state.isPaused = true;
    this.state.currentSpeedKmh = null;
    this.notifyStateChange();
  }

  resume(): void {
    if (!this.state.isActive) return;
    
    this.state.isPaused = false;
    this.notifyStateChange();
  }

  async stop(): Promise<void> {
    if (!this.state.isActive) return;

    try {
      if (this.subscription) {
        await this.subscription.remove();
        this.subscription = null;
      }

      this.state.isActive = false;
      this.state.isPaused = false;
      this.state.currentSpeedKmh = null;
      
      this.notifyStateChange();
    } catch (error) {
      console.error('Error stopping GPS tracking:', error);
    }
  }

  reset(): void {
    this.state = {
      isActive: false,
      isPaused: false,
      permissionStatus: 'undetermined',
      routePoints: [],
      distanceMeters: 0,
      averageSpeedKmh: null,
      maxSpeedKmh: null,
      currentSpeedKmh: null,
      startTime: null,
      lastLocation: null,
    };
    this.notifyStateChange();
  }

  cleanup(): void {
    this.stop();
    this.reset();
    this.stateListeners.clear();
  }
}

// Singleton instance
let gpsTrackingServiceInstance: GpsTrackingService | null = null;

export function getGpsTrackingService(config?: GpsTrackingConfig): GpsTrackingService {
  if (!gpsTrackingServiceInstance) {
    gpsTrackingServiceInstance = new GpsTrackingService(config);
  }
  return gpsTrackingServiceInstance;
}