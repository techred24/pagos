// src/database/schema.ts

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const mySchema = appSchema({
  version: 1, // La versión de tu esquema. Si cambias el esquema, incrementa este número.
  tables: [
    tableSchema({
      name: 'clientes', // Nombre de la tabla
      columns: [
        { name: 'nombre', type: 'string' },
        { name: 'direccion', type: 'string', isOptional: true },
        { name: 'telefono', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' }, // WatermelonDB recomienda esta columna
      ],
    }),
    // Aquí irán las demás tablas
    tableSchema({
      name: 'prestamos',
      columns: [
        { name: 'cliente_id', type: 'string', isIndexed: true },
        { name: 'monto', type: 'number' },
        { name: 'fecha_entrega', type: 'number' },
        { name: 'estado', type: 'string' }
      ]
    })
  ],
});