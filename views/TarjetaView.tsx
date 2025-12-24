import React, { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    Platform,
    SafeAreaView, // Importante para evitar que el contenido se superponga con la barra de estado
    ScrollView // Para asegurar que el formulario sea accesible en pantallas pequeñas
} from 'react-native';
import WebView from 'react-native-webview';

// import Icon from 'react-native-vector-icons/Feather';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { saveNewCliente } from '../src/database';

type RootStackParamList = {
    Home: undefined;
    Details: undefined;
    AgregarCliente: undefined;
    AgregarPrestamo: undefined;
    Tarjeta: undefined;
}

const getOpenpayHtmlSource = () => {
    // ⚠️ Reemplaza 'openpay-device.html' con el nombre de tu archivo si es diferente
    const FILENAME = 'openpay-device.html'; 
    if (Platform.OS === 'android') {
        // En Android, usa el esquema 'file:///' para acceder a la carpeta nativa de assets
        return { uri: `file:///android_asset/${FILENAME}` };
    } else if (Platform.OS === 'ios') {
        // En iOS, solo usa el nombre del archivo (asumiendo que está en el bundle principal)
        // Opcionalmente, puedes usar un prefijo como 'file:///' + el nombre si lo requiere tu setup
        return { uri: FILENAME };
    }
    return null;
};

type AgregarClienteProps = NativeStackScreenProps<RootStackParamList, 'Tarjeta'>
export function TarjetaScreen({ navigation } : AgregarClienteProps) {

    const [numero, setNumero] = useState<string>('');
    const [nombre, setNombre] = useState<string>('');
    const [anioExp, setAnioExp] = useState<string>('');
    const [mesExp, setMesExp] = useState<string>('');
    const [cvv, setCvv] = useState<string>('');

    const [deviceSessionId, setDeviceSessionId] = useState<string | null>(null);
    const [isLoadingDeviceData, setIsLoadingDeviceData] = useState<boolean>(true);
    const myCardData = {
        number: "4111111111111111", // Una tarjeta de prueba válida
        holderName: "John Doe",
        expYear: "28",
        expMonth: "10",
        cvv: "123"
    };
    useEffect(() => {
        setNombre(myCardData.holderName);
        setNumero(myCardData.number);
        setAnioExp(myCardData.expYear);
        setMesExp(myCardData.expMonth);
        setCvv(myCardData.cvv);
    }, [myCardData.holderName, myCardData.number, myCardData.expYear, myCardData.expMonth, myCardData.cvv]);
    const onWebViewMessage = (event: any) => {
        const id = event.nativeEvent.data;
        if (id && id !== 'error_timeout') {
            setDeviceSessionId(id);
            setIsLoadingDeviceData(false);
            Alert.alert('Device Data', `ID de Sesión del Dispositivo Obtenido: ${id}`);
        } else if (id === 'error_timeout') {
            setDeviceSessionId(''); 
            setIsLoadingDeviceData(false);
            Alert.alert('Aviso', 'No se pudo obtener el ID de sesión del dispositivo. Continuar sin este campo (alto riesgo de fraude).');
        }
    };
    const renderDeviceDataWebView = () => {
        const source = getOpenpayHtmlSource();
        if (!source) return null;

        return (
            <WebView
                // Se usa el key para asegurar que se recargue si la fuente cambia (opcional)
                key={Platform.OS}
                source={source}
                style={styles.hiddenWebView} 
                onMessage={onWebViewMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                // Propiedad clave en iOS para cargar archivos locales
                allowFileAccess={Platform.OS === 'ios'} 
            />
        );
    };
    const handleTokenizeCard = async () => {
        if (isLoadingDeviceData || deviceSessionId === null) {
            Alert.alert('Espera', 'Aún estamos obteniendo los datos de seguridad del dispositivo. Inténtalo de nuevo en un momento.');
            return;
        }
        if (deviceSessionId.length > 0) {
            Alert.alert('Session ID', `El session ID: ${deviceSessionId}`)
            return;
        }
        // La lógica de encriptación y guardado se haría aquí.
        try {
            const tokenReponse = await tokenizeCard(myCardData);
            Alert.alert('TOKEN', `El Token es: ${tokenReponse}`);
            navigation.navigate('Home');
            // navigation.replace('Home');
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al tokenizar la tarjeta.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {renderDeviceDataWebView()}
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.fieldset}>
                    <Text style={styles.legend}>Tokenizar Tarjeta</Text>
                    
                    <View style={styles.campo}>
                        <Text style={styles.label}>Nombre:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Felipe Cisneros Herrera"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={nombre}
                            onChangeText={setNombre} // Equivalente a v-model
                        />
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.label}>Número:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="1231234564561234"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={numero}
                            onChangeText={setNumero} // Equivalente a v-model
                        />
                    </View>
                    
                    <View style={styles.campo}>
                        <Text style={styles.label}>Año de Expiración:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="26"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={anioExp}
                            onChangeText={setAnioExp}
                        />
                    </View>
                    
                    <View style={styles.campo}>
                        <Text style={styles.label}>Mes de Expiración:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="01"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={mesExp}
                            onChangeText={setMesExp}
                        />
                    </View>
                    
                    <View style={styles.campo}>
                        <Text style={styles.label}>CVV:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="01"
                            placeholderTextColor="#999"
                            autoComplete="off"
                            autoCapitalize="none"
                            value={cvv}
                            onChangeText={setCvv}
                        />
                    </View>
                    <TouchableOpacity style={styles.button} onPress={handleTokenizeCard}>
                        <Text style={styles.buttonText}>Conseguir ID de tarjeta</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0d576fe0',
    },
    container: {
        flexGrow: 1, // Permite que el ScrollView crezca
        alignItems: 'center',
        justifyContent: 'center',
        // paddingLeft: 450,
        // paddingRight: 450,
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
    hiddenWebView: {
        position: 'absolute',
        top: -9999,
        height: 1,
        width: 1,
        opacity: 0,
    },
});




interface TarjetaInfo {
    number: string;
    holderName: string;
    expYear: string;
    expMonth: string;
    cvv: string;
}
const tokenizeCard = async (cardData: TarjetaInfo) => {
    // ⚠️ IMPORTANTE: NUNCA USES TU LLAVE PRIVADA AQUÍ.
    const MERCHANT_ID = 'mllgxzskqkcwotzircll';
    const PUBLIC_KEY = 'pk_d117205aa317490293b52bb3b3c811f6';

    // Genera el string de autenticación 'pk_LlavePublica:' en Base64
    const authString = btoa(`${PUBLIC_KEY}:`); // 'btoa' simula la codificación Base64

    // const url = `https://sandbox-api.openpay.mx/v1/${MERCHANT_ID}/tokens`;
    const url = `https://sandbox-api.openpay.mx/v1/${MERCHANT_ID}/cards`;

    // ➡️ Estructura mínima de datos que OpenPay espera
    const requestBody = {
        card_number: cardData.number,       // Número de tarjeta
        holder_name: cardData.holderName,   // Nombre del titular
        expiration_year: cardData.expYear,  // Año de expiración (ej: 25)
        expiration_month: cardData.expMonth,// Mes de expiración (ej: 12)
        cvv2: cardData.cvv,                 // CVV
        // name, email, phone_number, address pueden ser agregados
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Autenticación HTTP Basic con la Llave Pública
                'Authorization': `Basic ${authString}`,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (response.ok) {
            // 🎉 ¡Token generado con éxito!
            // Alert.alert('Datos', `Los datos son: ${JSON.stringify(data)}`);
            const idCard = data.id; // Ejemplo: "tok_h3n4s5e6c7u8r9e0"
            // console.log('Token de tarjeta generado:', cardToken);
            return idCard;
        } else {
            // ❌ Error en la tokenización (ej: tarjeta inválida, CVV incorrecto)
            // console.error('Error al tokenizar:', data);
            throw new Error(data.description || 'Error desconocido al tokenizar.');
        }

    } catch (error) {
        console.error('Error de red o sistema:', error);
        throw error;
    }
};