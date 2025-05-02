import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { AgentAction } from './AgentAction';

export enum AgentType {
    ORGANIZATION = 'organization',
    CONNECTION = 'connection',
    QUERY = 'query',
    SUMMARY = 'summary'
}

@Entity()
export class Agent {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: AgentType,
        default: AgentType.ORGANIZATION
    })
    type: AgentType;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'json', default: {} })
    configuration: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // User relationship
    @ManyToOne(() => User, user => user.agents)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    // Relationships
    @OneToMany(() => AgentAction, agentAction => agentAction.agent)
    actions: AgentAction[];
}