import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import { WebView } from "react-native-webview";
import { io } from "socket.io-client";
import * as Location from "expo-location";
import { useAuth } from "../../../context/AuthContext";
import { useGetPrivacyQuery } from "../../../services/auth/privacyapiSlice";
import {
  useFetchTrailQuery,
  useSendPingMutation,
} from "../../../services/locationApiSlice";

const BASE_WS = "https://tourism.smartptrm.com/location";

const UserTracking = () => {
  const { userToken } = useAuth();
  const { data: privacy, isLoading: privacyLoading } = useGetPrivacyQuery(
    undefined,
    { skip: !userToken }
  );

  const [sendPing] = useSendPingMutation();
  const [trail, setTrail] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState(null);
  const [trackingPaused, setTrackingPaused] = useState(false);

  const socketRef = useRef(null);
  const webViewRef = useRef(null);
  const locationSubscription = useRef(null);

  // Fetch trail data
  const { data: trailData } = useFetchTrailQuery(
    { windowHours: 1 },
    { skip: !userToken }
  );
  useEffect(() => {
    if (trailData) setTrail(trailData);
  }, [trailData]);

  // Function to setup Socket.IO
  const setupSocket = () => {
    if (!userToken) return;

    socketRef.current = io(BASE_WS, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token: userToken },
    });

    socketRef.current.on("loc.ping", (p) => {
      setMarkers((prev) => [
        ...prev.filter((m) => m.userId !== p.userId),
        { ...p },
      ]);
    });

    socketRef.current.on("sos.created", (s) => {
      Alert.alert("SOS Alert!", `User ${s.userId} raised an SOS`);
    });
  };

  // Function to start location tracking
  const startTracking = async () => {
    const { status, granted } =
      await Location.requestForegroundPermissionsAsync();
    if (status !== "granted" || !granted) {
      Alert.alert(
        "Permission denied",
        "Allow location to track your position."
      );
      return;
    }

    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
        distanceInterval: 1,
      },
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        if (privacy?.locationConsentAt && !trackingPaused) {
          await sendPing({ lat: latitude, lng: longitude })
            .unwrap()
            .catch((err) => {
              if (err?.status === 403) {
                Alert.alert("Tracking paused or consent missing!");
                setTrackingPaused(true);
              }
            });
        }
      }
    );
  };

  // Update map when data changes
  useEffect(() => {
    if (webViewRef.current && location) {
      const updateScript = `
        updateMap(${JSON.stringify({
          location,
          markers,
          trail,
        })});
      `;
      webViewRef.current.injectJavaScript(updateScript);
    }
  }, [location, markers, trail]);

  // Initialize socket and tracking
  useEffect(() => {
    if (!userToken || !privacy) return;

    setupSocket();
    startTracking();

    return () => {
      if (locationSubscription.current) locationSubscription.current.remove();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [userToken, privacy, trackingPaused]);

  // Loading states
  if (!userToken) {
    return (
      <View style={styles.center}>
        <Text>Please login to track your location.</Text>
      </View>
    );
  }

  if (privacyLoading || !location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text>Fetching location & privacy...</Text>
      </View>
    );
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
      body { margin: 0; padding: 0; }
      #map { height: 100vh; width: 100vw; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      let map;
      let userMarker;
      let otherMarkers = {};
      let trailPolyline;
      let firstLoad = true;

      // Custom icons
      const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="width: 20px; height: 20px; border-radius: 20px; background-color: #4A90E2; border: 3px solid white;"></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const otherIcon = L.divIcon({
        className: 'other-user-marker',
        html: '<div style="width: 15px; height: 15px; border-radius: 7.5px; background-color: #FF0000; border: 2px solid white;"></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      // Initialize map at given coords
      map = L.map('map').setView([${location.latitude}, ${location.longitude}], 15);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add user marker immediately
      userMarker = L.marker([${location.latitude}, ${location.longitude}], { icon: userIcon })
        .addTo(map)
        .bindPopup('Your Location');

      console.log("✅ User marker initialized at", ${location.latitude}, ${location.longitude});

      // Update map from React Native
      function updateMap(data) {
        console.log("📩 updateMap called:", data);
        const { location, markers, trail } = data;

        // Update user marker
        if (userMarker) {
          userMarker.setLatLng([location.latitude, location.longitude]);
        } else {
          userMarker = L.marker([location.latitude, location.longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('Your Location');
        }

        // Update other user markers
        markers.forEach(marker => {
          if (marker.userId === 'currentUser') return; // skip current user
          if (otherMarkers[marker.userId]) {
            otherMarkers[marker.userId].setLatLng([marker.lat, marker.lng]);
          } else {
            otherMarkers[marker.userId] = L.marker([marker.lat, marker.lng], { icon: otherIcon })
              .addTo(map)
              .bindPopup(\`User \${marker.userId}\`);
          }
        });

        // Remove old markers
        Object.keys(otherMarkers).forEach(userId => {
          if (!markers.find(m => m.userId === userId)) {
            map.removeLayer(otherMarkers[userId]);
            delete otherMarkers[userId];
          }
        });

        // Update trail
        if (trailPolyline) {
          trailPolyline.setLatLngs(trail.map(p => [p.lat, p.lng]));
        } else if (trail.length > 0) {
          trailPolyline = L.polyline(trail.map(p => [p.lat, p.lng]), { color: '#FF0000', weight: 3 }).addTo(map);
        }

        // Recenter map only first time
        if (firstLoad) {
          map.setView([location.latitude, location.longitude], 15);
          firstLoad = false;
        }
      }

      // Make function callable from RN
      window.updateMap = updateMap;
    </script>
  </body>
  </html>
`;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.pauseButton}>
        <Button
          title={trackingPaused ? "Resume Tracking" : "Pause Tracking"}
          onPress={() => setTrackingPaused(!trackingPaused)}
        />
      </View>

      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text>Loading map...</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  pauseButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
  },
});

export default UserTracking;
