import React, { useCallback, useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    // TextInput, 
    TouchableOpacity, 
    StyleSheet,
    // FlatList, // Para renderizar la lista de resultados
    // ... otros imports
    SafeAreaView,
    ScrollView,
    Pressable,
    TextStyle,
    Alert,
    // TextStyle
} from 'react-native';

// Importa la función de búsqueda de WatermelonDB
// import { buscarClientesPorNombre } from '../src/database';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getClienteById, getPrestamosByClienteIdAndStatus } from '../src/database';
import Cliente from '../src/database/model/Cliente';
// import AutocompleteInput from 'react-native-autocomplete-input';
type RootStackParamList = {
    Home: undefined;
    VerCliente: {
        id: string;
    };
}

type VerClienteProps = NativeStackScreenProps<RootStackParamList, 'VerCliente'>

// Define el tipo de dato que esperamos de la DB
// interface ClienteSearchResult {
//     id: string;
//     nombre: string;
//     // Otros campos que necesites, ej. telefono
// }

export function VerClienteScreen({ navigation, route }: VerClienteProps) {
    // const [title, setTtitle] = useState<string>('Ver Cliente');
    // const [clienteInput, setClienteInput] = useState<string>(''); // Texto del input
    // const [suggestions, setSuggestions] = useState<ClienteSearchResult[]>([]); // Resultados de la DB
    // const [searching, setSearching] = useState<boolean>(false); // Estado de carga
    // const [idCliente, setIdCliente] = useState<string>('');
    const [cliente, setCliente] = useState<Cliente | undefined>(undefined);
    const clienteId = route.params.id;
        const loadClienteById = useCallback(async () => {
        if (!clienteId) return; // Salir si no hay ID
        try {
            const clienteEncontrado = await getClienteById(clienteId);
            setCliente(clienteEncontrado);
        } catch (error) {
            // Puedes mostrar una alerta de que el cliente no se encontró
        }
    }, [clienteId]);

    useEffect(() => {
        loadClienteById();
    }, [loadClienteById]);
    // setIdCliente(route.params.id)
    // const clienteId = route.params.id;
    // Hook de Debounce: Ejecuta la búsqueda 500ms después de que el usuario deja de escribir
    // useEffect(() => {
    //     setSearching(true);
    //     // 1. Establece un temporizador (debounce)
    //     const handler = setTimeout(async () => {
    //         if (clienteInput.length > 0) {
    //             try {
    //                 // 2. Ejecuta la búsqueda en WatermelonDB
    //                 const results = await buscarClientesPorNombre(clienteInput);
    //                 // Mapea los resultados para obtener solo la información necesaria
    //                 const mappedResults = results.map(c => ({
    //                     id: c.id, 
    //                     nombre: c.nombre
    //                 }));
    //                 setSuggestions(mappedResults);
    //             } catch (error) {
    //                 console.error('Error buscando clientes:', error);
    //                 setSuggestions([]);
    //             }
    //         } else {
    //             setSuggestions([]);
    //         }
    //         setSearching(false);
    //     }, 500); // <-- 500ms (medio segundo) de debounce

    //     // 3. Limpieza: Si el usuario sigue escribiendo, reinicia el temporizador
    //     return () => {
    //         clearTimeout(handler);
    //     };
    // }, [clienteInput]); // Solo se ejecuta cuando clienteInput cambia
    const GoToHome = () => {
        navigation.navigate('Home');
    }
    const getPrestamosActivos = async () => {
        const prestamos = await getPrestamosByClienteIdAndStatus(cliente!.id, "ACTIVO");
        prestamos.forEach((prestamo) => {
            Alert.alert('Prestamos', `${prestamo.monto} ${prestamo.estado}`);
        })
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.fieldset}>
                    <Text style={styles.legend}>Ver Cliente</Text>

                    <View style={styles.campoCliente}>
                        <Text style={styles.infoClient}>Cliente: {cliente?.nombre}</Text>
                        <Text style={styles.infoClient}>ID: {cliente?.id}</Text>
                        
                        {/* --------------------- INPUT DE BÚSQUEDA --------------------- */}
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Buscar cliente por nombre"
                            placeholderTextColor="#999"
                            value={clienteInput}
                            onChangeText={setClienteInput} // Actualiza el estado clienteInput
                        /> */}

                        {/* --------------------- DROPDOWN DE RESULTADOS --------------------- */}
                        {/* {suggestions.length > 0 && (
                            <View style={styles.suggestionBox}>
                                <FlatList
                                    data={suggestions}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            style={styles.suggestionItem}
                                            onPress={() => handleSelectCliente(item)}
                                        >
                                            <Text style={styles.suggestionText}>{item.nombre}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        )} */}
                        {/* -------------------------------------------------------------------- */}

                        {/* {searching && clienteInput.length > 0 && (
                             <Text style={styles.loadingText}>Buscando...</Text>
                        )} */}

                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable style={styles.clientButton} onPress={() => getPrestamosActivos()}>
                            {({ pressed }) => (
                                <Text style={getButtonTextStyle({ pressed })}>Préstamos activos</Text>
                            )}
                        </Pressable>
                        <Pressable style={styles.clientButton}>
                            {({ pressed }) => (
                                <Text style={getButtonTextStyle({ pressed })}>Préstamos liquidados</Text>
                            )}
                        </Pressable>
                        <Pressable style={styles.clientButton}>
                            {({ pressed }) => (
                                <Text style={getButtonTextStyle({ pressed })}>Todos los préstamos</Text>
                            )}
                            
                        </Pressable>
                    </View>
                    {/* ... resto de la vista ... */}
                    <TouchableOpacity style={styles.button} onPress={GoToHome}>
                         <Text style={styles.buttonText}>Ir a Home</Text>
                     </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
type ButtonTextStyleFunction = (props: { pressed: boolean }) => TextStyle;
const getButtonTextStyle: ButtonTextStyleFunction = ({ pressed }) => ({
    // Usa el tipo TextStyle (que incluye color)
    color: pressed ? 'skyblue' : '#000',
    paddingVertical: 15,
    paddingHorizontal: 9
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
        // marginBottom: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#fff',
        // Para que el legend se "salga" del fieldset como en la web, lo posicionamos
        transform: [{ translateY: -30 }], 
    },
    infoClient: {
        // backgroundColor: '#005485',
        fontFamily: 'Arial',
        fontSize: 17,
        // width: '100%',
        // textAlign: 'left',
        color: '#fff',
        // textTransform: 'uppercase',
        fontWeight: '400',
        // padding: 16,
        // // marginBottom: 30,
        // borderRadius: 15,
        // // borderWidth: 2,
        // borderColor: '#fff',
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
    campoCliente: {
        backgroundColor: '#005485',
        fontFamily: 'Arial',
        width: '100%',
        textAlign: 'left',
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: '400',
        padding: 16,
        // marginBottom: 30,
        borderRadius: 15,
        // borderWidth: 2,
        borderColor: '#fff',
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
        suggestionBox: {
        position: 'absolute', // Asegura que el dropdown flote sobre el contenido
        top: 80, // Ajusta la posición para que esté debajo del TextInput
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        maxHeight: 200, // Limita la altura del dropdown
        overflow: 'hidden',
    },
    suggestionItem: {
        padding: 12,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    suggestionText: {
        fontSize: 16,
        color: '#000',
    },
    loadingText: {
        marginTop: 5,
        color: '#fff',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // backgroundColor: 'navy',
        marginBottom: 20
    },
    clientButton: {
        backgroundColor: 'skyblue',
        borderRadius: 5
    }
})