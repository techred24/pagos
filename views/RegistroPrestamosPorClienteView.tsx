



// <View style={styles.fieldset}>
                //     <Text style={styles.legend}>Prestamo</Text>

                //     <View style={styles.campo}>
                //         <Text style={styles.label}>Cliente:</Text>
                //         <TextInput
                //             style={styles.input}
                //             placeholder="Cliente"
                //             placeholderTextColor={"#999"}
                //             autoComplete='off'
                //             autoCapitalize='none'
                //             value={cliente}
                //             onChangeText={setCliente}
                //         />
                //     </View>

                //     <View style={styles.campo}>
                //         <Text style={styles.label}>Monto:</Text>
                //         <TextInput
                //             style={styles.input}
                //             placeholder='Monto'
                //             placeholderTextColor={'#999'}
                //             autoComplete='off'
                //             autoCapitalize='none'
                //             value={monto}
                //             onChangeText={establecerNuevoMonto}
                //             keyboardType='decimal-pad'
                //         />
                //     </View>

                //     <View style={styles.calendar}>
                //         <Text style={styles.label}>Fecha de entrega:</Text>
                //         <Calendar
                //         onDayPress={day => {
                //             setSelectedDay(day.dateString);
                //             // Alert.alert('Exito', day.dateString);
                //         }}
                //         markedDates={{
                //             [selectedDay]: {
                //                 selected: true,
                //                 selectedTextColor: 'red',
                //                 selectedColor: 'navy'
                //             }
                //         }}
                //         />
                //     </View>
                //     <TouchableOpacity style={styles.button} onPress={agregarPrestamo}>
                //         <Text style={styles.buttonText}>Agregar Prestamo</Text>
                //     </TouchableOpacity>
                // </View>