export type ConnectedDeviceStatus = 'available' | 'soon' | 'optional_later';

export type ConnectedDevice = {
  id: string;
  name: string;
  status: ConnectedDeviceStatus;
  dataPoints: string[];
};

export const WHOOP_TOKEN_STORAGE_KEY = 'whoop_oauth_token';

export const CONNECTED_DEVICES: ConnectedDevice[] = [
  {
    id: 'whoop',
    name: 'WHOOP',
    status: 'available',
    dataPoints: ['Recovery', 'Sleep', 'Strain', 'Heart rate'],
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    status: 'available',
    dataPoints: ['Steps', 'Sleep', 'Heart rate', 'HRV'],
  },
  {
    id: 'apple-health',
    name: 'Apple Health',
    status: 'soon',
    dataPoints: ['Steps', 'Heart rate', 'Sleep', 'Workouts'],
  },
  {
    id: 'garmin',
    name: 'Garmin',
    status: 'soon',
    dataPoints: ['Workouts', 'Heart rate', 'Sleep', 'Stress', 'Body Battery'],
  },
  {
    id: 'google-fit-health-connect',
    name: 'Google Fit / Health Connect',
    status: 'soon',
    dataPoints: ['Steps', 'Activity', 'Heart rate', 'Sleep'],
  },
  {
    id: 'strava',
    name: 'Strava',
    status: 'optional_later',
    dataPoints: ['Activities', 'Routes', 'Running', 'Cycling'],
  },
  {
    id: 'polar',
    name: 'Polar',
    status: 'soon',
    dataPoints: ['Training', 'Heart rate', 'Recovery'],
  },
  {
    id: 'suunto',
    name: 'Suunto',
    status: 'soon',
    dataPoints: ['Activities', 'Routes', 'Training'],
  },
  {
    id: 'oura',
    name: 'Oura',
    status: 'soon',
    dataPoints: ['Sleep', 'Readiness', 'HRV', 'Recovery'],
  },
  {
    id: 'coros',
    name: 'COROS',
    status: 'soon',
    dataPoints: ['Running', 'Training', 'Recovery'],
  },
];

export const CONNECTED_DEVICE_STATUS_LABELS: Record<ConnectedDeviceStatus, string> = {
  available: 'Beschikbaar',
  soon: 'Binnenkort',
  optional_later: 'Later optioneel',
};
