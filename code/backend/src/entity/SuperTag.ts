import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './User';
import { Field } from './Field';
import { NodeSuperTag } from './NodeSuperTag';

@Entity()
export class SuperTag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // User relationship
    @ManyToOne(() => User, user => user.superTags)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    // Relationships
    @OneToMany(() => Field, field => field.superTag)
    fields: Field[];

    @OneToMany(() => NodeSuperTag, nodeSuperTag => nodeSuperTag.superTag)
    nodeSuperTags: NodeSuperTag[];
}