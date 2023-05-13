import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column()
    description: string;

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

    // Validación adicional para evitar cadenas que contengan solo espacios en blanco
    @BeforeUpdate()
    trimStrings() {
        this.name = this.name.trim();
        this.description = this.description.trim();
    }
}
