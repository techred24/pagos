// src/database/migrations/migration_1_to_2.ts

// ¡USA ESTA ÚNICA IMPORTACIÓN ROBUSTA!
// Esto importa todas las funciones necesarias para construir migraciones (createTable, addColumns, etc.).
import { createTable } from '@nozbe/watermelondb/Schema/migrations'; 

export default {
  toVersion: 2,
  steps: [
    // El único "paso" en esta migración es crear la nueva tabla 'pagos'
    createTable({
      name: 'pagos',
      columns: [
        { name: 'cliente_id', type: 'string', isIndexed: true },
        { name: 'monto', type: 'number' },
        { name: 'fecha', type: 'number' },
      ],
    }),
  ],
};