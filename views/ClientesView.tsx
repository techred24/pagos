import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    // TextInput, 
    TouchableOpacity, 
    // Alert,
    SafeAreaView, // Importante para evitar que el contenido se superponga con la barra de estado
    ScrollView, // Para asegurar que el formulario sea accesible en pantallas pequeñas
    StyleSheet,
    SectionList,
    Pressable,
    TextStyle,
    // Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAllClientes } from '../src/database';
import Cliente from '../src/database/model/Cliente';
type RootStackParamList = {
    Home: undefined;
    Clientes: undefined;
    VerCliente: {
        id: string
    }
}

type ClienteProps = NativeStackScreenProps<RootStackParamList, 'Clientes'>

export function ClientesScreen({ navigation }: ClienteProps) {
    useEffect(() => {
        // getClientes();
    }, []);
    const [clients, setClients] = useState<Cliente[]>([] as Cliente[])
    const getClientes = async () => {
        const clientes = await getAllClientes();
        setClients(clientes);
    }
    // const [cliente, setCliente] = useState<string>('');
    const GoToHome = () => {
        // setCliente('');
        navigation.navigate('Home');
    }
    const handleClientPress = (clienteId: string) => {
        // Asumiendo que tienes una vista 'VerCliente' que acepta un ID
        navigation.navigate('VerCliente', { id: clienteId });
    };
    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.fieldset}>
                    <Text style={styles.legend}>Clientes</Text>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.clientButton} onPress={() => getClientes()}>
                            {({ pressed }) => (
                                <Text style={getButtonTextStyle({ pressed })}>Todos los clientes</Text>
                            )}
                        </Pressable>
                        <Pressable style={styles.clientButton}>
                            {({ pressed }) => (
                                <Text style={getButtonTextStyle({ pressed })}>Clientes activos</Text>
                            )}
                        </Pressable>
                        <Pressable style={styles.clientButton}>
                            {({ pressed }) => (
                                <Text style={getButtonTextStyle({ pressed })}>Clientes inactivos</Text>
                            )}
                            
                        </Pressable>
                    </View>
                    <SectionList
                        sections={[{ title: 'Lista de Clientes', data: clients }]}
                        keyExtractor={(item, _) => item.id}
                        renderItem={(item) => (
                            // <Text>{`ID: ${item.item.id}, Nombre: ${item.item.nombre}`}</Text>
                            <Pressable
                                style={({ pressed }) => [
                                    styles.button,
                                    {
                                        backgroundColor: pressed ? '#5856D6' : 'skyblue',
                                    },
                                ]}
                                onPress={() => handleClientPress(item.item.id)}
                            >
                                {({ pressed }) => (
                                    <Text style={getButtonTextStyle({ pressed })}>
                                       {`Nombre: ${item.item.nombre}`}
                                    </Text>
                                )}
                            </Pressable>
                        )}
                    />
                    <TouchableOpacity style={styles.button} onPress={GoToHome}>
                        <Text style={styles.buttonText}>Ir a Home</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
type ButtonTextStyleFunction = (props: { pressed: boolean }) => TextStyle;
const getButtonTextStyle: ButtonTextStyleFunction = ({ pressed }) => ({
    // Usa el tipo TextStyle (que incluye color)
    color: pressed ? '#FFF' : '#000',
});

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
        // marginBottom: 0,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fff',
        // Para que el legend se "salga" del fieldset como en la web, lo posicionamos
        transform: [{ translateY: -30 }], 
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'navy',
        marginBottom: 45
    },
    clientButton: {
        backgroundColor: 'skyblue',
        padding: 10,
        borderRadius: 5
    },
    button: {
        width: '100%',
        padding: 15,
        backgroundColor: '#005485',
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
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
})