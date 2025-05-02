import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Message } from './Message';

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'json', nullable: true })
    context: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // User relationship
    @ManyToOne(() => User, user => user.conversations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    // Relationships
    @OneToMany(() => Message, message => message.conversation)
    messages: Message[];
}