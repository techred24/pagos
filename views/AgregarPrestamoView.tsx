import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    // TouchableOpacity,
    StyleSheet,
    // Alert,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    FlatList
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Cliente from '../src/database/model/Cliente';
import { buscarClientesPorNombre, saveNewPrestamo } from '../src/database';

LocaleConfig.locales.mx = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar', 'Abr', 'May', 'Jun', 'Jul.', 'Ago', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mie.', 'Jue.', 'Vie.', 'Sab.'],
  today: "Hoy"
};
type RootStackParamList = {
    Home: undefined;
    // Details: undefined;
    // AgregarCliente: undefined;
    AgregarPrestamo: undefined;
}
type AgregarPrestamoProps = NativeStackScreenProps<RootStackParamList, 'AgregarPrestamo'>

export function AgregarPrestamoScreen({ navigation } : AgregarPrestamoProps) {
    const [clienteInput, setClienteInput] = useState<string>('');
    const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
    const [selectedClienteName, setSelectedClienteName] = useState<string>('');
    const [suggestions, setSuggestions] = useState<Cliente[]>([]);
    // const [cliente, setCliente] = useState<string>('');
    const [monto, setMonto] = useState<string>('');
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [fechaEntrega, setFechaEntrega] = useState<number>(Date.now());
    
    const searchClientes = useCallback(async (text: string) => {
        if (text.length > 2) {
            const results = await buscarClientesPorNombre(text);
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    }, []);
    useEffect(() => {
        if (clienteInput !== selectedClienteName) {
             // Solo buscar si el texto no es el nombre de un cliente ya seleccionado
             // y si es lo suficientemente largo
             searchClientes(clienteInput);
        }
    }, [clienteInput, searchClientes, selectedClienteName]);

    const handleSelectCliente = (cliente: Cliente) => {
        setSelectedClienteId(cliente.id);
        setSelectedClienteName(cliente.nombre);
        setClienteInput(cliente.nombre); // Llenar el input con el nombre
        setSuggestions([]); // Ocultar las sugerencias
    };
    const handleSavePrestamo = async () => {
        if (!selectedDay) {
            Alert.alert('Mensaje', `No se seleccionó un día: ${selectedDay}`);
            return;
        }
        // 1. VALIDACIÓN
        if (!selectedClienteId || !monto || isNaN(parseFloat(monto))) {
            Alert.alert('Error', 'Debe seleccionar un cliente e ingresar un monto válido.');
            return;
        }

        try {
            // 2. LLAMADA A LA BASE DE DATOS
            const nuevoPrestamo = await saveNewPrestamo({
                cliente_id: selectedClienteId,
                monto: parseFloat(monto),
                fecha_entrega: fechaEntrega,
                estado: 'ACTIVO',
            });

            // 3. ÉXITO
            Alert.alert('Éxito', `Préstamo creado. ID: ${nuevoPrestamo.id}`);
            navigation.goBack(); // O navegar a otra vista
        } catch (error) {
            console.error('Error al guardar préstamo:', error);
            Alert.alert('Error', 'Ocurrió un error al registrar el préstamo.');
        }
    };
    const establecerNuevoMonto = (nuevoMonto: string) => {
        if (nuevoMonto.includes('.')) {
            const countDots = (nuevoMonto.match(/\./g) || []).length;
            if (countDots > 1) {
                return;
            }
        }
        setMonto(nuevoMonto);
    }
    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.fieldset}>
                    <Text style={styles.legend}>Prestamo</Text>


                    <View style={styles.campo}>
                        <Text style={styles.label}>Cliente Seleccionado:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Buscar Cliente por Nombre..."
                            placeholderTextColor="#999"
                            value={clienteInput}
                            onChangeText={text => {
                                setClienteInput(text);
                                setSelectedClienteId(null); // Deseleccionar al escribir
                                setSelectedClienteName('');
                            }}
                        />
                        {/* Indicador del ID seleccionado */}
                        {selectedClienteId && (
                            <Text style={styles.selectedIdText}>ID: {selectedClienteId}</Text>
                        )}

                        {/* 🚨 LISTA DE SUGERENCIAS */}
                        {suggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
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
                        )}
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.label}>Monto:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Monto'
                            placeholderTextColor={'#999'}
                            autoComplete='off'
                            autoCapitalize='none'
                            value={monto}
                            onChangeText={establecerNuevoMonto}
                            keyboardType='decimal-pad'
                        />
                    </View>

                    <View style={styles.calendar}>
                        <Text style={styles.label}>Fecha de entrega:</Text>
                        <Calendar
                        onDayPress={day => {
                            setSelectedDay(day.dateString);
                            const date = new Date(day.dateString);
                            const timestamp = date.getTime();
                            setFechaEntrega(timestamp);
                            // Alert.alert('Fechas', `dateString: ${day.dateString}, timestamp: ${timestamp}, stampToDate: ${new Date(timestamp).toISOString()}`);
                        }}
                        markedDates={{
                            [selectedDay]: {
                                selected: true,
                                selectedTextColor: 'red',
                                selectedColor: 'navy'
                            }
                        }}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSavePrestamo}
                    >
                        <Text style={styles.buttonText}>Guardar Préstamo</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0d576fe0'
    },
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 450,
        paddingRight: 450
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
        transform: [{ translateY: -30 }]
    },
    campo: {
        marginBottom: 20
    },
    label: {
        fontFamily: 'Arial',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000'
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: "#ccc",
        paddingHorizontal: 10,
        paddingVertical: 12,
        fontSize: 18,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#000'
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
    calendar: {
        flex: 1,
        marginBottom: 20
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 60, // Ajustar para que esté debajo del input
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        maxHeight: 200,
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
    selectedIdText: {
        fontSize: 14,
        color: '#005485',
        marginTop: 5,
    },
})