/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

// import { useState } from 'react';
// import { StyleSheet, View, Text, Pressable, Platform, Button } from 'react-native';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgregarClienteScreen } from './views/agregarClienteView';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  AgregarCliente: undefined;
  AgregarPrestamo: undefined;
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
            onLongPress={() => {}}>
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
            onLongPress={() => {}}>
            {({ pressed }) => (
              <Text style={{ color: pressed ? '#FFF' : '#000' }}>
                Agregar Prestamo
              </Text>
            )}
      </Pressable>
    </View>
  );
}
// function DetailsScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Pantalla de Detalles</Text>
//     </View>
//   );
// }
// function AgregarClienteScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text>Pantalla para agregar clientes</Text>
//     </View>
//   )
// }
function AgregarPrestamoScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Pantalla para agregar prestamos</Text>
    </View>
  )
}
const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
        <Stack.Screen name="AgregarCliente" component={AgregarClienteScreen} />
        <Stack.Screen name="AgregarPrestamo" component={AgregarPrestamoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// function App() {
//   const [ number, setNumber ] = useState<number>(0);
//   return (
//     <View style={styles.container}>
//       <Text>{number}</Text>
//       <Pressable 
//             style={({ pressed }) => [
//                 styles.button,
//                 {
//                     backgroundColor: pressed ? '#5856D6' : 'skyblue',
//                 },
//             ]}
//             onPress={() => {setNumber((current: number) => ++current);}}
//             onLongPress={() => {setNumber(0);}}>
//         {/* <Text>Incrementar</Text> */}
//             {({ pressed }) => (
//               <Text style={{ color: pressed ? '#FFF' : '#000' }}>
//                 Incrementar
//               </Text>
//             )}
//       </Pressable>
//     </View>
//   );
// }

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
  },
});

export default App;
