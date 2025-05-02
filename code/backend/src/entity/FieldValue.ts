import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Node } from './Node';
import { Field } from './Field';

@Entity()
export class FieldValue {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    value: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Node relationship
    @ManyToOne(() => Node, node => node.fieldValues)
    @JoinColumn({ name: 'nodeId' })
    node: Node;

    @Column()
    nodeId: string;

    // Field relationship
    @ManyToOne(() => Field, field => field.fieldValues)
    @JoinColumn({ name: 'fieldId' })
    field: Field;

    @Column()
    fieldId: string;
}