import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Node } from './Node';

@Entity()
export class Link {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Column({ type: 'float', default: 1.0 })
    strength: number;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Source Node relationship
    @ManyToOne(() => Node, node => node.outgoingLinks)
    @JoinColumn({ name: 'sourceNodeId' })
    sourceNode: Node;

    @Column()
    sourceNodeId: string;

    // Target Node relationship
    @ManyToOne(() => Node, node => node.incomingLinks)
    @JoinColumn({ name: 'targetNodeId' })
    targetNode: Node;

    @Column()
    targetNodeId: string;
}