import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    SafeAreaView, // Importante para evitar que el contenido se superponga con la barra de estado
    ScrollView // Para asegurar que el formulario sea accesible en pantallas pequeñas
} from 'react-native';

// import Icon from 'react-native-vector-icons/Feather';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { saveNewCliente } from '../src/database';

type RootStackParamList = {
    Home: undefined;
    Details: undefined;
    AgregarCliente: undefined;
    AgregarPrestamo: undefined;
}

type AgregarClienteProps = NativeStackScreenProps<RootStackParamList, 'AgregarCliente'>
export function AgregarClienteScreen({ navigation } : AgregarClienteProps) {

    const [username, setUsername] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    // --- MANEJADOR DEL ENVÍO ---
    const handleRegistration = async () => {
        // La lógica de encriptación y guardado se haría aquí.
        try {
            // Simula una navegación o muestra un mensaje de éxito
            // Alert.alert(`username: ${username}, address: ${address}, phoneNumber: ${phoneNumber}`);
            await saveNewCliente({ nombre: username });
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al registrar al cliente.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.fieldset}>
                    <Text style={styles.legend}>Cliente</Text>
                    
                    {/* Campo Nombre */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Nombre:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername} // Equivalente a v-model
                        />
                    </View>

                    {/* Campo Dirección */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Dirección (Opcional):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                    
                    <View style={styles.campo}>
                        <Text style={styles.label}>Teléfono (Opcional):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Teléfono"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>
                    
                    {/* Botón de Registro */}
                    <TouchableOpacity style={styles.button} onPress={handleRegistration}>
                        <Text style={styles.buttonText}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// --- ESTILOS ---
// En React Native, los estilos se escriben en JavaScript usando StyleSheet.create.
// Las propiedades son similares a CSS, pero en camelCase (ej: background-color -> backgroundColor).
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0d576fe0',
    },
    container: {
        flexGrow: 1, // Permite que el ScrollView crezca
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 450,
        paddingRight: 450,
    },
    fieldset: {
        width: '100%',
        backgroundColor: 'hsl(202, 70.7%, 59.8%)',
        padding: 20,
        paddingTop: 0,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
    },
    legend: {
        backgroundColor: '#005485',
        fontFamily: 'Arial',
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: '400',
        padding: 16,
        marginBottom: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fff',
        // Para que el legend se "salga" del fieldset como en la web, lo posicionamos
        transform: [{ translateY: -30 }], 
    },
    campo: {
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 18,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    inputPassword: {
        flex: 1, // Ocupa todo el espacio menos el del ícono
        paddingVertical: 12,
        fontSize: 18,
        color: '#000',
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#005485',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});