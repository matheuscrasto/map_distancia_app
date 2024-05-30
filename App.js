import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
const App = () => {

  // Constante das coordenadas do destino
  const COORD_SENAC = {
    latitude: -8.05216,
    longitude: -34.885568,
  };

  // Calculo da distância (Formula de Haversine)
  const calculateDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Raio da Terra em KM
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia em KM

    return distance;
  };

  // Constante de localizações do usuário
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

    })();
  }, []);

  // Calcula a distância quando a localização do usuário está disponível
  useEffect(() => {
    if (location) {
      const distanceToTarget = calculateDistance(location, COORD_SENAC);
      setDistance(distanceToTarget);
    }
  }, [location]);



  return (
    <View style={styles.container}>
      <View style={styles.header}>
      </View>
      <View style={styles.header}>
      <Text style={{fontSize: 20, fontWeight: 'bold', padding: 20}}>Apontador de Distância</Text>
      </View>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            // latitudeDelta: 0.0922,
            // longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={COORD_SENAC}
            title="Fac Senac"
          />
          <Marker
            coordinate={location}
            title="Sua Localização"
          />
        </MapView>
      ) : (
        <Text>Obtendo localização...</Text>
      )}
      {distance && (
        <Text style={{marginLeft: 10, fontSize: 20, marginTop: 10,}}>
          Distância até a Faculdade: {distance.toFixed(2)} km
        </Text>
      )}
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 1,
    borderBottomWidth: 2,
    backgroundColor: '#888',
    borderBottomColor: '#09292c',
  },
  map: {
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#09292c',
    width: '100%',
    height: 500,
  },
});

export default App;