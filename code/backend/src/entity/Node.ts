import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { NodeSuperTag } from './NodeSuperTag';
import { FieldValue } from './FieldValue';
import { Link } from './Link';

@Entity()
export class Node {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: false })
    isArchived: boolean;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // User relationship
    @ManyToOne(() => User, user => user.nodes)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    // Relationships
    @OneToMany(() => NodeSuperTag, nodeSuperTag => nodeSuperTag.node)
    nodeSuperTags: NodeSuperTag[];

    @OneToMany(() => FieldValue, fieldValue => fieldValue.node)
    fieldValues: FieldValue[];

    @OneToMany(() => Link, link => link.sourceNode)
    outgoingLinks: Link[];

    @OneToMany(() => Link, link => link.targetNode)
    incomingLinks: Link[];
}