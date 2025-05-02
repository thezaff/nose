import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Node } from './Node';
import { SuperTag } from './SuperTag';

@Entity()
export class NodeSuperTag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    // Node relationship
    @ManyToOne(() => Node, node => node.nodeSuperTags)
    @JoinColumn({ name: 'nodeId' })
    node: Node;

    @Column()
    nodeId: string;

    // SuperTag relationship
    @ManyToOne(() => SuperTag, superTag => superTag.nodeSuperTags)
    @JoinColumn({ name: 'superTagId' })
    superTag: SuperTag;

    @Column()
    superTagId: string;
}