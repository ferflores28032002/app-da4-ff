import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { unique: true })
    email: string;

    @Column('varchar')
    password: string;

    @Column('boolean', { default: true })
    isActive: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt?: Date;

    @BeforeUpdate()
    updateDeleteAt() {
        if (this.isActive === false && !this.deleteAt) {
            this.deleteAt = new Date();
        }
    }
}
