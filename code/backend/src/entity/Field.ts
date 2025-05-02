import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SuperTag } from './SuperTag';
import { FieldValue } from './FieldValue';

@Entity()
export class Field {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column({ default: false })
    isRequired: boolean;

    @Column({ nullable: true })
    defaultValue: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // SuperTag relationship
    @ManyToOne(() => SuperTag, superTag => superTag.fields)
    @JoinColumn({ name: 'superTagId' })
    superTag: SuperTag;

    @Column()
    superTagId: string;

    // Relationships
    @OneToMany(() => FieldValue, fieldValue => fieldValue.field)
    fieldValues: FieldValue[];
}