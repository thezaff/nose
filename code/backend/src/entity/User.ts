import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Node } from './Node';
import { SuperTag } from './SuperTag';
import { Conversation } from './Conversation';
import { Agent } from './Agent';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ nullable: true, type: 'json' })
    preferences: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relationships
    @OneToMany(() => Node, node => node.user)
    nodes: Node[];

    @OneToMany(() => SuperTag, superTag => superTag.user)
    superTags: SuperTag[];

    @OneToMany(() => Conversation, conversation => conversation.user)
    conversations: Conversation[];

    @OneToMany(() => Agent, agent => agent.user)
    agents: Agent[];
}