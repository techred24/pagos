import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    // TextInput,
    // TouchableOpacity,
    StyleSheet,
    // Alert,
    SafeAreaView,
    ScrollView,
    SectionList,
    Pressable,
    // TouchableOpacity,
    // Alert,
    // FlatList
} from 'react-native';


import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getAllPrestamos } from '../src/database';
import Prestamo from '../src/database/model/Prestamo';

type RootStackParamList = {
    Home: undefined;
    VerPrestamos: undefined;
}
type VerPrestamosProps = NativeStackScreenProps<RootStackParamList, 'VerPrestamos'>

export function VerPrestamoScreen({ navigation } : VerPrestamosProps) {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    useEffect(() => {
        consigueTodosLosPrestamos();
    }, []);

    const consigueTodosLosPrestamos = async () => {
        const allPrestamos = await getAllPrestamos();
        setPrestamos(allPrestamos);
    }

    return(
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.fieldset}>
                    <Text style={styles.legend}>Ver Préstamos</Text>


                                        <SectionList
                                            sections={[{ title: 'Lista de Préstamos', data: prestamos }]}
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
                                                    // onPress={() => }
                                                >
                                                    {/* {({ pressed }) => (
                                                        <Text >
                                                           {`Nombre: ${item.item.nombre}`}
                                                        </Text>
                                                    )} */}
                                                    <Text >
                                                           Cantidad de préstamo {item.item.monto}
                                                    </Text>
                                                </Pressable>
                                            )}
                                        />
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
        paddingLeft: 10,
        paddingRight: 10
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