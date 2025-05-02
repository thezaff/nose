import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Agent } from './Agent';
import { Conversation } from './Conversation';
import { Node } from './Node';

export enum ActionType {
    CREATE_CONNECTION = 'CREATE_CONNECTION',
    APPLY_SUPERTAG = 'APPLY_SUPERTAG',
    ORGANIZE_NODES = 'ORGANIZE_NODES',
    EXTRACT_ENTITY = 'EXTRACT_ENTITY',
    SUGGEST_SUMMARY = 'SUGGEST_SUMMARY',
    ANSWER_QUERY = 'ANSWER_QUERY'
}

export enum ActionStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXECUTED = 'executed',
    FAILED = 'failed'
}

@Entity()
export class AgentAction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: ActionType
    })
    type: ActionType;

    @Column({ type: 'json' })
    payload: Record<string, any>;

    @Column({
        type: 'enum',
        enum: ActionStatus,
        default: ActionStatus.PENDING
    })
    status: ActionStatus;

    @Column({ default: false })
    approved: boolean;

    @Column({ type: 'text', nullable: true })
    result: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    executedAt: Date;

    // Agent relationship
    @ManyToOne(() => Agent, agent => agent.actions)
    @JoinColumn({ name: 'agentId' })
    agent: Agent;

    @Column()
    agentId: string;

    // Conversation relationship (optional)
    @ManyToOne(() => Conversation, { nullable: true })
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column({ nullable: true })
    conversationId: string;

    // Affected node relationship (optional)
    @ManyToOne(() => Node, { nullable: true })
    @JoinColumn({ name: 'nodeId' })
    node: Node;

    @Column({ nullable: true })
    nodeId: string;
}