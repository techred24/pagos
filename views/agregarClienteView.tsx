// import { View, Text } from 'react-native';

// export function AgregarClienteScreen() {
//     return (
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Pantalla para agregar cliente</Text>
//       </View>
//     )
//   }

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

import Icon from 'react-native-vector-icons/Feather';

export function AgregarClienteScreen() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Estado para controlar la visibilidad de las contraseñas
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    // --- LÓGICA DE VALIDACIÓN ---
    // Las funciones de validación se adaptan fácilmente.
    const isValidUsername = () => {
        const enMinusculas = username === username.toLocaleLowerCase();
        const tieneAlMenosTresCaracteres = username.length >= 3;
        const sinEspacios = !/\s/.test(username);
        const sinCaracteresEspeciales = /^[a-z0-9_-]+$/.test(username);
        return enMinusculas && tieneAlMenosTresCaracteres && sinEspacios && sinCaracteresEspeciales;
    };

    const isValidEmail = () => {
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return regex.test(email);
    };

    // --- MANEJADOR DEL ENVÍO ---
    const handleRegistration = async () => {
        if (!isValidUsername()) {
            Alert.alert('Error', 'El nombre de usuario no es válido. Debe tener al menos 3 caracteres, sin espacios, sin mayúsculas y sin caracteres especiales (solo se permiten - y _).');
            return;
        }
        if (!isValidEmail()) {
            Alert.alert('Error', 'El correo electrónico no es válido.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden.');
            return;
        }
        
        // La lógica de encriptación y guardado se haría aquí.
        // En lugar de IndexedDB, en React Native se usan soluciones como AsyncStorage o bases de datos como Realm o SQLite.
        try {
            console.log('Datos del formulario válidos:', { username, email });
            // Aquí iría la llamada a tu API o la lógica para guardar el usuario.
            
            // Simula una navegación o muestra un mensaje de éxito
            Alert.alert('Éxito', 'Usuario registrado correctamente.');

        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al registrar el usuario.');
            console.error('Ocurrió un error maniaco:', error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.fieldset}>
                    <Text style={styles.legend}>Registro</Text>
                    
                    {/* Campo Usuario */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Usuario:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Usuario"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername} // Equivalente a v-model
                        />
                    </View>

                    {/* Campo Correo */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Correo:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    
                    {/* Campo Contraseña */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Contraseña:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="Contraseña"
                                placeholderTextColor="#999"
                                secureTextEntry={!isPasswordVisible} // Oculta el texto si es true
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Icon name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#005485" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Campo Repetir Contraseña */}
                    <View style={styles.campo}>
                        <Text style={styles.label}>Repetir Contraseña:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.inputPassword}
                                placeholder="Contraseña"
                                placeholderTextColor="#999"
                                secureTextEntry={!isConfirmPasswordVisible}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                <Icon name={isConfirmPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#005485" />
                            </TouchableOpacity>
                        </View>
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