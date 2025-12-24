import { Model, Relation } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";
import Cliente from './Cliente';

export default class Prestamo extends Model {
    static table = 'prestamos';

    static associations = {
        clientes: { type: 'belongs_to' as const, key: 'cliente_id' },
    }
    @relation('clientes', 'cliente_id')
    cliente!: Relation<Cliente>;

    @field('cliente_id')
    clienteId!: string;

    @field('monto')
    monto!: number;

    @field('fecha_entrega')
    fechaEntrega!: number;

    @field('estado')
    estado!: string;
}