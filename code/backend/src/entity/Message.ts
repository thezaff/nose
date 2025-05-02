import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Conversation } from './Conversation';

@Entity()
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    content: string;

    @Column()
    role: string;

    @Column({ type: 'json', nullable: true })
    nodeReferences: string[];

    @Column({ type: 'json', nullable: true })
    entities: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    // Conversation relationship
    @ManyToOne(() => Conversation, conversation => conversation.messages)
    @JoinColumn({ name: 'conversationId' })
    conversation: Conversation;

    @Column()
    conversationId: string;
}