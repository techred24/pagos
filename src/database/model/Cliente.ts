// src/database/model/Cliente.ts

import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export default class Cliente extends Model {
  static table = 'clientes'; // Nombre de la tabla en el esquema

  // Los decoradores definen qué campos de la tabla mapean a propiedades del modelo.
  // WatermelonDB automáticamente maneja el 'id' primario.
  @field('nombre')
  nombre!: string;

  @field('direccion')
  direccion!: string | null; // Es opcional, por eso puede ser string o null

  @field('telefono')
  telefono!: string | null; // Es opcional

  @field('created_at')
  createdAt!: number;
}