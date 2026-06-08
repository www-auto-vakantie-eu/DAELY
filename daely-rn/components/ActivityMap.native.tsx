import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline } from 'react-native-maps';
import type { GpsRoutePoint } from 'services/activity-storage';

interface ActivityMapProps {
  routePoints: GpsRoutePoint[];
}

export default function ActivityMap({ routePoints }: ActivityMapProps) {
  const mapRegion = useMemo(() => {
    if (routePoints.length === 0) return null;

    const latitudes = routePoints.map(p => p.latitude);
    const longitudes = routePoints.map(p => p.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    const latitude = (minLat + maxLat) / 2;
    const longitude = (minLon + maxLon) / 2;
    const latitudeDelta = (maxLat - minLat) * 1.2;
    const longitudeDelta = (maxLon - minLon) * 1.2;

    return {
      latitude,
      longitude,
      latitudeDelta: Math.max(latitudeDelta, 0.001),
      longitudeDelta: Math.max(longitudeDelta, 0.001),
    };
  }, [routePoints]);

  const polylineCoordinates = useMemo(() => {
    return routePoints.map(point => ({
      latitude: point.latitude,
      longitude: point.longitude,
    }));
  }, [routePoints]);

  if (routePoints.length === 0) {
    return null;
  }

  if (!mapRegion) {
    return null;
  }

  const hasValidPolyline = polylineCoordinates.length >= 2;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={mapRegion}
        scrollEnabled
        zoomEnabled
        rotateEnabled
        pitchEnabled
      >
        {hasValidPolyline && (
          <Polyline
            coordinates={polylineCoordinates}
            strokeColor="#2563EB"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});