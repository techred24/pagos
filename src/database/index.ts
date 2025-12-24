import { Database, Q } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { mySchema } from './schema';
import Cliente from './model/Cliente';
import Prestamo from './model/Prestamo';
// import { Q } from '@nozbe/watermelondb';
// import migrations from './migrations';

// const migrations = [ migration_1_to_2 ];
// El adaptador se conecta a la implementación nativa (SQLite en este caso)
const adapter = new SQLiteAdapter({
  schema: mySchema,
  dbName: 'WatermelonPaymentsDB', // Nombre de tu archivo de base de datos
  // migrations, // Aquí se pondrían las migraciones si el esquema cambia
  jsi: true, // ¡Recomendado para el mejor rendimiento!
});

// Inicialización de la base de datos
export const database = new Database({
  adapter,
  modelClasses: [
    Cliente, // Todos los modelos que definas deben listarse aquí
    Prestamo
  ],
});

interface NewPrestamoData {
    cliente_id: string;
    monto: number;
    fecha_entrega: number; // timestamp
    estado: 'ACTIVO' | 'INACTIVO';
}

export async function saveNewPrestamo({ cliente_id, monto, fecha_entrega, estado }: NewPrestamoData) {
    let nuevoPrestamo: Prestamo | null = null;
    
    await database.write(async () => {
      
      const prestamosCollection = database.get<Prestamo>('prestamos');
      
      nuevoPrestamo = await prestamosCollection.create((prestamo) => {
        prestamo.clienteId = cliente_id;
        prestamo.monto = monto;
        prestamo.fechaEntrega = fecha_entrega;
        prestamo.estado = estado;
      });
    });
    
    if (!nuevoPrestamo) {
        throw new Error("No se pudo crear el préstamo.");
    }
    
    return nuevoPrestamo as Prestamo;
}

// Esta función es la que usaremos para guardar un nuevo cliente
export async function saveNewCliente({ nombre, direccion, telefono }: {
    nombre: string,
    direccion?: string,
    telefono?: string
  }) {
    await database.write(async () => {
      
      // La SOLUCIÓN es tipar la colección (la tabla) con el genérico:
      const clientesCollection = database.get<Cliente>('clientes');
      
      // Al usar .get<Cliente>('clientes'), TypeScript sabe que el argumento 'cliente'
      // en el callback de .create() es de tipo Cliente, resolviendo ambos problemas.
      const nuevoCliente = await clientesCollection.create((cliente) => {
        
        // Ahora sí, estas propiedades existen en 'cliente'
        cliente.nombre = nombre; 
        cliente.direccion = direccion || null;
        cliente.telefono = telefono || null;
        cliente.createdAt = Date.now();
      });
      
      return nuevoCliente;
    });
  }

  export async function deleteAllClientes() {
  console.log("Iniciando borrado de todos los clientes...");

  // El método .write() asegura que el borrado sea transaccional y seguro.
  await database.write(async () => {
    
    // 1. Obtener la colección de clientes (tipada correctamente)
    const clientesCollection = database.get<Cliente>('clientes');
    
    // 2. Obtener todos los clientes que existen en la base de datos
    // Q.all() es un "Query" que selecciona todos los registros
    const allClientes = await clientesCollection.query().fetch();
    
    if (allClientes.length > 0) {
      // 3. Crear una promesa de borrado para cada registro
      const deletions = allClientes.map(cliente => cliente.markAsDeleted());
      
      // 4. Ejecutar el borrado
      await Promise.all(deletions);
      
      console.log(`${allClientes.length} clientes eliminados con éxito.`);
      return true;
    } else {
      console.log("No se encontraron clientes para eliminar.");
      return false;
    }
  });
}

export async function getClientesByPrestamoStatus(status: 'ACTIVO' | 'PAGADO') {
    const clientesCollection = database.get<Cliente>('clientes');
    
    // 🚨 USO DE Q.on (RELACIÓN INVERSA)
    const clientes = await clientesCollection.query(
        // Q.on('nombre_de_la_tabla_relacionada', Q.where('columna_a_filtrar', 'valor'))
        Q.on('prestamos', Q.where('estado', status))
    ).fetch();
    
    // WatermelonDB devuelve solo los clientes que tienen AL MENOS UN préstamo 
    // en la tabla 'prestamos' que cumple con la condición de estado.
    return clientes;
}

export async function getAllClientes() {
    // 1. Obtener la colección (tabla) de clientes, tipada con <Cliente>
    const clientesCollection = database.get<Cliente>('clientes'); 
    
    // 2. Iniciar un query sin condiciones y ejecutar .fetch()
    const allClientes = await clientesCollection.query().fetch();
    
    // Retorna un array de objetos Cliente
    return allClientes; 
}

export async function getClienteById(id: string) {
    const clientesCollection = database.get<Cliente>('clientes'); 
    
    // .find(id) busca directamente el registro por su clave primaria
    // ¡Ojo!: Si el registro no existe, WatermelonDB lanza un error, por lo que 
    // deberías usar un bloque try/catch en la llamada.
    const cliente = await clientesCollection.find(id);
    
    // Retorna un objeto Cliente o lanza error si no existe
    return cliente; 
}

export async function getClientesByNombre(nombre: string) {
    const clientesCollection = database.get<Cliente>('clientes'); 
    
    // .query() inicia la búsqueda. Usamos Q.where(columna, valor) para filtrar.
    const clientes = await clientesCollection.query(
        Q.where('nombre', nombre) // Filtra donde la columna 'nombre' sea igual al valor de 'nombre'
    ).fetch();
    
    // Retorna un array (puede ser vacío si no hay coincidencias)
    return clientes; 
}

export async function buscarClientesPorNombre(texto: string) {
    if (!texto || texto.length < 1) {
        return []; // No busques si el texto está vacío
    }

    // El patrón '%%' realiza una búsqueda tipo 'LIKE' en SQLite
    // `Q.like('nombre', `${texto}%`)` busca coincidencias que empiecen con 'texto'
    // El operador Q.sanitizeLikeString limpia el texto para evitar inyecciones SQL.
    const sanitizedText = Q.sanitizeLikeString(texto);

    const clientes = await database.get<Cliente>('clientes').query(
        Q.where('nombre', Q.like(`${sanitizedText}%`)) 
    ).fetch();
    
    // Retorna los objetos Cliente (con ID, nombre, etc.)
    return clientes; 
}

export async function getPrestamosByClienteIdAndStatus(
    clienteId: string, 
    status: 'ACTIVO' | 'PAGADO'
) {
    const prestamosCollection = database.get<Prestamo>('prestamos');
    
    const prestamos = await prestamosCollection.query(
        Q.where('cliente_id', clienteId),
        Q.where('estado', status)
    ).fetch();
    
    return prestamos;
}

export async function getAllPrestamos() {
    const prestamosCollection = database.get<Prestamo>('prestamos');

    const todosLosPrestamos = await prestamosCollection.query().fetch(); 
    
    return todosLosPrestamos;
}