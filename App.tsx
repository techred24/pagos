/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import { useState } from 'react';
// import { StyleSheet, View, Text, Pressable, Platform, Button } from 'react-native';
import { View, Text, Pressable, StyleSheet, TextStyle } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgregarClienteScreen } from './views/AgregarClienteView';
import { AgregarPrestamoScreen } from './views/AgregarPrestamoView';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { VerClienteScreen } from './views/VerClienteView';
import { ClientesScreen } from './views/ClientesView';
import { VerPrestamoScreen } from './views/VerPrestamosView';
type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  AgregarCliente: undefined;
  AgregarPrestamo: undefined;
  VerPrestamos: undefined;
  VerCliente: {
    id: string;
  };
  Clientes: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#5856D6' : 'skyblue',
                },
            ]}
            onPress={() => {navigation.navigate('AgregarCliente');}}
            >
            {({ pressed }) => (
              <Text style={{ color: pressed ? '#FFF' : '#000' }}>
                Agregar Cliente
              </Text>
            )}
      </Pressable>
      <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#5856D6' : 'skyblue',
                },
            ]}
            onPress={() => {navigation.navigate('AgregarPrestamo');}}
            >
            {({ pressed }) => (
              <Text style={{ color: pressed ? '#FFF' : '#000' }}>
                Agregar Prestamo
              </Text>
            )}
      </Pressable>
      <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#5856D6' : 'skyblue',
                },
            ]}
            onPress={() => {navigation.navigate('VerPrestamos');}}
            >
            {({ pressed }) => (
              <Text style={{ color: pressed ? '#FFF' : '#000' }}>
                Ver Préstamos
              </Text>
            )}
      </Pressable>
      <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#5856D6' : 'skyblue',
                },
            ]}
            // onPress={() => {navigation.navigate('VerCliente', { id: '' });}}
            >
            {({ pressed }) => (
              <Text style={getButtonTextStyle({ pressed })}>
                Ver Cliente
              </Text>
            )}
      </Pressable>
      <Pressable
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: pressed ? '#5856D6' : 'skyblue',
                },
            ]}
            onPress={() => {navigation.navigate('Clientes');}}
            >
            {({ pressed }) => (
              <Text style={getButtonTextStyle({ pressed })}>
                Clientes
              </Text>
            )}
      </Pressable>
    </View>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        <Stack.Screen name="AgregarCliente" component={AgregarClienteScreen} />
        <Stack.Screen name="AgregarPrestamo" component={AgregarPrestamoScreen} />
        <Stack.Screen name='VerPrestamos' component={VerPrestamoScreen} />
        <Stack.Screen name="VerCliente" component={VerClienteScreen} />
        <Stack.Screen name='Clientes' component={ClientesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
type ButtonTextStyleFunction = (props: { pressed: boolean }) => TextStyle;
const getButtonTextStyle: ButtonTextStyleFunction = ({ pressed }) => ({
    // Usa el tipo TextStyle (que incluye color)
    color: pressed ? '#FFF' : '#000',
});
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    // backgroundColor: Platform.OS === 'ios' ? '#5856D6' : '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  }
});

export default App;
