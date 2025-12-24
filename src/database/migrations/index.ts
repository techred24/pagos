// src/database/migrations/index.ts

// SOLUCIÓN DEFINITIVA: Importar la función de fábrica directamente desde su archivo, 
// lo que te permite usar su nombre real (createMigrations), el cual está dentro de ese módulo.
import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'; 
import migration_1_to_2 from './migration_1_to_2'; 

// La versión 1 es la inicial, donde solo existe la tabla 'clientes'.
export default schemaMigrations({ 
  migrations: [
    migration_1_to_2,
  ],
});